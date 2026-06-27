from fastapi import APIRouter

router = APIRouter()

@router.get("/translation")
def translation():
     return{
          "message": "Hello its translation Modeule!"
     }