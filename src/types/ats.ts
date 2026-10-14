export type ScoringMode = 'standard' | 'fresher';

export interface ComponentScores {
  formatting: number;
  keywords: number;
  content: number;
  skill_validation: number;
  ats_compatibility: number;
}

export interface JDComparison {
  match_percentage: number;
  semantic_similarity: number;
  matched_keywords: string[];
  missing_keywords: string[];
  skills_gap: string[];
}

export interface ValidatedSkillEntry {
  skill: string;
  projects: string[];
  similarity?: number;
}

export interface SkillValidationDetails {
  validated: ValidatedSkillEntry[];
  unvalidated: string[];
  total: number;
  validated_count: number;
  validation_pct: number;
}

export interface IssueDetail {
  issue_title: string;
  severity_level: 'Critical' | 'High' | 'Moderate' | 'Medium' | 'Low' | string;
  ats_impact: string;
  explanation: string;
  where_it_appears: string;
  how_to_fix: string;
  action_items: string[];
  example_improvement: string;
}

export interface ExplainableIssue {
  id: string;
  category: string;
  issue_title: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  exact_resume_text: string;
  job_requirement: string;
  why_it_matters: string;
  score_impact: number; // e.g. +4 points
  suggested_correction: string; // Copy-paste ready suggestion
  original_text_to_replace?: string; // Exact substring in resume to patch
}

export interface SkillWorkaround {
  missing_skill: string;
  adjacent_skill: string;
  workaround_strategy: string;
  suggested_bullet: string;
}

export interface LearningMilestone {
  phase: 'Fundamentals' | 'Practice Exercise' | 'Portfolio Project' | 'Free Resources';
  title: string;
  description: string;
  resource_url?: string;
  resource_name?: string;
}

export interface SkillRoadmap {
  skill: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_time: string;
  milestones: LearningMilestone[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  priority_label: string;
  priority_icon: string;
  impact_score: number;
  category: string;
  action_items: string[];
}

export interface AcademicDetails {
  cgpa?: string;
  percentage?: string;
  institution_type?: 'Tier 1/Premier' | 'State/Autonomous' | 'University/College';
  has_hackathons: boolean;
  has_college_clubs: boolean;
  has_certifications: boolean;
  academic_projects_count: number;
}

export interface AnalysisResponse {
  ATS_score: number;
  ats_score: number;
  mode: ScoringMode;
  component_scores: ComponentScores;
  issues_summary: string[];
  detailed_feedback: IssueDetail[];
  explainable_issues: ExplainableIssue[];
  skill_workarounds: SkillWorkaround[];
  skill_roadmaps: SkillRoadmap[];
  academic_details?: AcademicDetails;
  jd_match_analysis?: JDComparison | null;
  jd_comparison?: JDComparison | null;
  skill_validation_details?: SkillValidationDetails;
  keyword_match?: number;
  missing_keywords: string[];
  matched_keywords: string[];
  suggestions: string[];
  strengths: string[];
  critical_issues: string[];
  skills: string[];
  warnings?: string[];
  interpretation: string;
  recommendations?: Recommendation[];
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  content: string;
}

export interface MultiJobAnalysis {
  resume_title: string;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    match_percentage: number;
    matched_count: number;
    missing_count: number;
  }>;
  universal_matched_skills: string[];
  universal_missing_skills: string[];
  role_specific_gaps: Record<string, string[]>;
  high_leverage_fixes: Array<{
    recommendation: string;
    benefiting_jobs: string[];
    potential_score_boost: string;
  }>;
}

export interface HistoryItem {
  id: string;
  filename: string;
  mode: ScoringMode;
  ats_score: number;
  created_at: string;
  analysis_result: AnalysisResponse;
  job_description_snippet?: string;
}

export interface UserSession {
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_logged_in: boolean;
}
