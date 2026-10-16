# ATS Resume Scorer (React + TypeScript)

A modern, fast, privacy-first web application that evaluates how well a resume matches Applicant Tracking Systems (ATS) and target job descriptions, providing comprehensive scores and actionable improvement feedback.

Rewritten from Python/Streamlit + FastAPI to a high-performance React SPA with Vite, TypeScript, and Tailwind CSS.

## What it does

1. **Upload or Paste Resume:** Upload a resume file (PDF, DOCX, TXT) or paste raw text. Pre-loaded sample resumes are included for instant 1-click testing.
2. **Target Job Description Comparison:** Paste an optional target job description to analyze keyword match %, semantic overlap, and skills gaps.
3. **5-Dimension Scoring Engine:**
   - **Formatting (20%):** Structure, section headings, bullet points, and consistency.
   - **Keywords & Skills (25%):** Technical terms, density, and job description alignment.
   - **Content Quality (25%):** Strong action verbs, quantifiable achievements, and metrics.
   - **Skill Validation (15%):** Verifies whether claimed skills are substantiated by project bullets or work experience.
   - **ATS Compatibility (15%):** Checks for privacy risks (full street addresses, zip codes) and layout parsing blockers.
4. **Actionable Feedback & Recommendations:** Grouped by severity (Critical, High, Moderate, Low) with issue explanations, locations, remediation steps, and concrete code/text examples.
5. **PDF Report Export:** Download formatted ATS analysis reports directly in the browser.
6. **Analysis History:** Saves past resume evaluations with full score breakdowns and management capabilities.
7. **Resources & Industry Keywords:** Curated ATS optimization guidelines, Do's & Don'ts, and keyword reference sheets for Tech, Business, and Creative industries.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **PDF Generation:** jsPDF
- **Icons:** Lucide React

## Development

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
