from fastapi import APIRouter, UploadFile, File, HTTPException
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


@router.post("/translate-and-speak")
async def translate_and_speak(file: UploadFile = File(...)):

    try:
        transcript = transcribe_audio(file)

        translated = translate_text(transcript)
        audio_file = TTSService.generate_speech(translated);

        return {
            "success": True,
            "transcript": transcript,
            "translated_text": translated,
            "output_audio_url": "http://localhost:8000/speech/output-audio"
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )