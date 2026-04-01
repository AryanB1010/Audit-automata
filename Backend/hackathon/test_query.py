import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from supabase.client import create_client

# 1. Setup
load_dotenv()
client_genai = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))
supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))

def test_my_database(user_question):
    print(f"\n🤔 Sawaal: {user_question}")
    
    # 2. Question ko embedding mein badlo
    response = client_genai.models.embed_content(
        model='gemini-embedding-001',
        contents=user_question,
        config=types.EmbedContentConfig(task_type='RETRIEVAL_QUERY')
    )
    query_vector = response.embeddings[0].values

    # 3. Supabase se match dhoondo
    # Ye wahi 'match_documents' function hai jo humne SQL mein banaya tha
    try:
        result = supabase.rpc('match_documents', {
            'query_embedding': query_vector,
            'match_threshold': 0.3, # Thoda low rakha hai taaki results pakka milein
            'match_count': 2        # Top 2 match dikhao
        }).execute()

        if not result.data:
            print("❌ Koi match nahi mila! Check karo kya data upload hua tha?")
            return

        print("✅ Database se ye laws mile hain:")
        for i, res in enumerate(result.data):
            print(f"\n--- Result {i+1} (Match Score: {round(res['similarity']*100, 2)}%) ---")
            print(res['content'][:500] + "...") # Shuru ka thoda sa text dikhayega
            
    except Exception as e:
        print(f"❌ Error: {e}")

# --- Test Case ---
if __name__ == "__main__":
    # Ek aisa sawal pucho jo PDF mein pakka ho (e.g., Section 80C ya Medical Insurance)
    test_my_database("What are the deductions for medical insurance under section 80D?")