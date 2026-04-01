from pydantic import BaseModel
from typing import List, Optional

class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    category: Optional[str] = None  # filled later by Legal Agent

class TaxMatch(BaseModel):
    transaction: Transaction
    section: str           # e.g. "Section 80C"
    law_text: str          # from your RAG vector DB
    deduction_allowed: float

class AuditReport(BaseModel):
    total_deductions_found: float
    missed_opportunities: List[str]
    risk_score: int        # 0-100
    matches: List[TaxMatch]
    summary: str