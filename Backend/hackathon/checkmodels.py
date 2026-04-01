import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

print("\n--- Scanning Available Models (Fixed Version) ---")
try:
    # Naye SDK mein list() generator return karta hai
    for model in client.models.list():
        # 'supported_methods' ki jagah ab 'supported_actions' hai
        if 'embedContent' in model.supported_actions:
            print(f"✅ Model Name: {model.name}")
except Exception as e:
    print(f"❌ Abhi bhi panga hai: {e}")