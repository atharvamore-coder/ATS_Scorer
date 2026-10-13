import json
import os

import requests


def _api_base_url() -> str:
    """Read the API URL from the environment or Streamlit secrets."""
    value = os.getenv("ATS_API_URL", "").strip()

    if not value:
        try:
            import streamlit as st

            value = str(st.secrets.get("ATS_API_URL", "")).strip()
        except Exception:
            value = ""

    # This default works when Streamlit and FastAPI run on the same computer.
    return (value or "http://127.0.0.1:8000").rstrip("/")


def analyze_resume(resume_file, job_description: str, access_token: str) -> dict:
    """Upload a resume to the backend and return its analysis."""
    if not access_token:
        return {"error": "Please sign in before analyzing a resume."}

    files = {
        "resume": (
            resume_file.name,
            resume_file.getvalue(),
            resume_file.type or "application/octet-stream",
        )
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.post(
            f"{_api_base_url()}/api/v1/analyze-resume",
            headers=headers,
            files=files,
            data={"job_description": job_description},
            timeout=180,
        )
    except requests.RequestException as exc:
        return {"error": f"Could not reach the backend API: {exc}"}

    try:
        data = response.json()
    except ValueError:
        return {
            "error": f"The backend returned an unreadable response "
            f"(HTTP {response.status_code})."
        }

    if not response.ok:
        detail = data.get("detail", data)
        if isinstance(detail, (dict, list)):
            detail = json.dumps(detail)
        return {"error": str(detail)}

    return data