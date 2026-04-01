from google import genai
from supabase import create_client
from passkey import GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

# FIX: Yahan 'v1' ki jagah 'v1beta' use karein
gemini_client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={'api_version': 'v1beta'}
)

# Supabase Client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def search_tax_law(query: str) -> str:
    try:
        # Step 1: Embedding generate karna
        embedding_response = gemini_client.models.embed_content(
            model="models/gemini-embedding-001", 
            contents=query
        )
        query_vector = embedding_response.embeddings[0].values
        
        # Step 2: Supabase Search
        # rag.py ke andar Step 2 ko aise update karein:
        result = supabase.rpc(
        "match_documents",
        {
        "query_embedding": query_vector,
        "match_threshold": 0.5, # 0.5 ka matlab 50% similarity. Isse results milna shuru honge.
        "match_count": 3
        }
        ).execute()
        
        if result.data:
            combined_text = "\n\n".join([doc["content"] for doc in result.data])
            return combined_text
        
        return "No relevant tax section found."

    except Exception as e:
        # Error details print karein taaki debug ho sake
        return f"Error: {str(e)}"