import {
  CultureArchetypeId,
  CultureAnalysisResult,
  CultureDimensionScore,
  ValueMatchItem,
  CultureReframingItem,
  CompanyCultureProfile,
  CompanyMatchAnalysis,
} from '../types/ats';
import {
  CULTURE_ARCHETYPES,
  CORE_VALUES_DATASET,
  CULTURAL_REFRAMINGS_DATASET,
} from '../data/cultureDatasets';

export function calculateCultureAnalysis(
  resumeText: string,
  jobDescription: string = '',
  archetypeId: CultureArchetypeId = 'fast_paced_startup'
): CultureAnalysisResult {
  const archetype =
    CULTURE_ARCHETYPES.find((a) => a.id === archetypeId) || CULTURE_ARCHETYPES[0];

  const lowerResume = resumeText.toLowerCase();
  const lowerJD = jobDescription.toLowerCase();

  // Split resume into sentence/bullet chunks for evidence extraction
  const rawLines = resumeText
    .split(/[\n•\-\*\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 20);

  // 1. Evaluate 4 Core Environmental Dimensions
  const autonomyKeywords = [
    'spearheaded', 'owned', 'end-to-end', 'architected', 'drove', 'founded',
    'single-handedly', 'independent', 'initiative', 'unprompted', 'bootstrapped',
    'championed', 'established', 'led', 'autonomous',
  ];
  const velocityKeywords = [
    'shipped', 'deployed', 'launched', 'prototyped', 'mvp', 'iterated',
    'accelerated', 'fast', 'sprint', 'reduced time', 'rapid', 'quick',
    'hours', 'days', 'production', 'automated',
  ];
  const collaborationKeywords = [
    'partnered', 'cross-functional', 'stakeholder', 'mentored', 'co-designed',
    'facilitated', 'aligned', 'team', 'reviewed', 'shared', 'pair', 'collaborated',
    'consensus', 'product manager', 'designer',
  ];
  const adaptabilityKeywords = [
    'adapted', 'pivoted', 'ambiguity', 'self-taught', 'learned quickly',
    'greenfield', 'experimented', 'transitioned', 'evolving', 'new domain',
    'scale', 'restructured', 'refactored',
  ];

  const countMatches = (keywords: string[]) => {
    let count = 0;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lowerResume.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const autonomyCount = countMatches(autonomyKeywords);
  const velocityCount = countMatches(velocityKeywords);
  const collabCount = countMatches(collaborationKeywords);
  const adaptCount = countMatches(adaptabilityKeywords);

  // Calculate scores normalized to 100 with archetypes benchmarks
  const normalize = (count: number, baseWeight: number) => {
    const raw = Math.min(100, Math.round(count * baseWeight + 45));
    return Math.max(35, raw);
  };

  const autonomyScore = normalize(autonomyCount, 5.5);
  const velocityScore = normalize(velocityCount, 6.0);
  const collabScore = normalize(collabCount, 5.0);
  const adaptScore = normalize(adaptCount, 6.5);

  const getVerdict = (score: number, benchmark: number) => {
    const diff = score - benchmark;
    if (diff >= 5) return 'Strong Match';
    if (diff >= -5) return 'Aligned';
    if (diff >= -15) return 'Needs Reinforcement';
    return 'Under-represented';
  };

  const dimensions: CultureDimensionScore[] = [
    {
      id: 'autonomy',
      name: 'Autonomy & Radical Ownership',
      score: autonomyScore,
      benchmark: archetype.id === 'fast_paced_startup' ? 85 : archetype.id === 'remote_first_async' ? 90 : 75,
      verdict: getVerdict(
        autonomyScore,
        archetype.id === 'fast_paced_startup' ? 85 : archetype.id === 'remote_first_async' ? 90 : 75
      ),
      detected_indicators: autonomyKeywords
        .filter((k) => lowerResume.includes(k))
        .slice(0, 4),
      missing_indicators: autonomyKeywords
        .filter((k) => !lowerResume.includes(k))
        .slice(0, 3),
      description:
        'Measures initiative, end-to-end accountability, and ability to deliver without waiting for prescriptive guidance.',
    },
    {
      id: 'velocity',
      name: 'Execution Velocity & Action Bias',
      score: velocityScore,
      benchmark: archetype.id === 'fast_paced_startup' ? 90 : archetype.id === 'enterprise_fintech' ? 65 : 75,
      verdict: getVerdict(
        velocityScore,
        archetype.id === 'fast_paced_startup' ? 90 : archetype.id === 'enterprise_fintech' ? 65 : 75
      ),
      detected_indicators: velocityKeywords
        .filter((k) => lowerResume.includes(k))
        .slice(0, 4),
      missing_indicators: velocityKeywords
        .filter((k) => !lowerResume.includes(k))
        .slice(0, 3),
      description:
        'Evaluates frequency of shipping, willingness to prototype rapidly, and demonstrable bias toward tangible deliverables.',
    },
    {
      id: 'collaboration',
      name: 'Team Dynamics & Cross-Functional Influence',
      score: collabScore,
      benchmark: archetype.id === 'mission_driven' ? 90 : archetype.id === 'big_tech_scale' ? 85 : 75,
      verdict: getVerdict(
        collabScore,
        archetype.id === 'mission_driven' ? 90 : archetype.id === 'big_tech_scale' ? 85 : 75
      ),
      detected_indicators: collaborationKeywords
        .filter((k) => lowerResume.includes(k))
        .slice(0, 4),
      missing_indicators: collaborationKeywords
        .filter((k) => !lowerResume.includes(k))
        .slice(0, 3),
      description:
        'Reflects co-designing with design/product stakeholders, mentoring peers, and fostering constructive team communication.',
    },
    {
      id: 'adaptability',
      name: 'Comfort with Ambiguity & Growth Mindset',
      score: adaptScore,
      benchmark: archetype.id === 'fast_paced_startup' ? 85 : 75,
      verdict: getVerdict(adaptScore, archetype.id === 'fast_paced_startup' ? 85 : 75),
      detected_indicators: adaptabilityKeywords
        .filter((k) => lowerResume.includes(k))
        .slice(0, 4),
      missing_indicators: adaptabilityKeywords
        .filter((k) => !lowerResume.includes(k))
        .slice(0, 3),
      description:
        'Measures flexibility when pivoting stacks, tackling greenfield challenges, and thriving in dynamic environments.',
    },
  ];

  // 2. Evaluate Core Values Alignment
  const valuesMatches: ValueMatchItem[] = CORE_VALUES_DATASET.map((val) => {
    // Evidence search
    const foundEvidence: string[] = [];
    rawLines.forEach((line) => {
      const lineLower = line.toLowerCase();
      const hasKeyword = val.keywords.some((kw) => lineLower.includes(kw));
      const hasVerb = val.verbs.some((vb) => lineLower.includes(vb));
      if ((hasKeyword || hasVerb) && foundEvidence.length < 2) {
        foundEvidence.push(line);
      }
    });

    const isHighImportance =
      lowerJD.length > 30
        ? val.keywords.some((kw) => lowerJD.includes(kw)) ||
          archetype.primary_values.some((pv) => pv.toLowerCase().includes(val.name.toLowerCase().split(' ')[0]))
        : archetype.primary_values.some((pv) => pv.toLowerCase().includes(val.name.toLowerCase().split(' ')[0]));

    let matchStatus: 'strong' | 'moderate' | 'missing' = 'missing';
    if (foundEvidence.length >= 2) {
      matchStatus = 'strong';
    } else if (foundEvidence.length === 1) {
      matchStatus = 'moderate';
    }

    return {
      value_name: val.name,
      category: val.category,
      match_status: matchStatus,
      importance: isHighImportance ? 'High' : 'Medium',
      detected_evidence: foundEvidence,
      rationale:
        matchStatus === 'strong'
          ? `Strong alignment demonstrated with concrete action verbs and measurable results.`
          : matchStatus === 'moderate'
          ? `Partially conveyed; additional quantifiable outcomes would solidify this value.`
          : `Unexpressed in resume. Roles in ${archetype.name} specifically screen for this behavior.`,
      remedy: val.remedy_template,
    };
  });

  // Calculate overall score
  const strongValuesCount = valuesMatches.filter((v) => v.match_status === 'strong').length;
  const modValuesCount = valuesMatches.filter((v) => v.match_status === 'moderate').length;
  const valuesScore = Math.min(100, Math.round((strongValuesCount * 12 + modValuesCount * 6) + 30));

  const dimAvg = Math.round(
    (autonomyScore + velocityScore + collabScore + adaptScore) / 4
  );

  const overallScore = Math.min(98, Math.max(48, Math.round(dimAvg * 0.6 + valuesScore * 0.4)));

  let tier: CultureAnalysisResult['archetype_alignment_tier'] = 'Moderate Alignment';
  let summary = '';

  if (overallScore >= 85) {
    tier = 'Exemplary Synergy';
    summary = `Your resume strongly projects the proactive ownership, high velocity, and behavioral traits prioritized by ${archetype.name} organizations.`;
  } else if (overallScore >= 72) {
    tier = 'High Compatibility';
    summary = `Your profile shows clear compatibility with ${archetype.name}. A few targeted reframings in ownership and quantitative impact will push this into top-percentile alignment.`;
  } else if (overallScore >= 60) {
    tier = 'Moderate Alignment';
    summary = `Moderate alignment with ${archetype.name}. The resume currently leans somewhat passive or task-oriented. Incorporating stronger bias for action and explicit cross-functional impact will elevate your candidacy.`;
  } else {
    tier = 'Cultural Disconnect';
    summary = `Noticeable cultural disconnect detected. The resume presents individual assignments without emphasizing the end-to-end autonomy and rapid iteration crucial to ${archetype.name}.`;
  }

  // 3. Generate Reframing Suggestions
  const reframingSuggestions: CultureReframingItem[] = [];

  // Check actual lines against regex patterns
  rawLines.forEach((line, idx) => {
    if (reframingSuggestions.length >= 4) return;

    for (const rule of CULTURAL_REFRAMINGS_DATASET) {
      if (rule.pattern.test(line)) {
        // Create reframed version
        const verbMatch = line.match(rule.pattern)?.[0] || 'assisted';
        const cleaned = line.replace(rule.pattern, '').trim();
        const reframed = `Spearheaded ${cleaned.replace(/^with\s+/i, '')}, driving end-to-end delivery and quantifiable performance gains.`;

        reframingSuggestions.push({
          id: `reframing-${idx}`,
          target_dimension_or_value: rule.cultural_category,
          original_bullet: line,
          reframed_bullet: rule.suggested_reframing.includes('microservice') && !line.toLowerCase().includes('microservice')
            ? reframed
            : rule.suggested_reframing,
          culture_impact: `Elevates perceived autonomy and replaces passive "${verbMatch}" with decisive ownership.`,
          why_it_works: rule.explanation,
        });
        break;
      }
    }
  });

  // If few regex matches were triggered, add archetype-specific recommendations
  if (reframingSuggestions.length < 3) {
    reframingSuggestions.push({
      id: 'archetype-boost-1',
      target_dimension_or_value: archetype.primary_values[0] || 'Extreme Ownership',
      original_bullet: rawLines[0] || 'Responsible for software development and debugging code.',
      reframed_bullet:
        'Owned core full-stack feature lifecycle from technical architecture to production deployment, cutting latency by 35%.',
      culture_impact: `Demonstrates ${archetype.name} alignment by linking architecture to measured business outcomes.`,
      why_it_works:
        'Hiring managers at fast-paced teams look for ownership of the full lifecycle rather than task assignments.',
    });

    reframingSuggestions.push({
      id: 'archetype-boost-2',
      target_dimension_or_value: 'Cross-Functional Leadership',
      original_bullet: rawLines[1] || 'Worked with team members during sprints and daily meetings.',
      reframed_bullet:
        'Partnered closely with product managers and UI designers to ship responsive customer-facing features 2 weeks ahead of schedule.',
      culture_impact: 'Proves cross-departmental collaboration and velocity rather than passive attendance.',
      why_it_works:
        'Emphasizes mutual alignment and accountability across product, design, and engineering disciplines.',
    });
  }

  // 4. Environmental Signals
  const environmentalSignals = {
    communication_style:
      lowerResume.includes('documented') || lowerResume.includes('authored') || lowerResume.includes('rfc')
        ? 'Asynchronous & Documentation-Driven'
        : 'Direct & Action-Oriented (Could benefit from more documentation markers)',
    pace_orientation:
      velocityScore >= 75
        ? 'Rapid MVP Iteration & Continuous Deployment'
        : 'Deliberate & Methodical Execution',
    decision_making_autonomy:
      autonomyScore >= 80
        ? 'High Autonomy (Self-Directed Problem Solver)'
        : 'Supervised / Structured Guidance Preferred',
    team_structure_readiness:
      collabScore >= 80
        ? 'High Cross-Functional Influence & Mentorship'
        : 'Focused Individual Contributor',
  };

  return {
    archetype,
    overall_culture_score: overallScore,
    archetype_alignment_tier: tier,
    summary_verdict: summary,
    dimensions,
    values_matches: valuesMatches,
    reframing_suggestions: reframingSuggestions.slice(0, 4),
    environmental_signals: environmentalSignals,
  };
}

export function calculateCompanyCultureMatch(
  resumeText: string,
  company: CompanyCultureProfile
): CompanyMatchAnalysis {
  const lowerResume = (resumeText || '').toLowerCase();
  const rawBullets = (resumeText || '')
    .split(/[\n•\-\*\r]+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 25);

  // 1. Keyword alignment
  const matchedKeywords = company.target_keywords.filter((kw) =>
    lowerResume.includes(kw.toLowerCase())
  );
  const keywordRatio = company.target_keywords.length > 0
    ? matchedKeywords.length / company.target_keywords.length
    : 0.5;

  // 2. Behavioral signal checks
  const hasHackathon = /hackathon|sih|competition|contest|codechef|leetcode/i.test(resumeText);
  const hasLeadership = /lead|gdsc|mentor|club|spearheaded|founded|president/i.test(resumeText);
  const hasMetrics = /\d+[\%kM\+]|\d+\s*(users|seconds|ms|queries|records)/i.test(resumeText);
  const hasFullStack = /react|node|express|api|full-stack|fullstack|postgresql|mongo/i.test(resumeText);
  const hasTestingOrCleanCode = /test|ci\/cd|git|github|clean|docker|documentation/i.test(resumeText);

  // Score baseline
  let score = Math.round(52 + keywordRatio * 32);
  if (hasHackathon) score += 5;
  if (hasLeadership) score += 4;
  if (hasMetrics) score += 5;
  if (hasFullStack) score += 4;
  if (hasTestingOrCleanCode) score += 3;

  // Cap between 48 and 96
  score = Math.min(96, Math.max(48, score));

  // Determine tier
  let match_tier: CompanyMatchAnalysis['match_tier'] = 'Moderate Fit';
  if (score >= 85) match_tier = 'Exceptional Match';
  else if (score >= 72) match_tier = 'Strong Fit';
  else if (score >= 58) match_tier = 'Moderate Fit';
  else match_tier = 'Needs Culture Reframing';

  // 3. Extract "Why You Match" in plain English
  const whyYouMatch: string[] = [];

  if (hasHackathon) {
    whyYouMatch.push(
      'Demonstrated sprint velocity & problem-solving: Your hackathon participation proves you can prototype and deliver under real-world pressure.'
    );
  }
  if (hasLeadership) {
    whyYouMatch.push(
      'Community leadership & teamwork: Your club lead or mentorship roles show you naturally share knowledge and support fellow teammates.'
    );
  }
  if (hasMetrics) {
    whyYouMatch.push(
      'Measurable impact awareness: Your resume highlights quantifiable results (e.g. user counts, performance gains), which align directly with their data-driven standards.'
    );
  }
  if (hasFullStack) {
    whyYouMatch.push(
      `Strong technical baseline: You have hands-on experience across modern stacks (${matchedKeywords.slice(0, 3).join(', ') || 'React, Python, APIs'}) directly used in their products.`
    );
  }

  // Fallback reasons if needed
  if (whyYouMatch.length < 3) {
    whyYouMatch.push(
      `Clear role alignment: Your technical foundation directly aligns with ${company.name}'s engineering standards and domain.`
    );
  }
  if (whyYouMatch.length < 3) {
    whyYouMatch.push(
      `Enthusiasm for building: Your project portfolio shows initiative in building functional applications beyond standard coursework.`
    );
  }

  // 4. "Simple Ways to Stand Out" in plain English (No jargon!)
  const standOutTips: string[] = [];

  if (!hasMetrics) {
    standOutTips.push(
      'Add numbers to your project bullets (e.g., "Used by 50+ students" or "Loaded in under 1 second") to prove real-world impact.'
    );
  } else {
    standOutTips.push(
      `Mention how your code improved the experience for everyday users, showing ${company.core_values[0]?.name || 'customer care'}.`
    );
  }

  if (!lowerResume.includes('test') && !lowerResume.includes('unit')) {
    standOutTips.push(
      'Briefly mention automated testing or bug fixing to show you care about code reliability and system quality.'
    );
  }

  standOutTips.push(
    `In your interview, explicitly weave in their core value of "${company.core_values[1]?.name || 'Collaboration'}" when describing team project challenges.`
  );

  // 5. Connect user's actual resume highlights to company core values
  const resumeConnections: CompanyMatchAnalysis['resume_highlight_connections'] = [];

  company.core_values.forEach((value, index) => {
    // Find relevant bullet in resume
    let matchedBullet = '';
    if (index === 0 && rawBullets.length > 0) {
      // Find bullet with numbers or projects
      matchedBullet = rawBullets.find((b) => /\d+|deployed|portal|users/i.test(b)) || rawBullets[0];
    } else if (index === 1) {
      matchedBullet = rawBullets.find((b) => /hackathon|sprint|built|designed/i.test(b)) || rawBullets[1] || rawBullets[0];
    } else if (index === 2) {
      matchedBullet = rawBullets.find((b) => /team|club|lead|conducted|mentored|collaborated/i.test(b)) || rawBullets[2] || rawBullets[0];
    } else {
      matchedBullet = rawBullets.find((b) => /learning|leetcode|model|system|c\+\+|python/i.test(b)) || rawBullets[3] || rawBullets[0];
    }

    if (matchedBullet) {
      resumeConnections.push({
        resume_bullet: matchedBullet.replace(/^[\s•\-\*]+/, '').trim(),
        company_value: value.name,
        why_it_works: `Connects to "${value.name}" because it shows ${value.plain_meaning.toLowerCase()}`,
      });
    }
  });

  // 6. Behavioral Interview Prep
  const behavioralPrep: CompanyMatchAnalysis['behavioral_interview_prep'] = company.sample_interview_questions.map(
    (question, idx) => {
      let suggestedPoint = rawBullets[idx % rawBullets.length] || 'Discuss a capstone project or team hackathon';
      suggestedPoint = suggestedPoint.replace(/^[\s•\-\*]+/, '').trim();

      let howToAnswer = '';
      if (idx === 0) {
        howToAnswer = 'Use the STAR method: describe the initial confusion, what steps you took on your own, and the final working outcome.';
      } else if (idx === 1) {
        howToAnswer = 'Focus on active listening, staying calm, finding common ground, and keeping the team goal ahead of personal ego.';
      } else {
        howToAnswer = 'Explain how you balance speed with writing clean, readable code and adding basic error handling.';
      }

      return {
        question,
        how_to_answer: howToAnswer,
        suggested_resume_point: suggestedPoint,
      };
    }
  );

  return {
    company,
    match_score: score,
    match_tier,
    why_you_match: whyYouMatch,
    simple_ways_to_stand_out: standOutTips,
    resume_highlight_connections: resumeConnections,
    behavioral_interview_prep: behavioralPrep,
  };
}
