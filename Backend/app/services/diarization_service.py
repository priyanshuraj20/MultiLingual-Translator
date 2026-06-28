# diarization_service.py - Lightweight speaker diarization using peak frequency analysis
import numpy as np

class SpeakerDiarizer:
    def __init__(self):
        # List of known speakers: {"name": "Speaker A", "pitch": 120.0}
        self.speakers = []
        self.speaker_counter = 0

    def diarize(self, pcm_data: bytes, sample_rate: int = 16000) -> str:
        """
        Identify speaker based on the fundamental frequency (pitch) of raw 16-bit PCM bytes.
        Returns a speaker identifier string (e.g. "Speaker A").
        """
        if not pcm_data or len(pcm_data) < 512:
            return "Speaker A"

        try:
            # Convert 16-bit PCM bytes to float array
            audio = np.frombuffer(pcm_data, dtype=np.int16).astype(np.float32)
            
            # Compute FFT
            n = len(audio)
            fft_data = np.abs(np.fft.rfft(audio))
            frequencies = np.fft.rfftfreq(n, d=1.0/sample_rate)
            
            # Filter for human speech fundamental frequency (F0) range: 80Hz to 300Hz
            speech_indices = np.where((frequencies >= 80) & (frequencies <= 300))[0]
            if len(speech_indices) == 0:
                return self.speakers[0]["name"] if self.speakers else "Speaker A"
                
            speech_fft = fft_data[speech_indices]
            speech_freqs = frequencies[speech_indices]
            
            # Find peak frequency
            peak_idx = np.argmax(speech_fft)
            peak_freq = speech_freqs[peak_idx]
            
            # Compare with known speakers
            threshold = 30.0 # Hz difference to distinguish speakers
            for spk in self.speakers:
                if abs(spk["pitch"] - peak_freq) <= threshold:
                    # Update speaker's running average pitch to adapt to speaker variance
                    spk["pitch"] = 0.9 * spk["pitch"] + 0.1 * peak_freq
                    return spk["name"]
            
            # Register new speaker
            self.speaker_counter += 1
            name = f"Speaker {chr(65 + (self.speaker_counter - 1) % 26)}" # Speaker A, Speaker B, etc.
            self.speakers.append({"name": name, "pitch": peak_freq})
            print(f"👤 Diarizer: Registered new speaker: {name} (Pitch: {peak_freq:.1f} Hz)")
            return name
        except Exception as e:
            print(f"Diarizer Error: {e}")
            return "Speaker A"

# Global diarizer placeholder (can be instantiated per session if needed)
diarizer = SpeakerDiarizer()
