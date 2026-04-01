from toolss.rag import search_tax_law
from google import genai
from passkey import GEMINI_API_KEY
import json
import re

client = genai.Client(api_key=GEMINI_API_KEY)


def clean_json(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()


def run_legal(transactions: list[dict]) -> list[dict]:

    transactions_json = json.dumps(transactions, indent=2)

    filter_prompt = f"""
    You are an Indian tax expert.
    
    From the transaction list below, identify ONLY transactions that 
    could qualify for income tax deductions under Indian tax law.
    
    Categories to look for:
    - insurance: LIC, term insurance, health insurance premiums
    - investment: ELSS, PPF, NSC, tax-saving FD, mutual funds
    - rent: house rent payments (for HRA)
    - medical: hospital bills, medical expenses
    - donation: NGO donations, charitable payments
    - education: school fees, education loan interest
    - nps: National Pension Scheme contributions
    
    Do NOT include food, entertainment, shopping, or utility bills.
    
    Transactions:
    {transactions_json}
    
    Return a JSON object with key "transactions" containing only 
    the relevant ones. Add a "category" field to each.
    
    Return only valid JSON. No explanation. No markdown formatting.
    """

    filter_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=filter_prompt
    )
    cleaned = clean_json(filter_response.text)
    filtered_data = json.loads(cleaned)
    relevant_transactions = filtered_data.get("transactions", [])

    tax_matches = []

    for txn in relevant_transactions:
        category = txn.get("category", "general")
        description = txn.get("description", "")
        query = f"{category} deduction {description} India income tax"

        law_text = search_tax_law(query)
        section = extract_section_name(law_text)

        tax_matches.append({
            "transaction": txn,
            "section": section,
            "law_text": law_text,
            "deduction_allowed": abs(txn.get("amount", 0))
        })

    return tax_matches


def extract_section_name(law_text: str) -> str:
    match = re.search(r'Section\s+[\w\(\)]+', law_text)
    return match.group(0) if match else "General deduction"