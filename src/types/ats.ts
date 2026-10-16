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

export type CultureArchetypeId =
  | 'fast_paced_startup'
  | 'big_tech_scale'
  | 'remote_first_async'
  | 'enterprise_fintech'
  | 'mission_driven';

export interface CultureArchetype {
  id: CultureArchetypeId;
  name: string;
  tagline: string;
  description: string;
  primary_values: string[];
  key_traits: string[];
  environment_summary: string;
}

export interface CultureDimensionScore {
  id: 'autonomy' | 'velocity' | 'collaboration' | 'adaptability';
  name: string;
  score: number;
  benchmark: number;
  verdict: 'Aligned' | 'Needs Reinforcement' | 'Under-represented' | 'Strong Match';
  detected_indicators: string[];
  missing_indicators: string[];
  description: string;
}

export interface ValueMatchItem {
  value_name: string;
  category: string;
  match_status: 'strong' | 'moderate' | 'missing';
  importance: 'High' | 'Medium';
  detected_evidence: string[];
  rationale: string;
  remedy: string;
}

export interface CultureReframingItem {
  id: string;
  target_dimension_or_value: string;
  original_bullet: string;
  reframed_bullet: string;
  culture_impact: string;
  why_it_works: string;
}

export interface CultureAnalysisResult {
  archetype: CultureArchetype;
  overall_culture_score: number;
  archetype_alignment_tier: 'Exemplary Synergy' | 'High Compatibility' | 'Moderate Alignment' | 'Cultural Disconnect';
  summary_verdict: string;
  dimensions: CultureDimensionScore[];
  values_matches: ValueMatchItem[];
  reframing_suggestions: CultureReframingItem[];
  environmental_signals: {
    communication_style: string;
    pace_orientation: string;
    decision_making_autonomy: string;
    team_structure_readiness: string;
  };
}

export interface WorkLifeBalanceDetails {
  rating: number; // e.g., 4.6 (out of 5.0)
  status_label: string; // e.g., 'Great Work-Life Balance', 'Healthy & Flexible', 'High-Velocity Sprints'
  typical_hours: string; // e.g., '40 hrs/week (Mon–Fri, 9:30 AM–5:30 PM)'
  weekend_policy: string; // e.g., 'Strict no-weekend emails or Slack messages'
  flexibility_perks: string; // e.g., 'Flexible core hours (10 AM–4 PM), hybrid 2 days, mental health days'
  stress_level: 'Low / Very Sustainable' | 'Balanced & Predictable' | 'Dynamic / Sprint-Driven';
}

export interface CompanyCoreValue {
  name: string;
  plain_meaning: string;
  what_recruiters_look_for: string;
}

export interface CompanyCultureProfile {
  id: string;
  name: string;
  logo_initials: string;
  theme_color: string;
  domain: string;
  category: 'Fast Startup' | 'Big Tech' | 'Enterprise' | 'Mission-Driven' | 'High-Growth';
  location_mode: 'Remote-First' | 'Hybrid (2-3 days)' | 'In-Office Flexible';
  headquarters: string;
  team_size: string;
  mission: string;
  work_style: string;
  work_life_balance: WorkLifeBalanceDetails;
  core_values: CompanyCoreValue[];
  perks: string[];
  interview_tips: string[];
  sample_interview_questions: string[];
  target_keywords: string[];
}

export interface CompanyMatchAnalysis {
  company: CompanyCultureProfile;
  match_score: number;
  match_tier: 'Exceptional Match' | 'Strong Fit' | 'Moderate Fit' | 'Needs Culture Reframing';
  why_you_match: string[];
  simple_ways_to_stand_out: string[];
  resume_highlight_connections: Array<{
    resume_bullet: string;
    company_value: string;
    why_it_works: string;
  }>;
  behavioral_interview_prep: Array<{
    question: string;
    how_to_answer: string;
    suggested_resume_point: string;
  }>;
}
