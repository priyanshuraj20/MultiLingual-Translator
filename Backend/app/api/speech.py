from fastapi import APIRouter

router = APIRouter()

@router.get("/speech")
def speech():
    return {
        "message":"Speech Module"
    }