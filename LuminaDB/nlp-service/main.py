import os
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import spacy

app = FastAPI(title="LuminaDB NLP Service (Local Engine)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

# Lazy load spaCy
nlp = None

def get_nlp():
    global nlp
    import spacy
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except OSError:
            import spacy.cli
            spacy.cli.download("en_core_web_sm")
            nlp = spacy.load("en_core_web_sm")
    return nlp


@app.on_event("startup")
async def startup_event():
    # Warm up mapping on startup
    get_nlp()

@app.post("/translate")
async def translate_query(req: QueryRequest):
    prompt = req.prompt.lower()
    local_nlp = get_nlp()
    doc = local_nlp(prompt)
    
    # -------------------------------------------------------------
    # Simulated Local intent classification and extraction pipeline
    # (Replaces the slow/paid generative OpenAI integration)
    # -------------------------------------------------------------
    
    mql = {
        "collection": "Product",
        "action": "find",
        "query": {}
    }
    
    # 1. Collection Classification
    if any(token.lemma_ in ["user", "customer", "admin", "client"] for token in doc):
        mql["collection"] = "User"
        if "admin" in prompt:
            mql["query"]["role"] = "Admin"
        elif "customer" in prompt:
            mql["query"]["role"] = "Customer"
            
    elif any(token.lemma_ in ["order", "purchase", "amount"] for token in doc):
        mql["collection"] = "Order"
        if "pending" in prompt:
            mql["query"]["status"] = "Pending"
            
        # Extract numerical quantities using Regex mapped to intent
        match = re.search(r'>\s*(\d+)|greater than\s*(\d+)', prompt)
        if match:
            val = int(match.group(1) or match.group(2))
            mql["query"]["totalAmount"] = {"$gt": val}
            
    else:
        mql["collection"] = "Product"
        if "electronic" in prompt:
            mql["query"]["category"] = "Electronics"
        
        # Limit extraction
        match = re.search(r'top\s*(\d+)', prompt)
        if match:
            mql["limit"] = int(match.group(1))
            
        if "expensive" in prompt or "price" in prompt:
            mql["sort"] = {"price": -1}

    return mql

@app.get("/health")
def health_check():
    return {"status": "OK", "service": "LuminaDB Local NLP (spaCy)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
