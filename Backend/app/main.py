print("MAIN.PY LOADED")
from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.speech import router as speech_router
from app.api.translation import router as translation_router


app = FastAPI(
    title="LiveLingua API",
    description="Real-Time Ai Multilingual Speech Translation Platform",
    version="1.0.0"
)


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(speech_router)
app.include_router(translation_router)

@app.get("/test")
def test_route():
    return {"status": "The server is alive!"}