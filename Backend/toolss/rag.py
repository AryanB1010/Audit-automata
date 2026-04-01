import os
from google import genai
from google.genai import types
from supabase import create_client
from passkey import GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY

# Clients Setup
client_genai = genai.Client(api_key=GEMINI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def search_tax_law(query: str) -> str:
    try:
        # 1. Query ki Embedding banao
        response = client_genai.models.embed_content(
            model='gemini-embedding-001',
            contents=query,
            config=types.EmbedContentConfig(task_type='RETRIEVAL_QUERY')
        )
        query_vector = response.embeddings[0].values
        
        # 2. Supabase mein Match dhoondo
        result = supabase.rpc('match_documents', {
            'query_embedding': query_vector,
            'match_threshold': 0.3, 
            'match_count': 3
        }).execute()
        
        if result.data:
            combined_text = "\n\n".join([doc["content"] for doc in result.data])
            return combined_text
        
        return "No relevant tax section found."
    except Exception as e:
        return f"RAG Error: {str(e)}"