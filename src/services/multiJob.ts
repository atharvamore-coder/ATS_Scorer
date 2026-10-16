import { JobPosting, MultiJobAnalysis } from '../types/ats';
import { normalizeSkill, stringSimilarity, parseResumeClientSide } from './scorer';

export function analyzeMultiJobs(
  resumeText: string,
  jobs: JobPosting[]
): MultiJobAnalysis {
  const parsed = parseResumeClientSide(resumeText);
  const resumeTerms = Array.from(new Set([...parsed.keywords, ...parsed.skills])).map(normalizeSkill);

  // Extract keywords per job
  const jobAnalyses = jobs.map((job) => {
    const textLower = job.content.toLowerCase();
    const words = job.content
      .split(/[,•|/\n\t*()]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 2 && s.length < 30);

    const detectedKeywords = new Set<string>();
    // Check common tech keywords & tokens
    words.forEach((w) => {
      if (w.length > 2 && !['and', 'the', 'with', 'for', 'you', 'will', 'are'].includes(w)) {
        detectedKeywords.add(w);
      }
    });

    const jobKeywords = Array.from(detectedKeywords).slice(0, 30);
    const matched: string[] = [];
    const missing: string[] = [];

    jobKeywords.forEach((kw) => {
      const kwNorm = normalizeSkill(kw);
      const isMatched = resumeTerms.some(
        (rt) => rt === kwNorm || stringSimilarity(rt, kwNorm) >= 0.8
      );
      if (isMatched) matched.push(kw);
      else missing.push(kw);
    });

    const matchPct = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;

    return {
      id: job.id,
      title: job.title || 'Target Job',
      company: job.company || 'Company',
      keywords: jobKeywords,
      matched,
      missing,
      match_percentage: matchPct,
    };
  });

  // Calculate Universal Matched Skills (matched across at least 2 jobs or all jobs)
  const skillOccurrencesMatched: Record<string, number> = {};
  jobAnalyses.forEach((ja) => {
    ja.matched.forEach((m) => {
      skillOccurrencesMatched[m] = (skillOccurrencesMatched[m] || 0) + 1;
    });
  });

  const universal_matched_skills = Object.keys(skillOccurrencesMatched).filter(
    (k) => skillOccurrencesMatched[k] >= Math.min(2, jobs.length)
  );

  // Calculate Universal Missing Skills (missing across multiple jobs)
  const skillOccurrencesMissing: Record<string, number> = {};
  jobAnalyses.forEach((ja) => {
    ja.missing.forEach((m) => {
      skillOccurrencesMissing[m] = (skillOccurrencesMissing[m] || 0) + 1;
    });
  });

  const universal_missing_skills = Object.keys(skillOccurrencesMissing)
    .filter((k) => skillOccurrencesMissing[k] >= Math.min(2, jobs.length))
    .slice(0, 10);

  // Calculate Role-specific gaps (skills required by only one job)
  const role_specific_gaps: Record<string, string[]> = {};
  jobAnalyses.forEach((ja) => {
    const uniqueToJob = ja.missing.filter(
      (m) => (skillOccurrencesMissing[m] || 0) === 1
    );
    role_specific_gaps[ja.title] = uniqueToJob.slice(0, 6);
  });

  // High-leverage fixes (fixing this one change boosts multiple jobs)
  const high_leverage_fixes: MultiJobAnalysis['high_leverage_fixes'] = [];
  universal_missing_skills.slice(0, 4).forEach((skill) => {
    const benefiting = jobAnalyses
      .filter((ja) => ja.missing.includes(skill))
      .map((ja) => `${ja.title} (${ja.company})`);

    high_leverage_fixes.push({
      recommendation: `Add verifiable experience or project bullets for '${skill}'`,
      benefiting_jobs: benefiting,
      potential_score_boost: `+${benefiting.length * 5}% across ${benefiting.length} target roles`,
    });
  });

  return {
    resume_title: parsed.name ? `${parsed.name}'s Resume` : 'Candidate Resume',
    jobs: jobAnalyses.map((ja) => ({
      id: ja.id,
      title: ja.title,
      company: ja.company,
      match_percentage: ja.match_percentage,
      matched_count: ja.matched.length,
      missing_count: ja.missing.length,
    })),
    universal_matched_skills: universal_matched_skills.slice(0, 15),
    universal_missing_skills: universal_missing_skills.slice(0, 12),
    role_specific_gaps,
    high_leverage_fixes,
  };
}
