import os
import tempfile
from groq import Groq
from app.core.config import GROQ_API_KEY

# Initialize the Groq cloud instance
client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio(file, language=None):
    # 1. Create a safe temporary file on the host machine disk
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        temp_file.write(file.file.read())
        temp_path = temp_file.name

    # 2. Use try/finally to guarantee file deletion even if Groq crashes
    try:
        # 3. Open the newly created physical file track from disk
        with open(temp_path, "rb") as audio_file:
            # 4. Stream payload directly into Groq Cloud Whisper API
            params = {
                "file": audio_file,
                "model": "whisper-large-v3",
                "response_format": "verbose_json"
            }
            # Only pass language hint if it's explicitly set and not auto-detection mode
            if language and language != "auto":
                params["language"] = language

            transcription = client.audio.transcriptions.create(**params)
        
        # 5. Return text and detected language properties
        return {
            "text": transcription.text,
            "detected_language": getattr(transcription, "language", None)
        }

    finally:
        # 6. Always execute this to keep server disk space completely empty
        if os.path.exists(temp_path):
            os.remove(temp_path)
