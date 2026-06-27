from fastapi import APIRouter,File, UploadFile
from app.services.speech_service import transcribe_audio





router = APIRouter(prefix="/speech", tags=["Speech"])




# we are reciving  audio.webm  so FastApi uses 
#File(...) means parameter is required
@router.post("/transcribe")
async def upload_audio(file: UploadFile = File(...)):
    print(file.filename)
    transcript = transcribe_audio(file)

    return {
    "success": True,
    "transcript": transcript
}