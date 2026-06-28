from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def restore_punctuation(text: str) -> str:
    """
    Restores correct punctuation, casing, and sentence segmentation to the raw Whisper transcript.
    """
    if not text or not text.strip():
        return text

    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert transcriber. Your task is to restore appropriate punctuation "
                        "(commas, periods, question marks, capitalization, etc.) to the input transcription. "
                        "Do not add, remove, or alter any words. Preserve the original meaning exactly. "
                        "Do not explain your changes or add conversational responses. Output ONLY the clean punctuated text."
                    )
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            model="llama3-8b-8192",
            temperature=0.0
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Punctuation service failure: {e}")
        return text
