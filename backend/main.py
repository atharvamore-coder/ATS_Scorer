# main.py
import os
import re
import json
import difflib
import pandas as pd
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# ==========================================
# 1. INITIALIZATION & DATA LOADING
# ==========================================

# Load environment variables from .env file
load_dotenv()

# Configure Google Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_actual_api_key_here":
    raise ValueError("❌ Please set your GEMINI_API_KEY in the .env file!")

genai.configure(api_key=api_key)
# Using 'gemini-1.5-flash' because it is the fastest and cheapest for simple extraction
model = genai.GenerativeModel('gemini-1.5-flash') 

# Load Local Jargon Dictionary
try:
    with open('jargon_dict.json', 'r', encoding='utf-8') as f:
        jargon_dict = json.load(f)
    print("✅ Loaded Jargon Dictionary.")
except FileNotFoundError:
    raise FileNotFoundError("❌ 'jargon_dict.json' not found in the project folder.")

# Load Local Company Culture Dataset
try:
    df = pd.read_csv('master_tech_data.csv')
    # Ensure scores are numeric for comparison logic
    for col in ['culture_score', 'wlb_score', 'skill_score']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    print(f"✅ Loaded Company Dataset with {len(df)} companies.")
except FileNotFoundError:
    raise FileNotFoundError("❌ 'master_tech_data.csv' not found. Run prepare_data.py first.")

# ==========================================
# 2. FASTAPI APP SETUP
# ==========================================

app = FastAPI(title="ATS Scorer API", description="Backend for Feature 3 & 7")

# Add CORS middleware to allow frontend (React/HTML) to connect to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to validate incoming requests
class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

# ==========================================
# 3. FEATURE 7: JARGON BUSTER (Zero AI Cost)
# ==========================================

def scan_for_jargon(resume_text: str):
    """Scans text for clichés using Regex and returns exact character indexes."""
    findings = []
    
    for cliché, suggestion in jargon_dict.items():
        # \b ensures we match whole words only (e.g., won't match 'worker' inside 'networker')
        # re.IGNORECASE catches "Hard Worker", "HARD WORKER", etc.
        pattern = r'\b' + re.escape(cliché) + r'\b'
        matches = re.finditer(pattern, resume_text, re.IGNORECASE)
        
        for match in matches:
            findings.append({
                "original_text": match.group(),
                "start_index": match.start(),
                "end_index": match.end(),
                "suggestion": suggestion
            })
            
    return findings

# ==========================================
# 4. FEATURE 3: CULTURE-FIT INJECTION
# ==========================================

async def extract_company_name(jd_text: str) -> str:
    """Uses a highly constrained, tiny prompt to extract the company name."""
    # Truncate JD to first 1000 chars to save tokens (company name is almost always at the top)
    truncated_jd = jd_text[:1000] 
    
    prompt = f"""You are a strict data extraction tool. Extract the exact company name from the job description below. 
    Rules:
    1. Return ONLY the company name.
    2. Do not include punctuation, quotes, or extra words.
    3. If no company is mentioned, return exactly "Unknown".
    
    Job Description: {truncated_jd}"""
    
    try:
        response = await model.generate_content_async(prompt)
        # Clean up the response (remove quotes, newlines, etc.)
        clean_name = response.text.strip().strip('"').strip("'").strip()
        return clean_name if clean_name else "Unknown"
    except Exception as e:
        print(f"⚠️ Gemini extraction failed: {e}")
        return "Unknown"

def get_culture_tip(company_name: str) -> str:
    """Looks up the company in the local CSV and generates a logic-based tip."""
    if company_name.lower() == "unknown":
        return "💡 Culture Tip: No specific company detected. Focus on matching the technical keywords in the JD."

    # Fuzzy match to handle slight name variations (e.g., "TCS" vs "Tata Consultancy Services")
    company_names = df['company_name'].dropna().tolist()
    best_match = difflib.get_close_matches(company_name, company_names, n=1, cutoff=0.6)
    
    if not best_match:
        return f"💡 Culture Tip: '{company_name}' not found in our database. Focus on matching the technical keywords in the JD."

    # Get data for the matched company
    matched_name = best_match[0]
    company_data = df[df['company_name'] == matched_name].iloc[0]
    
    wlb = company_data.get('wlb_score', 3.0)
    skill = company_data.get('skill_score', 3.0)
    culture = company_data.get('culture_score', 3.0)
    
    # Generate tip based on data logic (Zero AI tokens used here!)
    if pd.isna(wlb) or pd.isna(skill):
        return f"💡 Culture Tip: {matched_name} values collaboration. Emphasize cross-functional teamwork in your resume."

    if wlb < 3.5 and skill > 4.0:
        return f"💡 Culture Tip: {matched_name} is known for high skill development but a fast-paced environment. Highlight your adaptability and recent upskilling!"
    elif wlb > 4.0:
        return f"💡 Culture Tip: {matched_name} highly values work-life balance and structured processes. Highlight your experience with Agile, documentation, and systematic problem-solving."
    elif culture > 4.0:
        return f"💡 Culture Tip: {matched_name} has a strong collaborative culture. Emphasize peer mentoring and cross-functional teamwork in your resume."
    else:
        return f"💡 Culture Tip: {matched_name} values structured execution. Highlight your experience with systematic problem-solving and delivering measurable results."

# ==========================================
# 5. MASTER API ENDPOINT
# ==========================================

@app.post("/analyze-resume")
async def analyze_resume(request: ResumeRequest):
    """Main endpoint that processes the resume and job description."""
    try:
        # 1. Run Feature 7 (Jargon Buster) locally
        jargon_findings = scan_for_jargon(request.resume_text)
        
        # 2. Run Feature 3 (Culture-Fit) using Tiny AI + Local Data
        extracted_company = await extract_company_name(request.job_description)
        culture_tip = get_culture_tip(extracted_company)
        
        # 3. Return combined results
        return {
            "status": "success",
            "extracted_company": extracted_company,
            "culture_fit_tip": culture_tip,
            "jargon_alerts": jargon_findings,
            "jargon_count": len(jargon_findings)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "ATS Scorer API is running!"}