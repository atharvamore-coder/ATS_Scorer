import {
  AcademicDetails,
  AnalysisResponse,
  ComponentScores,
  ExplainableIssue,
  IssueDetail,
  JDComparison,
  Recommendation,
  ScoringMode,
  SkillValidationDetails,
  ValidatedSkillEntry,
} from '../types/ats';
import { findSkillWorkarounds, generateSkillRoadmaps } from './skillBridge';

export const SKILL_ALIASES: Record<string, string> = {
  reactjs: 'react',
  'react.js': 'react',
  angularjs: 'angular',
  vuejs: 'vue',
  'vue.js': 'vue',
  nextjs: 'next.js',
  nodejs: 'node.js',
  node: 'node.js',
  expressjs: 'express',
  'express.js': 'express',
  springboot: 'spring boot',
  golang: 'go',
  ml: 'machine learning',
  ai: 'artificial intelligence',
  nlp: 'natural language processing',
  cv: 'computer vision',
  k8s: 'kubernetes',
  sklearn: 'scikit-learn',
  postgres: 'postgresql',
  dotnet: '.net',
  tailwindcss: 'tailwind',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  pyspark: 'spark',
  huggingface: 'hugging face',
  powerbi: 'powerbi',
  tableau: 'tableau',
};

export function normalizeSkill(skill: string): string {
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

export function stringSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1.0;
  if (!a || !b) return 0.0;
  if (a.includes(b) || b.includes(a)) return 0.9;

  const getBigrams = (str: string) => {
    const s = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      s.add(str.slice(i, i + 2));
    }
    return s;
  };

  const bg1 = getBigrams(a);
  const bg2 = getBigrams(b);
  if (bg1.size === 0 || bg2.size === 0) return 0;

  let intersection = 0;
  for (const bg of bg1) {
    if (bg2.has(bg)) intersection++;
  }
  return (2.0 * intersection) / (bg1.size + bg2.size);
}

const COMMON_ACTION_VERBS = [
  'developed', 'built', 'created', 'designed', 'implemented', 'optimized',
  'engineered', 'architected', 'spearheaded', 'led', 'managed', 'deployed',
  'automated', 'reduced', 'increased', 'improved', 'scaled', 'refactored',
  'collaborated', 'launched', 'delivered', 'orchestrated', 'streamlined',
  'accelerated', 'established', 'formulated', 'directed', 'executed',
  'configured', 'integrated', 'mentored', 'analyzed', 'generated', 'transformed',
  'authored', 'solved', 'conducted', 'programmed', 'coordinated'
];

const COMMON_TECH_KEYWORDS = [
  'python', 'javascript', 'typescript', 'react', 'node.js', 'sql', 'nosql',
  'aws', 'docker', 'kubernetes', 'git', 'ci/cd', 'rest api', 'graphql',
  'postgresql', 'mongodb', 'redis', 'java', 'c++', 'c#', 'golang', 'linux',
  'html', 'css', 'tailwind', 'redux', 'next.js', 'django', 'fastapi',
  'flask', 'spring boot', 'machine learning', 'deep learning', 'tensorflow',
  'pytorch', 'agile', 'scrum', 'unit testing', 'microservices', 'cloud computing',
  'data structures', 'algorithms', 'system design', 'security', 'devops',
  'azure', 'gcp', 'spark', 'kafka', 'hadoop', 'terraform', 'graphql',
  'jira', 'figma', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'powerbi',
  'excel', 'data analysis', 'c', 'r', 'data analytics', 'data visualization'
];

export interface ParsedResume {
  name: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  professional_summary: string;
  skills: string[];
  experience: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    duration_months: number;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  academic_details: AcademicDetails;
  action_verbs: string[];
  keywords: string[];
  lines: string[];
}

// India-specific and Academic parser helpers
export function parseAcademicAndIndianDetails(text: string): AcademicDetails {
  const textLower = text.toLowerCase();

  // CGPA match (e.g. 8.4/10, 9.1 CGPA, CPI 8.5)
  const cgpaMatch = text.match(/(?:cgpa|cpi|sgpa)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10(?:\.0)?)?/i) ||
    text.match(/\b([789]\.\d{1,2}|10\.0)\s*(?:\/\s*10|\s*cgpa)/i);
  const cgpa = cgpaMatch ? cgpaMatch[1] : undefined;

  // Percentage match (e.g. 82.5%, 78% aggregate)
  const pctMatch = text.match(/(\d{2}(?:\.\d{1,2})?)\s*%\s*(?:aggregate|marks|percentage)?/i);
  const percentage = pctMatch ? `${pctMatch[1]}%` : undefined;

  // Institute Type
  let institution_type: AcademicDetails['institution_type'] = 'University/College';
  if (/\b(iit|nit|iiit|bits|dtu|nsut|iisc|jadhavpur|anna university)\b/i.test(text)) {
    institution_type = 'Tier 1/Premier';
  } else if (/\b(autonomous|state university|affiliated|deemed)\b/i.test(text)) {
    institution_type = 'State/Autonomous';
  }

  // Hackathons
  const has_hackathons = /\b(hackathon|smart india hackathon|sih|hackcb|hackoverflow|mlh|devpost)\b/i.test(textLower);

  // College Technical Clubs
  const has_college_clubs = /\b(gdsc|ieee|acm|csi|rotaract|e-cell|technical club|coding club|iste)\b/i.test(textLower);

  // Certifications
  const has_certifications = /\b(nptel|coursera|udemy|hackerank|leetcode|codechef|certified|credential)\b/i.test(textLower);

  // Project count estimation
  const projectMatches = (text.match(/^[•\-*]\s*(?:project|built|developed|created)/gim) || []).length;
  const academic_projects_count = Math.max(1, projectMatches);

  return {
    cgpa,
    percentage,
    institution_type,
    has_hackathons,
    has_college_clubs,
    has_certifications,
    academic_projects_count,
  };
}

export function parseResumeClientSide(rawText: string): ParsedResume {
  const text = rawText || '';
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  const linkedinMatch = text.match(/(?:linkedin\.com\/(?:in\/)?[\w-]+)/i);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : null;

  const githubMatch = text.match(/(?:github\.com\/[\w-]+)/i);
  const github = githubMatch ? `https://${githubMatch[0]}` : null;

  let name = lines[0] || 'Candidate';
  if (name.includes('@') || name.includes('http') || name.length > 50) {
    name = lines[1] || 'Candidate';
  }

  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    other: [],
  };

  let currentSection = 'summary';

  for (const line of lines) {
    const lLower = line.toLowerCase();
    if (
      lLower.includes('experience') ||
      lLower.includes('work history') ||
      lLower.includes('employment') ||
      lLower.includes('internships')
    ) {
      currentSection = 'experience';
      continue;
    } else if (
      lLower.includes('education') ||
      lLower.includes('academic') ||
      lLower.includes('qualifications')
    ) {
      currentSection = 'education';
      continue;
    } else if (
      lLower.includes('skills') ||
      lLower.includes('technologies') ||
      lLower.includes('technical expertise') ||
      lLower.includes('core competencies')
    ) {
      currentSection = 'skills';
      continue;
    } else if (
      lLower.includes('project') ||
      lLower.includes('academic work')
    ) {
      currentSection = 'projects';
      continue;
    } else if (
      lLower.includes('summary') ||
      lLower.includes('objective') ||
      lLower.includes('about me') ||
      lLower.includes('profile')
    ) {
      currentSection = 'summary';
      continue;
    }

    sections[currentSection].push(line);
  }

  const professional_summary = sections.summary.join(' ').slice(0, 1000);

  const extractedSkills = new Set<string>();
  const textLower = text.toLowerCase();

  const skillsText = sections.skills.join(', ');
  const skillTokens = skillsText
    .split(/[,•|/\n\t*]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 35);

  skillTokens.forEach((st) => {
    if (!st.includes(':') && !st.toLowerCase().startsWith('skills')) {
      extractedSkills.add(st);
    }
  });

  for (const tech of COMMON_TECH_KEYWORDS) {
    const regex = new RegExp(`\\b${tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      extractedSkills.add(tech);
    }
  }

  const skills = Array.from(extractedSkills).slice(0, 30);

  const foundVerbs = new Set<string>();
  for (const verb of COMMON_ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(textLower)) {
      foundVerbs.add(verb);
    }
  }
  const action_verbs = Array.from(foundVerbs);

  const keywordsSet = new Set<string>(skills);
  for (const kw of COMMON_TECH_KEYWORDS) {
    if (textLower.includes(kw)) keywordsSet.add(kw);
  }
  const keywords = Array.from(keywordsSet);

  const expLines = sections.experience;
  const experience: ParsedResume['experience'] = [];
  if (expLines.length > 0) {
    const expText = expLines.join('\n');
    const roleBlocks = expText.split(/\n(?=[A-Z][A-Za-z\s]+(?:–|-|at|@|,)\s*[A-Za-z])/);
    if (roleBlocks.length > 1) {
      for (const block of roleBlocks.slice(0, 5)) {
        const bLines = block.trim().split('\n');
        experience.push({
          job_title: bLines[0] || 'Software Engineer',
          company: bLines[1] || 'Company',
          start_date: '2022',
          end_date: 'Present',
          duration_months: 24,
          description: bLines.slice(1).join('\n'),
        });
      }
    } else {
      experience.push({
        job_title: 'Professional Role',
        company: 'Company',
        start_date: '2022',
        end_date: 'Present',
        duration_months: 24,
        description: expLines.join('\n'),
      });
    }
  }

  const eduLines = sections.education;
  const education: ParsedResume['education'] = [];
  if (eduLines.length > 0) {
    education.push({
      degree: eduLines[0] || 'Bachelor of Technology in Computer Science',
      institution: eduLines[1] || 'University',
      year: '2024',
    });
  }

  const projLines = sections.projects;
  const projects: ParsedResume['projects'] = [];
  if (projLines.length > 0) {
    const projText = projLines.join('\n');
    const pBlocks = projText.split(/\n(?=[•\-*]|\b[A-Z][\w\s]+:)/);
    for (const b of pBlocks.slice(0, 5)) {
      if (b.trim().length > 10) {
        const bLines = b.trim().split('\n');
        const projTitle = bLines[0].replace(/^[•\-*]\s*/, '').slice(0, 50);
        projects.push({
          title: projTitle || 'Project Portfolio',
          description: b,
          technologies: skills.filter((s) => b.toLowerCase().includes(s.toLowerCase())).slice(0, 5),
        });
      }
    }
    if (projects.length === 0 && projLines.length > 0) {
      projects.push({
        title: 'Technical Project',
        description: projLines.join('\n'),
        technologies: skills.slice(0, 4),
      });
    }
  }

  const academic_details = parseAcademicAndIndianDetails(text);

  return {
    name,
    email,
    phone,
    linkedin,
    github,
    professional_summary,
    skills,
    experience,
    education,
    projects,
    academic_details,
    action_verbs,
    keywords,
    lines,
  };
}

function tierScore(n: number, tiers: Array<[number, number]>): number {
  for (const [threshold, pts] of tiers) {
    if (n >= threshold) return pts;
  }
  return 0.0;
}

function detectLocationPrivacy(text: string): {
  privacy_risk: 'none' | 'low' | 'medium' | 'high';
  penalty: number;
  recommendations: string[];
} {
  const zipCodePattern = /\b\d{5}(?:-\d{4})?\b|\b\d{6}\b/; // Supports US & Indian 6-digit PIN codes
  const streetPattern = /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Nagar|Colony|Sector)\b/i;

  const hasAddress = streetPattern.test(text);
  const hasZip = zipCodePattern.test(text);

  let privacy_risk: 'none' | 'low' | 'medium' | 'high' = 'none';
  let penalty = 0.0;

  if (hasAddress && hasZip) {
    privacy_risk = 'high';
    penalty = 5.0;
  } else if (hasAddress || hasZip) {
    privacy_risk = 'high';
    penalty = 4.0;
  } else {
    privacy_risk = 'none';
    penalty = 0.0;
  }

  const recommendations: string[] = [];
  if (hasAddress) {
    recommendations.push("Remove full street addresses — ATS systems don't need this and it's a privacy risk.");
  }
  if (hasZip) {
    recommendations.push("Remove pin/zip codes — 'City, State' is optimal for ATS parsers.");
  }

  return { privacy_risk, penalty, recommendations };
}

export function validateSkillsWithProjects(
  skills: string[],
  projects: ParsedResume['projects'],
  experienceEntries: ParsedResume['experience'],
  fullText: string
): SkillValidationDetails {
  if (!skills.length) {
    return {
      validated: [],
      unvalidated: [],
      total: 0,
      validated_count: 0,
      validation_pct: 0,
    };
  }

  const validated: ValidatedSkillEntry[] = [];
  const unvalidated: string[] = [];

  const experienceText = experienceEntries
    .map((e) => `${e.job_title} ${e.company} ${e.description}`)
    .join(' ')
    .toLowerCase();

  for (const skill of skills) {
    const sNorm = normalizeSkill(skill);
    const matchingProjects: string[] = [];
    let bestSim = 0.0;

    for (const proj of projects) {
      const pText = `${proj.title} ${proj.description}`.toLowerCase();
      if (pText.includes(sNorm) || pText.includes(skill.toLowerCase())) {
        matchingProjects.push(proj.title || 'Project');
        bestSim = 1.0;
      } else {
        const sim = stringSimilarity(sNorm, pText);
        if (sim >= 0.75) {
          matchingProjects.push(proj.title || 'Project');
          bestSim = Math.max(bestSim, sim);
        }
      }
    }

    if (experienceText.includes(sNorm) || experienceText.includes(skill.toLowerCase())) {
      if (!matchingProjects.includes('Experience Section')) {
        matchingProjects.push('Experience Section');
      }
      bestSim = 1.0;
    }

    if (matchingProjects.length > 0) {
      validated.push({
        skill,
        projects: matchingProjects,
        similarity: bestSim,
      });
    } else {
      unvalidated.push(skill);
    }
  }

  const total = skills.length;
  const validated_count = validated.length;
  const validation_pct = total > 0 ? (validated_count / total) * 100 : 0;

  return {
    validated,
    unvalidated,
    total,
    validated_count,
    validation_pct: Math.round(validation_pct * 10) / 10,
  };
}

// -------------------------------------------------------------
// Explainable ATS Issues Generator
// -------------------------------------------------------------
function generateExplainableIssues(
  parsed: ParsedResume,
  text: string,
  jobDescription: string | undefined,
  missingKeywords: string[],
  mode: ScoringMode
): ExplainableIssue[] {
  const issues: ExplainableIssue[] = [];
  const textLower = text.toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  // 1. Weak leadership verb -> Strong quantifiable leadership
  const weakLeadLine = parsed.lines.find((l) =>
    /\b(responsible for managing|managed a team|helped with team|handled the team|looked after)\b/i.test(l)
  );
  if (weakLeadLine) {
    issues.push({
      id: 'issue-lead-quant',
      category: 'Content Quality',
      issue_title: 'Unquantified Leadership Phrasing',
      severity: 'High',
      exact_resume_text: weakLeadLine,
      job_requirement: 'Cross-functional leadership, team coordination & agile delivery',
      why_it_matters:
        "ATS keyword scanners and hiring managers flag passive phrases like 'responsible for managing'. Replacing it with active verbs and team size metrics proves tangible leadership capability.",
      score_impact: 4,
      suggested_correction: weakLeadLine.replace(
        /\b(?:responsible for managing|managed a team|helped with team|handled the team)\b/i,
        'Led a cross-functional team of 5 engineers to deliver sprint deliverables 2 weeks ahead of schedule'
      ),
      original_text_to_replace: weakLeadLine,
    });
  }

  // 2. Python listed but lacks data analysis context
  const hasPython = parsed.skills.some((s) => s.toLowerCase() === 'python');
  const jdRequestsDataAnalysis = jdLower.includes('data analysis') || jdLower.includes('analytics') || jdLower.includes('pandas');
  const resumeMentionsAnalysis = textLower.includes('data analysis') || textLower.includes('pandas') || textLower.includes('analyzed');

  if (hasPython && jdRequestsDataAnalysis && !resumeMentionsAnalysis) {
    const pythonLine = parsed.lines.find((l) => /\bpython\b/i.test(l)) || 'Python, Git, SQL';
    issues.push({
      id: 'issue-python-context',
      category: 'Keywords & Context',
      issue_title: 'Skill Lacks Applied Functional Context',
      severity: 'High',
      exact_resume_text: pythonLine,
      job_requirement: 'Python Data Analysis & Analytics Pipeline',
      why_it_matters:
        'Your resume lists Python, but the job description specifically asks for Python data analysis. Your project section does not yet show how you used Python for analysis or data manipulation.',
      score_impact: 5,
      suggested_correction:
        'Engineered an end-to-end Python data analysis pipeline utilizing Pandas and Matplotlib to analyze 50,000+ consumer transactions, identifying key churn drivers.',
      original_text_to_replace: pythonLine,
    });
  }

  // 3. Unquantified bullet point check
  const unquantifiedBullet = parsed.lines.find(
    (l) =>
      /^[•\-*]\s*[A-Z]/.test(l) &&
      !/\d+[%+]?|\$\d+|\d+\s*(?:users|hours|days|requests|projects)/.test(l) &&
      l.length > 25
  );
  if (unquantifiedBullet) {
    issues.push({
      id: 'issue-unquantified-bullet',
      category: 'Content Impact',
      issue_title: 'Unquantified Achievement Statement',
      severity: 'Moderate',
      exact_resume_text: unquantifiedBullet,
      job_requirement: 'Demonstrable impact with measurable KPIs and business outcomes',
      why_it_matters:
        'Recruiters look for the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]". Bullets without metrics fail to communicate relative scale.',
      score_impact: 3,
      suggested_correction: `${unquantifiedBullet.trim()} — resulting in a 35% reduction in execution time across 10,000+ operations.`,
      original_text_to_replace: unquantifiedBullet,
    });
  }

  // 4. Missing target keyword from JD
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords[0];
    issues.push({
      id: 'issue-missing-keyword-top',
      category: 'Keywords & Skills',
      issue_title: `Target Keyword '${topMissing}' Absent`,
      severity: 'Critical',
      exact_resume_text: '[Not found anywhere in resume]',
      job_requirement: `Mandatory proficiency in ${topMissing}`,
      why_it_matters:
        `Applicant Tracking Systems scan for '${topMissing}' as a core filter. Resumes without it are frequently filtered before reaching human review.`,
      score_impact: 6,
      suggested_correction: `Add '${topMissing}' into your Skills section and substantiate with a bullet point: "Utilized ${topMissing} to streamline workflows and implement modular components."`,
    });
  }

  // 5. Fresher academic project verification
  if (mode === 'fresher') {
    if (!parsed.academic_details.has_hackathons && !parsed.academic_details.has_college_clubs) {
      issues.push({
        id: 'issue-fresher-co-curricular',
        category: 'Fresher Profile Strength',
        issue_title: 'Missing Co-Curricular & Hackathon Evidence',
        severity: 'Moderate',
        exact_resume_text: '[No Hackathons or College Technical Clubs detected]',
        job_requirement: 'Passion for coding, collaborative team experience, and problem-solving initiative',
        why_it_matters:
          'For fresh graduates and interns, participation in hackathons (like Smart India Hackathon), open-source sprints, or campus tech societies (GDSC, IEEE, CSI) acts as the gold standard of practical ability.',
        score_impact: 4,
        suggested_correction:
          'Add a "CO-CURRICULAR & ACHIEVEMENTS" section: "Participated in 36-hour National Hackathon building an AI triage prototype; Active member of Google Developer Student Club (GDSC)."',
      });
    }
  }

  // 6. Address / Location privacy hazard
  const privacyCheck = detectLocationPrivacy(text);
  if (privacyCheck.privacy_risk === 'high') {
    const streetLine = parsed.lines.find((l) => /\b\d+\s+[A-Za-z]+\s+(?:street|st|avenue|ave|road|rd|nagar|colony|sector)\b/i.test(l)) || 'Full street address';
    issues.push({
      id: 'issue-location-privacy',
      category: 'ATS Compatibility',
      issue_title: 'Full Address Exposes Unnecessary Privacy Risk',
      severity: 'High',
      exact_resume_text: streetLine,
      job_requirement: 'Location compatibility: City, State or Remote',
      why_it_matters:
        "Modern ATS systems only verify geographic metro zone or remote eligibility. Detailed street addresses and zip codes pose a security hazard and clutter parser tokenizers.",
      score_impact: 4,
      suggested_correction: streetLine.replace(/\b\d+[^,\n]+(?:street|st|road|rd|lane|nagar|colony|sector)[^,\n]*/i, 'Bengaluru, India'),
      original_text_to_replace: streetLine,
    });
  }

  return issues;
}

// -------------------------------------------------------------
// Full Scoring Function matching backend formula + fresher mode
// -------------------------------------------------------------
export function calculateATSAnalysis(
  resumeText: string,
  jobDescription?: string,
  mode: ScoringMode = 'standard'
): AnalysisResponse {
  const parsed = parseResumeClientSide(resumeText);
  const text = resumeText || '';

  // 1. FORMATTING SCORE (max 20)
  let formattingScore = 0.0;
  if (mode === 'fresher') {
    // Fresher mode: projects & education hold primary weight
    if (parsed.projects.length > 0) formattingScore += 5.0;
    if (parsed.education.length > 0) formattingScore += 4.0;
    if (parsed.skills.length >= 3) formattingScore += 3.0;
    if (parsed.professional_summary.length > 20) formattingScore += 2.0;
    if (parsed.experience.length > 0 || parsed.academic_details.has_hackathons) formattingScore += 2.0;
  } else {
    if (parsed.experience.length > 0) formattingScore += 3.0;
    if (parsed.education.length > 0) formattingScore += 2.0;
    if (parsed.skills.length >= 3) formattingScore += 2.0;
    if (parsed.professional_summary.length > 30) formattingScore += 1.5;
    if (parsed.projects.length > 0) formattingScore += 1.5;
  }

  const bulletCount = (text.match(/^[•\-*◦]\s+|\n[•\-*◦]\s+|\n\d+\.\s+/g) || []).length;
  formattingScore += tierScore(bulletCount, [[15, 5.0], [10, 4.0], [5, 3.0], [3, 2.0], [1, 1.0]]);

  const filledCount = [
    parsed.experience.length > 0 || parsed.projects.length > 0,
    parsed.education.length > 0,
    parsed.skills.length > 0,
    parsed.professional_summary.trim().length > 0,
  ].filter(Boolean).length;
  formattingScore += tierScore(filledCount, [[4, 4.0], [3, 3.0], [2, 2.0], [1, 1.0]]);
  formattingScore = Math.min(20.0, Math.max(0.0, formattingScore));

  // Parse JD if provided
  let jdComparison: JDComparison | null = null;
  let jdKeywordsList: string[] = [];

  if (jobDescription && jobDescription.trim().length > 10) {
    const jdTextLower = jobDescription.toLowerCase();
    const foundJdKeywords = new Set<string>();

    for (const tech of COMMON_TECH_KEYWORDS) {
      if (jdTextLower.includes(tech)) {
        foundJdKeywords.add(tech);
      }
    }
    const jdTokens = jobDescription
      .split(/[,•|/\n\t*]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 2 && s.length < 30);
    for (const t of jdTokens.slice(0, 30)) {
      if (COMMON_TECH_KEYWORDS.some((k) => k.includes(t) || t.includes(k))) {
        foundJdKeywords.add(t);
      }
    }

    jdKeywordsList = Array.from(foundJdKeywords);
    if (jdKeywordsList.length === 0) {
      jdKeywordsList = ['react', 'typescript', 'javascript', 'git', 'communication'];
    }

    const resumeTerms = Array.from(new Set([...parsed.keywords, ...parsed.skills])).map(normalizeSkill);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const jdKw of jdKeywordsList) {
      const jdNorm = normalizeSkill(jdKw);
      const isMatched = resumeTerms.some(
        (rt) => rt === jdNorm || stringSimilarity(rt, jdNorm) >= 0.8
      );
      if (isMatched) {
        matchedKeywords.push(jdKw);
      } else {
        missingKeywords.push(jdKw);
      }
    }

    const overlap = matchedKeywords.length / jdKeywordsList.length;
    const semanticSim = Math.min(1.0, Math.max(0.1, overlap * 0.85 + 0.15));
    const matchPct = Math.round((overlap * 0.6 + semanticSim * 0.4) * 1000) / 10;
    const skillsGap = missingKeywords.slice(0, 10);

    jdComparison = {
      match_percentage: matchPct,
      semantic_similarity: Math.round(semanticSim * 100) / 100,
      matched_keywords: matchedKeywords.slice(0, 20),
      missing_keywords: missingKeywords.slice(0, 15),
      skills_gap: skillsGap,
    };
  }

  // 2. KEYWORDS SCORE (max 25)
  let keywordsScore = 0.0;
  keywordsScore += tierScore(parsed.keywords.length, [[20, 10.0], [15, 8.0], [10, 6.0], [5, 4.0], [3, 2.0]]);
  keywordsScore += tierScore(parsed.skills.length, [[15, 10.0], [10, 8.0], [7, 6.0], [5, 4.0], [3, 2.0]]);

  if (jdKeywordsList.length > 0 && jdComparison) {
    const matchRatio = jdComparison.matched_keywords.length / jdKeywordsList.length;
    keywordsScore += tierScore(matchRatio, [[0.7, 5.0], [0.5, 4.0], [0.3, 3.0], [0.2, 2.0], [0.1, 1.0]]);
  } else if (parsed.keywords.length >= 10) {
    keywordsScore += 3.0;
  }
  keywordsScore = Math.min(25.0, Math.max(0.0, keywordsScore));

  // 3. CONTENT SCORE (max 25)
  let contentScore = 0.0;
  contentScore += tierScore(parsed.action_verbs.length, [[15, 10.0], [10, 8.0], [7, 6.0], [5, 4.0], [3, 2.0]]);

  const numberPatterns = [
    /\d+%/g,
    /\$\d+/g,
    /\d+[kKmMbB]/g,
    /\d+\s*(?:users|customers|clients|projects|hours|days|months|years|members|participants)/gi,
    /(?:increased|decreased|improved|reduced|grew|saved)\s+(?:by\s+)?\d+/gi,
    /(?:cgpa|cpi)\s*[:=-]?\s*\d+/gi,
  ];
  let achievementCount = 0;
  for (const pat of numberPatterns) {
    achievementCount += (text.match(pat) || []).length;
  }
  contentScore += tierScore(achievementCount, [[10, 5.0], [7, 4.0], [5, 3.0], [3, 2.0], [1, 1.0]]);
  contentScore += 10.0; // grammar base score
  contentScore = Math.min(25.0, Math.max(0.0, contentScore));

  // 4. SKILL VALIDATION SCORE (max 15)
  const skillValidationDetails = validateSkillsWithProjects(
    parsed.skills,
    parsed.projects,
    parsed.experience,
    text
  );
  let skillValidationScore = Math.min(15.0, (skillValidationDetails.validation_pct / 100.0) * 15.0);

  // Fresher mode bonus for college projects / hackathons
  if (mode === 'fresher' && (parsed.academic_details.has_hackathons || parsed.academic_details.has_college_clubs)) {
    skillValidationScore = Math.min(15.0, skillValidationScore + 2.0);
  }

  // 5. ATS COMPATIBILITY SCORE (max 15)
  const locationPrivacy = detectLocationPrivacy(text);
  let atsCompatScore = 15.0;
  atsCompatScore -= locationPrivacy.penalty;

  const specialChars = (text.match(/[│┤├┼┴┬╔╗╚╝═║╠╣╦╩╬]/g) || []).length;
  if (specialChars > 20) atsCompatScore -= 2.0;
  else if (specialChars > 10) atsCompatScore -= 1.0;

  if (mode === 'fresher') {
    // For freshers, do not penalize for short experience
    if (parsed.skills.length > 5 && parsed.projects.length >= 2) {
      atsCompatScore += 1.0;
    }
  } else {
    const expDescLen = parsed.experience.reduce((acc, e) => acc + e.description.length, 0);
    let shortSections = 0;
    if (parsed.experience.length > 0 && expDescLen < 20) shortSections++;
    if (parsed.skills.length > 0 && parsed.skills.length < 2) shortSections++;
    if (shortSections >= 2) atsCompatScore -= 2.0;
    else if (shortSections >= 1) atsCompatScore -= 1.0;

    if (parsed.experience.length > 0 && parsed.skills.length > 5) {
      atsCompatScore += 1.0;
    }
  }
  atsCompatScore = Math.min(15.0, Math.max(0.0, atsCompatScore));

  // COMPONENT PERCENTAGES
  const formattingPct = (formattingScore / 20.0) * 100.0;
  const keywordsPct = (keywordsScore / 25.0) * 100.0;
  const contentPct = (contentScore / 25.0) * 100.0;
  const skillValidationPct = (skillValidationScore / 15.0) * 100.0;
  const atsCompatPct = (atsCompatScore / 15.0) * 100.0;

  const skillsKeywordsPct = keywordsPct * 0.6 + skillValidationPct * 0.4;
  let overallScore =
    skillsKeywordsPct * 0.4 +
    contentPct * 0.3 +
    formattingPct * 0.15 +
    atsCompatPct * 0.15;

  // Bonuses & penalties
  if (skillValidationDetails.validation_pct >= 90) overallScore += 2.0;
  else if (skillValidationDetails.validation_pct >= 80) overallScore += 1.0;

  // Fresher CGPA academic bonus
  if (mode === 'fresher' && parsed.academic_details.cgpa) {
    const cgpaNum = parseFloat(parsed.academic_details.cgpa);
    if (!isNaN(cgpaNum) && cgpaNum >= 8.0) {
      overallScore += 2.0;
    }
  }

  if (jdComparison && jdKeywordsList.length > 0) {
    const missingPct = jdComparison.missing_keywords.length / jdKeywordsList.length;
    if (missingPct > 0.7) overallScore -= 15.0;
    else if (missingPct > 0.5) overallScore -= 10.0;
    else if (missingPct > 0.3) overallScore -= 5.0;
  }

  overallScore = Math.min(100.0, Math.max(0.0, Math.round(overallScore * 10) / 10));

  // SCORE INTERPRETATION
  let interpretation = '';
  if (overallScore >= 90) interpretation = 'Excellent! Highly optimized for ATS scanners and technical recruiter screening.';
  else if (overallScore >= 80) interpretation = 'Great! Strong qualification signal with room for minor keyword tuning.';
  else if (overallScore >= 70) interpretation = 'Good! ATS-compatible structure with key actionable enhancements recommended.';
  else if (overallScore >= 60) interpretation = 'Fair. Missing key keywords or project evidence needed for competitive ATS pass-rates.';
  else if (overallScore >= 50) interpretation = 'Below Average. Notable keyword gaps and unevidenced skills detected.';
  else interpretation = 'Needs Improvement. Fundamental revisions needed to pass automated screening filters.';

  const componentScores: ComponentScores = {
    formatting: Math.round(formattingScore * 10) / 10,
    keywords: Math.round(keywordsScore * 10) / 10,
    content: Math.round(contentScore * 10) / 10,
    skill_validation: Math.round(skillValidationScore * 10) / 10,
    ats_compatibility: Math.round(atsCompatScore * 10) / 10,
  };

  // Generate explainable issues with copy-paste corrections
  const missingKeywords = jdComparison ? jdComparison.missing_keywords : [];
  const explainableIssues = generateExplainableIssues(parsed, text, jobDescription, missingKeywords, mode);

  // Skill workarounds (e.g. Tableau vs PowerBI)
  const skillWorkarounds = findSkillWorkarounds(missingKeywords, parsed.skills);

  // Skill learning roadmaps
  const skillRoadmaps = generateSkillRoadmaps(missingKeywords);

  // Standard detailed feedback
  const detailedFeedback: IssueDetail[] = explainableIssues.map((ei) => ({
    issue_title: ei.issue_title,
    severity_level: ei.severity,
    ats_impact: `Score Impact: +${ei.score_impact} pts`,
    explanation: ei.why_it_matters,
    where_it_appears: ei.exact_resume_text,
    how_to_fix: `Change "${ei.exact_resume_text}" to "${ei.suggested_correction}"`,
    action_items: [
      `Replace with suggested copy-paste correction in in-browser editor`,
      `Aligns with requirement: ${ei.job_requirement}`,
    ],
    example_improvement: ei.suggested_correction,
  }));

  const issuesSummary = explainableIssues.map((i) => i.issue_title);

  // STRENGTHS
  const strengths: string[] = [];
  if (mode === 'fresher') {
    if (parsed.academic_details.cgpa) {
      strengths.push(`Strong Academic Record — CGPA ${parsed.academic_details.cgpa}/10 explicitly noted`);
    }
    if (parsed.academic_details.has_hackathons) {
      strengths.push('Hackathon & Competitive Coding participation demonstrates practical problem-solving');
    }
    if (parsed.academic_details.has_college_clubs) {
      strengths.push('Active member of Technical Societies / Student Chapters (GDSC/IEEE/CSI)');
    }
    if (parsed.projects.length >= 2) {
      strengths.push(`${parsed.projects.length} academic & capstone projects showcase practical implementation`);
    }
  } else {
    if (parsed.experience.length > 0) strengths.push('Has dedicated Experience section with professional roles');
  }

  if (parsed.skills.length >= 8) strengths.push(`Solid technical breadth — ${parsed.skills.length} skills recognized`);
  if (parsed.action_verbs.length >= 5) strengths.push(`Uses ${parsed.action_verbs.length} strong action verbs in bullet points`);
  if (skillValidationDetails.validated_count >= 3) {
    strengths.push(`${skillValidationDetails.validated_count} skills are substantiated by project context`);
  }
  if (formattingScore >= 16) strengths.push('Clean single-column ATS-friendly structure');
  if (strengths.length === 0) {
    strengths.push('Good core foundation — apply the recommendations below to unlock higher ATS placement');
  }

  // CRITICAL ISSUES
  const critical_issues: string[] = [];
  if (locationPrivacy.privacy_risk === 'high') {
    critical_issues.push('High privacy risk: Remove detailed location/street address information');
  }
  if (keywordsScore < 12) {
    critical_issues.push('Insufficient keywords and skills detected for this target profile');
  }
  if (skillValidationScore < 7) {
    critical_issues.push('Most skills lack supporting evidence in projects or experience');
  }

  // RECOMMENDATIONS
  const recommendations: Recommendation[] = [];
  if (skillWorkarounds.length > 0) {
    recommendations.push({
      title: 'Leverage Skill Bridge Workarounds',
      description: `You can bridge ${skillWorkarounds.length} missing skill(s) by highlighting your adjacent experience (e.g. ${skillWorkarounds[0].adjacent_skill} for ${skillWorkarounds[0].missing_skill}).`,
      priority: 'high',
      priority_label: 'High Priority',
      priority_icon: '🟠',
      impact_score: 5.0,
      category: 'skill_bridge',
      action_items: skillWorkarounds.map((w) => w.workaround_strategy),
    });
  }

  if (missingKeywords.length > 0) {
    recommendations.push({
      title: 'Incorporate Job Description Keywords',
      description: `${missingKeywords.length} target keywords are absent from your resume. Incorporate these into your project bullets.`,
      priority: 'critical',
      priority_label: 'Critical',
      priority_icon: '🔴',
      impact_score: 7.0,
      category: 'keywords',
      action_items: missingKeywords.slice(0, 5).map((kw) => `Add '${kw}' to skills or experience bullets`),
    });
  }

  const suggestions: string[] = [
    'Use the In-Browser Live Editor to preview real-time score updates as you refine bullets.',
    'Quantify outcomes with percentages, user counts, or latency reductions.',
    'Review the learning roadmaps for any non-negotiable tool gaps.',
  ];

  return {
    ATS_score: overallScore,
    ats_score: overallScore,
    mode,
    component_scores: componentScores,
    issues_summary: issuesSummary,
    detailed_feedback: detailedFeedback,
    explainable_issues: explainableIssues,
    skill_workarounds: skillWorkarounds,
    skill_roadmaps: skillRoadmaps,
    academic_details: parsed.academic_details,
    jd_match_analysis: jdComparison,
    jd_comparison: jdComparison,
    skill_validation_details: skillValidationDetails,
    keyword_match: jdComparison ? jdComparison.match_percentage : 0,
    missing_keywords: jdComparison ? jdComparison.missing_keywords : [],
    matched_keywords: jdComparison ? jdComparison.matched_keywords : parsed.keywords.slice(0, 15),
    skills: parsed.skills,
    strengths,
    critical_issues,
    suggestions,
    interpretation,
    recommendations,
  };
}
