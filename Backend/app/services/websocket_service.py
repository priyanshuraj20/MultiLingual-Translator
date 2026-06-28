"""
WEBSOCKET STREAM TRANSLATION SERVICE

ARCHITECTURAL DESIGN DECISIONS (WHY WE DID THIS):

1. WHY PCM WAV ENCAPSULATION?
   Speech-to-text models like Whisper cannot decode raw binary PCM byte audio streams directly because they lack a container.
   We append a standard 44-byte WAV header containing channel, bit rate, and sampling frequency (16kHz mono) to the raw PCM bytes, 
   turning it into a standard WAV container in-memory.

2. WHY IN-MEMORY MOCK UPLOAD FILE?
   Writing audio data to the disk causes major SSD/HDD disk I/O bottlenecks. 
   Using the MockUploadFile class, we wrap bytes into an in-memory io.BytesIO stream, satisfying FastAPI's dependency injection interfaces
   without incurring a single disk write.

3. WHY VOICE ACTIVITY DETECTION (VAD) VIA RMS?
   Running Speech transcription and Translation model runs for quiet silence wastes server compute power and incurs massive API costs. 
   We calculate the Root Mean Square (RMS) amplitude of incoming audio bytes. If the RMS is below 150.0, the speaker is silent, and we skip API triggers.

4. WHY RUN TRANSLATIONS IN THREAD EXECUTORS (run_in_executor)?
   Whisper translation is CPU and I/O bound. If we run them directly in the main thread of our async event loop, the entire FastAPI server freezes, 
   blocking other clients. By offloading these tasks to a ThreadPoolExecutor (run_in_executor), the event loop remains free to serve incoming packets.

5. WHY BUFFER RESET ON SUCCESS?
   Once a sentence is successfully transcribed and translated, we clear the client's audio buffer. 
   This prevents the Whisper engine from translating stale historical sound segments, avoiding context drift and translation hallucinations.
"""

import io
import asyncio
from fastapi import WebSocket
from app.services.speech_service import transcribe_audio
from app.services.translation_service import translate_text
from app.services.tts_service import TTSService
import struct

def calculate_rms(pcm_data: bytes) -> float:
    """
    Calculates the Root Mean Square (RMS) amplitude of raw 16-bit PCM bytes.
    """
    if not pcm_data:
        return 0.0
    # Keep slice aligned to 2-byte boundary (16-bit)
    pcm_data = pcm_data[:(len(pcm_data) // 2) * 2]
    count = len(pcm_data) // 2
    if count == 0:
        return 0.0
    try:
        samples = struct.unpack(f"<{count}h", pcm_data)
        sum_squares = sum(s * s for s in samples)
        return (sum_squares / count) ** 0.5
    except Exception:
        return 0.0

def encode_pcm_to_wav(pcm_data: bytes) -> bytes:
    """
    Encodes raw 16kHz mono 16-bit PCM bytes into a standard WAV container.
    """
    sample_rate = 16000
    bits_per_sample = 16
    channels = 1
    
    header = bytearray(44)
    header[0:4] = b'RIFF'
    file_size = 36 + len(pcm_data)
    header[4:8] = struct.pack('<I', file_size)
    header[8:12] = b'WAVE'
    header[12:16] = b'fmt '
    header[16:20] = struct.pack('<I', 16)
    header[20:22] = struct.pack('<H', 1)  # PCM format
    header[22:24] = struct.pack('<H', channels)
    header[24:28] = struct.pack('<I', sample_rate)
    header[28:32] = struct.pack('<I', sample_rate * channels * (bits_per_sample // 8))
    header[32:34] = struct.pack('<H', channels * (bits_per_sample // 8))
    header[34:36] = struct.pack('<H', bits_per_sample)
    header[36:40] = b'data'
    header[40:44] = struct.pack('<I', len(pcm_data))
    
    return bytes(header) + pcm_data

class MockUploadFile:
    """
    In-memory mock file-like wrapper to satisfy the transcribe_audio signature.
    """
    def __init__(self, file_bytes):
        self.file = io.BytesIO(file_bytes)

async def handle_stream(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket client connected to translation streaming pipeline.")

    # Retrieve source and target languages dynamically from query parameters (defaults: eng_Latn -> hin_Deva)
    source_lang = websocket.query_params.get("source_lang", "eng_Latn")
    target_lang = websocket.query_params.get("target_lang", "hin_Deva")

    audio_buffer = bytearray()
    last_transcribe_len = 0

    try:
        while True:
            audio = await websocket.receive_bytes()
            audio_buffer.extend(audio)

            # Trigger transcription every 2 seconds of new audio (1 sec = 32000 bytes for 16kHz 16-bit mono)
            if len(audio_buffer) - last_transcribe_len >= 64000:
                # Isolate the newly captured slice to perform Voice Activity Detection (VAD)
                new_slice = bytes(audio_buffer[last_transcribe_len:])
                rms = calculate_rms(new_slice)
                
                print(f"Segment captured (len={len(new_slice)}). RMS Amplitude: {rms:.2f}")

                # Lowered silence threshold to 150.0 to capture quiet speakers reliably
                if rms < 150.0:
                    print("Silence detected (amplitude below 150.0). Skipping API call.")
                    # Prevent buffer from growing infinitely with silence
                    if len(audio_buffer) > 160000:
                        audio_buffer = audio_buffer[-64000:]
                        last_transcribe_len = 0
                    continue

                # Convert current buffer to WAV
                wav_bytes = encode_pcm_to_wav(bytes(audio_buffer))
                mock_file = MockUploadFile(wav_bytes)

                try:
                    # Determine source language hint for Whisper ASR
                    whisper_hint = None
                    from app.services.languages import WHISPER_LANG_MAP, WHISPER_TO_NLLB
                    if source_lang != "auto":
                        lang_prefix = source_lang.split("_")[0] if "_" in source_lang else source_lang
                        whisper_hint = WHISPER_LANG_MAP.get(lang_prefix)

                    # Execute CPU/IO-bound translation services inside thread executor to prevent event loop blocking
                    loop = asyncio.get_event_loop()
                    asr_res = await loop.run_in_executor(None, transcribe_audio, mock_file, whisper_hint)
                    transcript = asr_res["text"]
                    detected_language = asr_res["detected_language"]
                    
                    if transcript and transcript.strip():
                        # Resolve NLLB source language dynamically
                        nllb_src_lang = source_lang
                        if source_lang == "auto" and detected_language:
                            nllb_src_lang = WHISPER_TO_NLLB.get(detected_language.lower(), "eng_Latn")

                        translated = await loop.run_in_executor(None, translate_text, transcript, nllb_src_lang, target_lang)
                        
                        # Generate ElevenLabs TTS audio file (saved as output.mp3 on the server)
                        await loop.run_in_executor(None, TTSService.generate_speech, translated)

                        # Broadcast transcript and NLLB translated Hindi text back to the extension
                        await websocket.send_json({
                            "transcript": transcript,
                            "translation": translated
                        })
                        print(f"Live STT: {transcript} -> Translation: {translated}")
                        
                        # ✅ Reset buffer & state on success so next translation/audio represents only the new sentence
                        audio_buffer = bytearray()
                        last_transcribe_len = 0
                    else:
                        # Keep accumulating if Whisper returned an empty result
                        last_transcribe_len = len(audio_buffer)
                except Exception as ex:
                    print(f"Error during audio translation slice processing: {ex}")
                    last_transcribe_len = len(audio_buffer)

    except Exception as e:
        print(f"WebSocket translation streaming closed/disconnected: {e}")