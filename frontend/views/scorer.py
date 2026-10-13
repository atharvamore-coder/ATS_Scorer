import streamlit as st

from frontend.services.api_client import analyze_resume


COMPONENT_MAX_SCORES = {
    "formatting": 20,
    "keywords": 25,
    "content": 25,
    "skill_validation": 15,
    "ats_compatibility": 15,
}

COMPONENT_LABELS = {
    "formatting": "Formatting",
    "keywords": "Keywords",
    "content": "Content quality",
    "skill_validation": "Skill validation",
    "ats_compatibility": "ATS compatibility",
}


def render():
    st.title("ATS resume scorer")
    st.write("Upload your resume and compare it with a job description.")

    access_token = st.session_state.get("access_token")
    if not access_token:
        st.info("🔒 Sign in with Google to analyze your resume and save your results.")
        from frontend.services import supabase_client
        import html
        oauth = supabase_client.google_oauth_url()
        if "error" in oauth:
            st.warning(f"Google sign-in unavailable: {oauth['error']}")
        else:
            oauth_url = html.escape(oauth["url"], quote=True)
            st.html(
                f"""
                <div style="max-width: 280px; margin: 1rem 0 2rem 0;">
                    <a href="{oauth_url}" target="_top" rel="noopener noreferrer"
                       style="display:flex; align-items:center; justify-content:center; gap:10px;
                              box-sizing:border-box; width:100%; padding:0.65rem 1.25rem;
                              border:1px solid rgba(128,128,128,0.3); border-radius:0.5rem;
                              color:inherit; text-align:center; text-decoration:none;
                              font-weight:600; font-size:0.95rem; background-color: rgba(255,255,255,0.06);">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        Continue with Google
                    </a>
                </div>
                """
            )
        return

    resume_file = st.file_uploader(
        "Choose a resume",
        type=["pdf", "doc", "docx"],
        max_upload_size=5,
        help="Maximum file size: 5 MB.",
    )
    job_description = st.text_area(
        "Job description",
        height=180,
        placeholder="Paste the job description here.",
    )

    if st.button("Analyze resume", type="primary", width="stretch"):
        if resume_file is None:
            st.error("Choose a resume file first.")
        else:
            with st.spinner("Analyzing your resume..."):
                result = analyze_resume(
                    resume_file=resume_file,
                    job_description=job_description,
                    access_token=access_token,
                )

            if "error" in result:
                st.error(result["error"])
            else:
                st.session_state["analysis_result"] = result

    result = st.session_state.get("analysis_result")
    if result:
        _render_result(result)


def _render_result(result: dict):
    st.divider()
    st.subheader("Analysis results")

    score = float(result.get("ATS_score", result.get("ats_score", 0)) or 0)
    st.metric("Overall ATS score", f"{score:.1f} / 100")

    components = result.get("component_scores") or {}
    if components:
        st.subheader("Score breakdown")
        for key, label in COMPONENT_LABELS.items():
            if key not in components:
                continue

            maximum = COMPONENT_MAX_SCORES[key]
            value = float(components[key] or 0)
            st.caption(f"{label}: {value:.1f} / {maximum}")
            st.progress(min(max(value / maximum, 0.0), 1.0))

    comparison = result.get("jd_match_analysis") or result.get("jd_comparison")
    if comparison:
        st.subheader("Job description match")
        match = float(comparison.get("match_percentage", 0) or 0)
        st.metric("Keyword match", f"{match:.1f}%")

        matched = comparison.get("matched_keywords") or []
        missing = comparison.get("missing_keywords") or []

        if matched:
            st.markdown("**Matched keywords**")
            st.write(", ".join(matched))

        if missing:
            st.markdown("**Missing keywords**")
            st.write(", ".join(missing))

        gap = comparison.get("skills_gap") or []
        if gap:
            st.markdown("**Skills to address**")
            st.write(", ".join(gap))

    issues = result.get("issues_summary") or []
    if issues:
        st.subheader("Summary")
        for issue in issues:
            st.markdown(f"- {issue}")

    feedback = result.get("detailed_feedback") or []
    if feedback:
        st.subheader("Detailed feedback")
        for index, item in enumerate(feedback, start=1):
            if isinstance(item, dict):
                title = item.get("issue_title") or f"Feedback {index}"
                explanation = item.get("explanation", "")
                fix = item.get("how_to_fix", "")
                severity = item.get("severity_level", "")
            else:
                title = f"Feedback {index}"
                explanation = str(item)
                fix = ""
                severity = ""

            label = f"{title} ({severity})" if severity else title
            with st.expander(label):
                if explanation:
                    st.write(explanation)
                if fix:
                    st.markdown(f"**Suggested fix:** {fix}")