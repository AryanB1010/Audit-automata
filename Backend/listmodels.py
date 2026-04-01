from google import genai
from passkey import GEMINI_API_KEY

# Gemini Client setup
client = genai.Client(api_key=GEMINI_API_KEY)

def list_available_models():
    print("--- Available Gemini Models for your API Key ---")
    print(f"{'Model Name':<40}")
    print("-" * 50)
    
    try:
        # Naye SDK mein hum seedha client.models.list() use karte hain
        for m in client.models.list():
            # Hum saare models print karenge taaki aapko exact naam mil jaye
            print(f"{m.name:<40}")
                
    except Exception as e:
        print(f"Error fetching models: {str(e)}")

if __name__ == "__main__":
    list_available_models()