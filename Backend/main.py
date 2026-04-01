from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import shutil, os, json, asyncio, tempfile

from agents.scanner import run_scanner
from agents.legal import run_legal
from agents.auditor import run_auditor

app = FastAPI()

# Frontend (Vite/React) ke liye CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Hackathon ke liye "*" safe hai, saare origins allow ho jayenge
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    
    # WINDOWS FIX: System ka default temp folder use karo
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)
    
    # Save uploaded PDF to disk temporarily
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    async def event_stream():
        try:
            # Agent 1 — Scanner
            yield f"data: Scanner Agent: Reading {file.filename}...\n\n"
            await asyncio.sleep(0.1)
            transactions = run_scanner(temp_path)
            yield f"data: Scanner Agent: Found {len(transactions)} transactions.\n\n"
            await asyncio.sleep(0.1)
            
            # Agent 2 — Legal
            yield f"data: Legal Agent: Filtering tax-relevant entries...\n\n"
            await asyncio.sleep(0.1)
            tax_matches = run_legal(transactions)
            yield f"data: Legal Agent: Matched {len(tax_matches)} deductions to law sections.\n\n"
            await asyncio.sleep(0.1)
            
            # Agent 3 — Auditor
            yield f"data: Auditor Agent: Calculating savings and risk score...\n\n"
            await asyncio.sleep(0.1)
            report = run_auditor(tax_matches, transactions)
            yield f"data: Auditor Agent: Done.\n\n"
            await asyncio.sleep(0.1)
            
            # Send final report to frontend
            yield f"data: REPORT:{json.dumps(report)}\n\n"
            
        except Exception as e:
            yield f"data: ERROR: {str(e)}\n\n"
        
        finally:
            # Cleanup: Kaam khatam hone ke baad temp file delete kar do
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    return StreamingResponse(event_stream(), media_type="text/event-stream")