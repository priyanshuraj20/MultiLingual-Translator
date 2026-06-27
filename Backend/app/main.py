from fastapi import FastAPI
from api.health import router as health_router
from api.speech import router as speech_router
from api.translation import router as translation_router

app = FastAPI(
    title="LiveLingua API",
    description="Real-Time Ai Multilingual Speech Translation Platform",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(speech_router)
app.include_router(translation_router)
