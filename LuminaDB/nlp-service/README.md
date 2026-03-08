# LuminaDB NLP Microservice (Local Edition)

This folder contains the standalone **Python FastAPI** AI application serving as the "Translation Brain" of LuminaDB. 

## Features
- **100% Local Inference**: It originally utilized the OpenAI API but has been refactored to use a local installation of the `spaCy` NLP library (`en_core_web_sm`).
- **Offline & Free**: Because it does not rely on external paid APIs, this microservice works completely offline. 
- **Rule-Based Intent Mapping**: It parses user prompts, detects context (like checking if the user said "admin", "electronic", "greater than"), extracts limits, and translates them sequentially into **Valid MongoDB Query Language (MQL)** JSON.

## Getting Started

1. Navigate to this directory:
   ```bash
   cd LuminaDB/nlp-service
   ```
2. Create and activate a Virtual Environment:
   ```bash
   # Create a virtual environment via python
   python -m venv venv
   
   # Activate it (Windows)
   .\venv\Scripts\activate 
   
   # Activate it (Mac/Linux)
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: The very first time it boots up, the script will automatically background-download the `en_core_web_sm` spaCy model)*

4. Run the Uvicorn FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

The NLP Microservice will be listening to translation REST requests at `http://localhost:8000/translate`.
