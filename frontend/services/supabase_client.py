import os
import logging
import hashlib
import base64
from pathlib import Path
from typing import Any, Dict

import streamlit as st
from supabase import Client, create_client

logger = logging.getLogger('ats_resume_scorer')

# ---------------------------------------------------------------------------
# Load .env from project root
# ---------------------------------------------------------------------------
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[2] / '.env')
except ImportError:
    pass

# ---------------------------------------------------------------------------
# Defaults — these are the fallback credentials for this project
# ---------------------------------------------------------------------------
_DEFAULT_URL  = "https://hidocxbxuxacsxyvvdri.supabase.co"
_DEFAULT_ANON = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZG9jeGJ4dXhhY3N4eXZ2ZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEYMDE2MDAsImV4cCI6MjEwNjc3NzYwMH0."
    "zlV_OvCenebCp6WGbFGXyU3BqjfugKM-Qsk__xNACmk"
)
_DEFAULT_REDIRECT = "http://localhost:8501"

# ---------------------------------------------------------------------------
# Fixed PKCE verifier — keeps verifier stable across Streamlit reruns.
# The challenge is SHA-256(verifier) base64url-encoded (no padding).
# PKCE spec: verifier 43–128 chars, chars A-Z a-z 0-9 - . _ ~
# ---------------------------------------------------------------------------
_PKCE_VERIFIER = "ATS_Scorer_Fixed_PKCE_Verifier_Streamlit_2026_Secure_Random_ABC1234567890"
_PKCE_CHALLENGE = base64.urlsafe_b64encode(
    hashlib.sha256(_PKCE_VERIFIER.encode('ascii')).digest()
).decode('ascii').rstrip('=')


# ---------------------------------------------------------------------------
# Module-level verifier store — survives Streamlit reruns because Python
# caches modules in sys.modules for the lifetime of the server process.
# ---------------------------------------------------------------------------
_pkce_store: Dict[str, str] = {'verifier': _PKCE_VERIFIER}


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------
def _secret(key: str, section: str = 'supabase', default: str = '') -> str:
    val = os.getenv(key, '')
    if val:
        return val
    try:
        if hasattr(st, 'secrets'):
            if section in st.secrets and key in st.secrets[section]:
                return str(st.secrets[section][key])
            if key in st.secrets:
                return str(st.secrets[key])
    except Exception:
        pass
    for env_path in [
        Path(__file__).resolve().parents[2] / '.env',
        Path(__file__).resolve().parents[1] / '.env',
        Path.cwd() / '.env',
    ]:
        if env_path.is_file():
            try:
                with open(env_path, 'r', encoding='utf-8') as fh:
                    for line in fh:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            if k.strip() == key:
                                return v.strip().strip("'\"")
            except Exception:
                pass
    for toml in [
        Path(__file__).resolve().parents[1] / '.streamlit' / 'secrets.toml',
        Path(__file__).resolve().parents[2] / '.streamlit' / 'secrets.toml',
        Path.cwd() / '.streamlit' / 'secrets.toml',
    ]:
        if toml.is_file():
            try:
                in_sec = False
                with open(toml, 'r', encoding='utf-8') as fh:
                    for line in fh:
                        line = line.strip()
                        if line.startswith('[') and line.endswith(']'):
                            in_sec = line[1:-1].strip() == section
                            continue
                        if in_sec and '=' in line and not line.startswith('#'):
                            k, v = line.split('=', 1)
                            if k.strip() == key:
                                return v.strip().strip("'\"")
            except Exception:
                pass
    return default


def get_supabase_url() -> str:
    return _secret('SUPABASE_URL', 'supabase', _DEFAULT_URL)


def get_supabase_anon_key() -> str:
    return _secret('SUPABASE_ANON_KEY', 'supabase', _DEFAULT_ANON)


def get_oauth_redirect_url() -> str:
    return (
        os.getenv('AUTH_REDIRECT_URL')
        or _secret('redirect_uri', 'google_oauth', _DEFAULT_REDIRECT)
    )


def _missing_config() -> str | None:
    url = get_supabase_url()
    key = get_supabase_anon_key()
    if not url or not key:
        return 'Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY.'
    if '<' in url or 'your-project' in url.lower():
        return 'Replace the SUPABASE_URL placeholder.'
    if '<' in key or 'your-anon-key' in key.lower():
        return 'Replace the SUPABASE_ANON_KEY placeholder.'
    return None


# ---------------------------------------------------------------------------
# Supabase client — PKCE flow (default), patched with a stable verifier
# ---------------------------------------------------------------------------
@st.cache_resource
def get_client() -> Client | None:
    """
    Cached Supabase client using PKCE flow with a *fixed* verifier.

    Streamlit re-runs the whole script on every interaction, but
    @st.cache_resource keeps the same Python object alive. The PKCE
    verifier lives in the client's SyncMemoryStorage. By patching
    generate_pkce_verifier to always return our fixed constant, AND by
    also saving it to the module-level _pkce_store, we guarantee that
    exchange_code_for_session can always find the correct verifier even
    after multiple re-runs.
    """
    if _missing_config():
        return None
    client = create_client(get_supabase_url(), get_supabase_anon_key())
    # Patch the PKCE generator so it always uses our fixed verifier
    try:
        fn = client.auth._get_url_for_provider
        fn.__globals__['generate_pkce_verifier'] = lambda: _PKCE_VERIFIER
    except Exception as exc:
        logger.debug(f'PKCE patch skipped: {exc}')
    return client


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def _session_dict(session, user) -> Dict[str, Any]:
    return {
        'access_token':  session.access_token,
        'refresh_token': session.refresh_token,
        'user_id':       user.id,
        'email':         user.email,
    }


def google_oauth_url() -> Dict[str, Any]:
    """
    Build the Supabase Google OAuth URL.
    After calling sign_in_with_oauth, save the verifier to module state so
    exchange_code_for_session can retrieve it even after a Streamlit rerun.
    """
    err = _missing_config()
    if err:
        return {'error': err}
    try:
        client = get_client()
        resp = client.auth.sign_in_with_oauth({
            'provider': 'google',
            'options': {'redirect_to': get_oauth_redirect_url()},
        })
        # Persist the verifier in the module-level store
        storage_key = f'{client.auth._storage_key}-code-verifier'
        saved = client.auth._storage.get_item(storage_key) or _PKCE_VERIFIER
        _pkce_store['verifier'] = saved
        logger.info(f'OAuth URL generated; verifier prefix: {saved[:12]}')
        return {'url': resp.url}
    except Exception as exc:
        logger.warning(f'google_oauth_url failed: {exc}')
        return {'error': str(exc)}


def exchange_code_for_session(auth_code: str) -> Dict[str, Any]:
    """
    Exchange the ?code= query parameter Supabase returns after Google login.
    Uses the verifier from _pkce_store (module-level, survives reruns) and
    falls back to the fixed _PKCE_VERIFIER constant.
    """
    err = _missing_config()
    if err:
        return {'error': err}
    # Use module-level store first, then the fixed constant as safety net
    verifier = _pkce_store.get('verifier') or _PKCE_VERIFIER
    logger.info(f'Exchanging code; verifier prefix: {verifier[:12]}')
    try:
        client = get_client()
        # Ensure storage is in sync before calling the SDK method
        storage_key = f'{client.auth._storage_key}-code-verifier'
        client.auth._storage.set_item(storage_key, verifier)
        resp = client.auth.exchange_code_for_session({
            'auth_code':     auth_code,
            'code_verifier': verifier,
        })
        if not resp.session or not resp.user:
            return {'error': 'OAuth exchange returned no session'}
        _pkce_store['verifier'] = _PKCE_VERIFIER  # reset for next login
        return _session_dict(resp.session, resp.user)
    except Exception as exc:
        logger.warning(f'exchange_code_for_session failed: {exc}')
        return {'error': str(exc)}


def sign_in_with_password(email: str, password: str) -> Dict[str, Any]:
    err = _missing_config()
    if err:
        return {'error': err}
    try:
        resp = get_client().auth.sign_in_with_password(
            {'email': email, 'password': password}
        )
        if not resp.session or not resp.user:
            return {'error': 'Invalid credentials'}
        return _session_dict(resp.session, resp.user)
    except Exception as exc:
        logger.warning(f'sign_in_with_password failed: {exc}')
        return {'error': _humanize(exc)}


def sign_up_with_password(email: str, password: str) -> Dict[str, Any]:
    err = _missing_config()
    if err:
        return {'error': err}
    try:
        resp = get_client().auth.sign_up({'email': email, 'password': password})
        if resp.session and resp.user:
            return _session_dict(resp.session, resp.user)
        if resp.user:
            return {'pending_confirmation': True, 'email': email}
        return {'error': 'Sign-up failed'}
    except Exception as exc:
        logger.warning(f'sign_up failed: {exc}')
        return {'error': _humanize(exc)}


def sign_out() -> None:
    if _missing_config():
        return
    try:
        get_client().auth.sign_out()
    except Exception as exc:
        logger.warning(f'sign_out failed: {exc}')


def _humanize(exc: Exception) -> str:
    msg = str(exc)
    if 'invalid_grant' in msg.lower() or 'invalid login' in msg.lower():
        return 'Wrong email or password'
    if 'user already registered' in msg.lower() or 'already been registered' in msg.lower():
        return 'An account with this email already exists — try signing in'
    if 'password should be at least' in msg.lower():
        return 'Password too short (Supabase default is 6 characters)'
    return msg
