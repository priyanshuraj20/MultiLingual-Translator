from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def correct_grammar(text: str) -> str:
    """
    Improves grammatical structures, spelling, and word choices to make the text natural.
    Preserves meaning and avoids summarization or dialog headers.
    """
    if not text or not text.strip():
        return text

    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI assistant that corrects grammatical errors in the input text. "
                        "Improve the grammar, spelling, and structural flow of the text to be completely correct and natural. "
                        "Do NOT summarize the text, do NOT change the meaning, and do NOT add any conversational prefixes, "
                        "explanations, or comments. Output ONLY the corrected text."
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
        print(f"Grammar correction service failure: {e}")
        return text
