from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
import os

from app.services.speech_service import transcribe_audio
from app.services.translation_service import translate_text
from app.services.tts_service import TTSService
import traceback

router = APIRouter(
    prefix="/speech",
    tags=["Speech"]
)


@router.get("/output-audio")
async def get_output_audio():
    file_path = "output.mp3"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Audio file not found")


from app.services.languages import LANGUAGES, WHISPER_LANG_MAP, WHISPER_TO_NLLB

@router.post("/translate-and-speak")
async def translate_and_speak(
    file: UploadFile = File(...),
    source_lang: str = Form("eng_Latn"),
    target_lang: str = Form("hin_Deva")
):

    try:
        # Determine source language hint for Whisper ASR
        whisper_hint = None
        if source_lang != "auto":
            lang_prefix = source_lang.split("_")[0] if "_" in source_lang else source_lang
            whisper_hint = WHISPER_LANG_MAP.get(lang_prefix)

        # Transcribe audio file
        asr_res = transcribe_audio(file, language=whisper_hint)
        transcript = asr_res["text"]
        detected_language = asr_res["detected_language"]

        # Determine NLLB source language dynamically
        nllb_src_lang = source_lang
        if source_lang == "auto" and detected_language:
            # Map detected language to NLLB code format
            nllb_src_lang = WHISPER_TO_NLLB.get(detected_language.lower(), "eng_Latn")

        print(f"🎙️ Whisper ASR transcribing: '{transcript}' | Detected Lang: {detected_language} | NLLB Source: {nllb_src_lang} ➔ Target: {target_lang}")

        # 1. Punctuation Restoration
        from app.services.punctuation_service import restore_punctuation
        punctuated_transcript = restore_punctuation(transcript)

        # 2. Grammar Correction
        from app.services.grammar_service import correct_grammar
        corrected_transcript = correct_grammar(punctuated_transcript)

        # 3. Translation
        translated = translate_text(corrected_transcript, src_lang=nllb_src_lang, tgt_lang=target_lang)
        audio_file = TTSService.generate_speech(translated);

        return {
            "success": True,
            "speaker": "Speaker A",
            "original_transcript": transcript,
            "corrected_transcript": corrected_transcript,
            "transcript": corrected_transcript,  # fallback for backward compatibility
            "translated_text": translated,
            "output_audio_url": "http://localhost:8000/speech/output-audio"
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )