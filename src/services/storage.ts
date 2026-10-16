import { AnalysisResponse, HistoryItem, UserSession } from '../types/ats';

const HISTORY_STORAGE_KEY = 'ats_analysis_history_v1';
const USER_STORAGE_KEY = 'ats_user_session_v1';

export const DEFAULT_USER: UserSession = {
  user_id: 'user_atharva_default',
  email: 'atharvamore8068@gmail.com',
  name: 'Atharva More',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  is_logged_in: true,
};

export function getUserSession(): UserSession {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Error reading user session', e);
  }
  return DEFAULT_USER;
}

export function saveUserSession(user: UserSession): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Error writing user session', e);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const items: HistoryItem[] = JSON.parse(raw);
      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (e) {
    console.warn('Error reading history', e);
  }
  return [];
}

export function saveAnalysisToHistory(
  filename: string,
  analysis: AnalysisResponse,
  jobDescriptionSnippet?: string
): HistoryItem {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: 'analysis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    filename: filename || 'resume.pdf',
    mode: analysis.mode || 'standard',
    ats_score: analysis.ats_score,
    created_at: new Date().toISOString(),
    analysis_result: analysis,
    job_description_snippet: jobDescriptionSnippet,
  };

  const updated = [newItem, ...history];
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error writing history', e);
  }
  return newItem;
}

export function deleteHistoryItem(id: string): boolean {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn('Error deleting history item', e);
    return false;
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.warn('Error clearing history', e);
  }
}
