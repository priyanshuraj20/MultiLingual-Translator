import os
from dotenv import load_dotenv

# Load .env file from the app directory where config.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, "..", ".env")
load_dotenv(dotenv_path=dotenv_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# abb poore project mein api key yahi se access hogi