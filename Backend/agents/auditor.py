from google import genai
from passkey import GEMINI_API_KEY
import json

client = genai.Client(api_key=GEMINI_API_KEY)


def clean_json(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()


def run_auditor(tax_matches: list[dict], all_transactions: list[dict]) -> dict:

    prompt = f"""
    Context: {json.dumps(tax_matches)}

    User Query: Analyze these transactions and calculate tax savings 
    based on Indian Income Tax Law FY 2024-25.

    Answer the user's query based ONLY on the context provided.
    Do not use any outside knowledge beyond what is in the context.

    Also look at all transactions for missed opportunities:
    {json.dumps(all_transactions[:50])}

    Return a JSON object with exactly these keys:
    - total_deductions_found: total rupee amount of valid deductions (number)
    - missed_opportunities: list of strings describing deductions the user 
      could have taken but did not
    - risk_score: integer 0-100 (higher means more audit risk)
    - summary: 2-3 sentence plain English summary for the user

    Return only valid JSON. No explanation. No markdown formatting.
    """

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )
    cleaned = clean_json(response.text)
    return json.loads(cleaned)