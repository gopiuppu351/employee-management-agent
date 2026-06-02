import os
import warnings
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
if not ANTHROPIC_API_KEY:
    warnings.warn("ANTHROPIC_API_KEY is not set. Chat endpoints will fail. Add it to backend/.env")
