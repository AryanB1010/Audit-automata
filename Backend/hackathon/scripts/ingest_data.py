import os
import time  # Import for delay
from dotenv import load_dotenv
from google import genai
from google.genai import types
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import create_client

load_dotenv()

client_genai = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

def run_ingestion():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    pdf_path = os.path.join("data", "Exemptionsanddeductions.pdf")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=300)
    docs = text_splitter.split_documents(documents)
    print(f"✂️ {len(docs)} chunks ready.")

    class GeminiEmbeddings:
        def embed_documents(self, texts):
            all_embeddings = []
            for i in range(0, len(texts), 90):
                batch = texts[i:i + 90]
                print(f"🚀 Processing batch starting at index {i}...")
                
                response = client_genai.models.embed_content(
                    model='gemini-embedding-001',
                    contents=batch,
                    config=types.EmbedContentConfig(task_type='RETRIEVAL_DOCUMENT')
                )
                all_embeddings.extend([item.values for item in response.embeddings])
                
                # FREE TIER FIX: Wait for 60 seconds after each batch to reset quota
                if i + 90 < len(texts):
                    print("😴 Waiting 60s for Google Free Tier quota to reset...")
                    time.sleep(60)
            
            return all_embeddings

        def embed_query(self, text):
            response = client_genai.models.embed_content(
                model='gemini-embedding-001',
                contents=text,
                config=types.EmbedContentConfig(task_type='RETRIEVAL_QUERY')
            )
            return response.embeddings[0].values

    embeddings = GeminiEmbeddings()

    print("🚀 Supabase mein slow-but-steady push shuru...")
    try:
        vector_store = SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=supabase,
            table_name="tax_documents",
            query_name="match_documents",
        )
        print("✅ FINAL VICTORY! Tera pura data upload ho gaya hai.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    run_ingestion()