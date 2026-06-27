import os
import tempfile
from groq import Groq
from app.core.config import GROQ_API_KEY

# Initialize the Groq cloud instance
client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio(file):
    # 1. Create a safe temporary file on the host machine disk
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        temp_file.write(file.file.read())
        temp_path = temp_file.name

    # 2. Use try/finally to guarantee file deletion even if Groq crashes
    try:
        # 3. Open the newly created physical file track from disk
        with open(temp_path, "rb") as audio_file:
            # 4. Stream payload directly into Groq Cloud Whisper API
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="json"
            )
        
        # 5. Return the clean text payload string back to the API service layer
        return transcription.text

    finally:
        # 6. Always execute this to keep server disk space completely empty
        if os.path.exists(temp_path):
            os.remove(temp_path)
