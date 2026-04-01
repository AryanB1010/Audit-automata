import pdfplumber
import json
from google import genai
from passkey import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def run_scanner(pdf_path: str) -> list[dict]:
    
    # Part 1: Extract raw text from PDF
    raw_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            raw_text += page.extract_text() or ""
    
    # Part 2: Ask Gemini to structure it
    prompt = f"""
    Below is raw text from a bank statement.
    Extract ALL transactions and return ONLY a valid JSON object.
    The JSON must have a key "transactions" containing an array.
    Each item must have: date, description, amount (negative = debit).
    
    Raw text:
    {raw_text[:8000]}
    
    Return only valid JSON. No explanation. No markdown formatting.
    """
    
    response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=prompt
    )
    
    # Clean the response — Gemini sometimes adds ```json ``` around it
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    
    data = json.loads(text)
    return data.get("transactions", [])