import { CultureArchetype, CultureArchetypeId } from '../types/ats';

export const CULTURE_ARCHETYPES: CultureArchetype[] = [
  {
    id: 'fast_paced_startup',
    name: 'High-Velocity Startup',
    tagline: 'Seed to Series B · Extreme Ownership & Rapid Experimentation',
    description:
      'Thrives on ambiguity, rapid MVP deployment, lean resourcefulness, and self-directed problem solving without awaiting managerial permission.',
    primary_values: [
      'Bias for Action',
      'Extreme Ownership',
      'Frugality & Speed',
      'Comfort with Ambiguity',
    ],
    key_traits: [
      'Deploys features in hours/days, not quarters',
      'Wears multiple hats across product, dev, and customer support',
      'Optimizes for fast feedback loops and quick pivots',
      'Proactively unblocks self and teammates',
    ],
    environment_summary:
      'Flat hierarchy with high autonomy. Values shipping working prototypes over endless committee reviews.',
  },
  {
    id: 'big_tech_scale',
    name: 'Global Scale & Platform Eng',
    tagline: 'Big Tech / Tier 1 Enterprise · Reliability & Multi-Org Leverage',
    description:
      'Focuses on planetary scale, distributed systems resilience, data-driven consensus, thorough design docs, and cross-functional leadership.',
    primary_values: [
      'Systemic Scalability',
      'Data-Driven Decision Making',
      'Blameless Post-Mortems',
      'Architectural Rigor',
    ],
    key_traits: [
      'Builds for millions of users with 99.99% reliability targets',
      'Authors RFCs and architectural design specifications',
      'Mentors junior engineers and drives team-wide coding standards',
      'Balances rapid delivery with security, privacy, and compliance',
    ],
    environment_summary:
      'Structured matrix organization with peer reviews. Values robust evidence, telemetry, and systemic impact.',
  },
  {
    id: 'remote_first_async',
    name: 'Remote-First & Async Culture',
    tagline: 'Distributed Teams · Written Clarity & Self-Directed Focus',
    description:
      'Emphasizes autonomous execution, thorough written documentation, public work-in-progress, and deep work without micromanagement.',
    primary_values: [
      'Transparent Documentation',
      'Asynchronous Communication',
      'Self-Driven Discipline',
      'Result-Oriented Autonomy',
    ],
    key_traits: [
      'Writes clear proposals, issue tickets, and handoff documentation',
      'Respects time zones by avoiding synchronous meeting blockers',
      'Owns tasks end-to-end without constant supervisory check-ins',
      'Proactively communicates blockers before deadlines',
    ],
    environment_summary:
      'Distributed worldwide. Values thoughtful written synthesis, proactive updates, and independent execution.',
  },
  {
    id: 'enterprise_fintech',
    name: 'FinTech & High-Rigor Enterprise',
    tagline: 'Financial & Critical Systems · Auditability & Risk Mitigation',
    description:
      'Prioritizes transactional zero-loss accuracy, cryptographic security, compliance readiness, and predictable, zero-downtime releases.',
    primary_values: [
      'Zero-Defect Quality Bar',
      'Security & Regulatory Compliance',
      'Stakeholder Consensus',
      'Auditability & Lineage',
    ],
    key_traits: [
      'Designs fault-tolerant workflows and idempotent transaction pipelines',
      'Strict adherence to security, compliance (SOC2/GDPR/PCI-DSS), and testing',
      'Coordinates with risk, legal, and operational leadership',
      'Validates performance under strict enterprise SLAs',
    ],
    environment_summary:
      'High-stakes domain where reliability and security trump unchecked speed. Values precision and compliance.',
  },
  {
    id: 'mission_driven',
    name: 'Mission-Driven & Product Impact',
    tagline: 'Social Impact, EdTech & Climate · Empathy & User Advocacy',
    description:
      'Driven by customer impact, ethical engineering, sustainable solutions, deep stakeholder empathy, and long-term societal value.',
    primary_values: [
      'Customer Obsession & Empathy',
      'Ethical & Accessible Technology',
      'Inclusive Collaboration',
      'Sustainable Value Creation',
    ],
    key_traits: [
      'Speaks directly with users to uncover friction points and emotional needs',
      'Advocates for accessibility (WCAG), internationalization, and usability',
      'Aligns technical work directly with measurable humanitarian/societal outcomes',
      'Fosters psychological safety, inclusive mentorship, and active listening',
    ],
    environment_summary:
      'Purpose-first culture. Values genuine customer outcomes, empathy, and transparent team collaboration.',
  },
];

export interface CoreValueDefinition {
  name: string;
  category: string;
  keywords: string[];
  verbs: string[];
  positive_signals: string[];
  negative_patterns: string[];
  remedy_template: string;
}

export const CORE_VALUES_DATASET: CoreValueDefinition[] = [
  {
    name: 'Bias for Action & Rapid Execution',
    category: 'Velocity',
    keywords: [
      'launched', 'shipped', 'deployed', 'prototyped', 'mvp', 'iterated',
      'accelerated', 'reduced latency', 'sprint', 'fast-tracked', 'experimented',
      'rapid', 'quick turnaround', 'scrappy',
    ],
    verbs: ['shipped', 'launched', 'piloted', 'accelerated', 'executed', 'tested'],
    positive_signals: [
      'Reduced release cycle time from weeks to days',
      'Built and launched MVP in 3 weeks, validating hypothesis with initial users',
      'Prototyped and benchmarked 3 architectural approaches in 48 hours',
    ],
    negative_patterns: [
      'Observed meetings without concrete deliverables',
      'Passively waited for quarterly roadmap approval',
      'Theoretical research lacking deployment evidence',
    ],
    remedy_template:
      'Reframe task-based descriptions into outcome-driven execution bullets specifying how quickly you validated or shipped the initiative.',
  },
  {
    name: 'Extreme Ownership & Accountability',
    category: 'Autonomy',
    keywords: [
      'spearheaded', 'owned', 'end-to-end', 'accountable', 'drove', 'founded',
      'initiated', 'championed', 'single-handedly', 'orchestrated', 'bootstrapped',
      'resolved unprompted', 'zero supervision',
    ],
    verbs: ['spearheaded', 'championed', 'orchestrated', 'owned', 'governed', 'established'],
    positive_signals: [
      'Owned the entire checkout microservice from database schema to CI/CD pipeline',
      'Identified drop-off bottleneck unprompted and implemented caching fix saving $12k/mo',
      'Accountable for production uptime and on-call rotation resolution for 4 services',
    ],
    negative_patterns: [
      'Assisted team with miscellaneous assignments',
      'Participated as a passive contributor without ownership scope',
      'Blamed third-party APIs without proactive mitigation',
    ],
    remedy_template:
      'Replace passive phrases like "Assisted with" or "Helped develop" with "Owned end-to-end architecture and deployment of..."',
  },
  {
    name: 'Deep Dive & Analytical Rigor',
    category: 'Quality',
    keywords: [
      'analyzed', 'audited', 'benchmarked', 'diagnosed', 'root cause', 'telemetry',
      'metrics', 'quantified', 'profiling', 'statistically', 'evaluated', 'debugged',
      'investigated', 'instrumented',
    ],
    verbs: ['diagnosed', 'audited', 'benchmarked', 'instrumented', 'quantified', 'resolved'],
    positive_signals: [
      'Conducted memory heap profiling, isolating leak and dropping memory usage by 42%',
      'Instrumented OpenTelemetry spans across 14 services to trace distributed latency spikes',
      'Audited SQL query plans, rewriting indexing strategy to reduce p99 from 1.4s to 85ms',
    ],
    negative_patterns: [
      'Claimed optimization without numerical metrics or baseline numbers',
      'Fixed bugs without specifying root causes or preventative tests',
    ],
    remedy_template:
      'Add concrete baseline-to-outcome numbers, root-cause diagnostics, and profiling methodology to engineering bullets.',
  },
  {
    name: 'Cross-Functional Collaboration & Influence',
    category: 'Collaboration',
    keywords: [
      'partnered', 'cross-functional', 'stakeholders', 'coordinated', 'mentored',
      'co-designed', 'facilitated', 'aligned', 'bridge', 'engineering and product',
      'led workshops', 'consensus', 'pair programmed',
    ],
    verbs: ['partnered', 'co-designed', 'aligned', 'facilitated', 'mentored', 'galvanized'],
    positive_signals: [
      'Partnered closely with product management, design, and QA to ship redesign on schedule',
      'Mentored 4 junior engineers, conducting weekly code reviews and 1:1 architectural walkthroughs',
      'Facilitated cross-departmental alignment across finance and engineering teams',
    ],
    negative_patterns: [
      'Siloed coding with zero mention of peers, reviewers, or dependent teams',
      'Sole credit taken without acknowledging team facilitation',
    ],
    remedy_template:
      'Highlight cross-functional partnerships, co-design sessions, and peer mentorship alongside technical deliverables.',
  },
  {
    name: 'Customer Obsession & User Advocacy',
    category: 'Impact',
    keywords: [
      'user experience', 'customer feedback', 'accessibility', 'retention', 'nps',
      'churn', 'interviewed users', 'customer-facing', 'friction points', 'intuitive',
      'user satisfaction', 'usability testing',
    ],
    verbs: ['advocated', 'interviewed', 'solved', 'unlocked', 'enhanced', 'redesigned'],
    positive_signals: [
      'Interviewed 15 enterprise clients to identify top workflow frustrations, leading UI redesign',
      'Reduced customer onboarding drop-off by 28% through interactive in-app guidance',
      'Audited WCAG 2.1 AA accessibility guidelines, achieving zero screen-reader compliance violations',
    ],
    negative_patterns: [
      'Pure internal plumbing with zero mention of who uses the product or business outcome',
      'Focusing exclusively on code aesthetics rather than customer utility',
    ],
    remedy_template:
      'Connect technical implementations directly to user satisfaction, customer retention, or solved customer pain points.',
  },
  {
    name: 'Comfort with Ambiguity & Adaptability',
    category: 'Adaptability',
    keywords: [
      'pivoted', 'unstructured', 'ambiguous', 'greenfield', 'self-taught', 'adapted',
      'learned quickly', 'experimented', 'zeroth-principles', 'evolving requirements',
      'rapid ramp-up', 'new domain',
    ],
    verbs: ['adapted', 'pivoted', 'navigated', 'discovered', 'uncovered', 'transitioned'],
    positive_signals: [
      'Navigated greenfield problem space with no prior documentation, delivering prototype in 2 weeks',
      'Quickly adapted stack from Python to Go to satisfy real-time concurrency demands',
      'Successfully delivered project despite mid-sprint requirement shifts and market pivots',
    ],
    negative_patterns: [
      'Rigidly adhering to outdated requirements when user signals changed',
      'Requiring complete specification documents before starting any exploratory work',
    ],
    remedy_template:
      'State instances where you took ownership of ambiguous, uncharted requirements and charted a structured path forward.',
  },
  {
    name: 'Transparent Async Documentation',
    category: 'Communication',
    keywords: [
      'documented', 'rfc', 'architecture decision records', 'wiki', 'handbook',
      'written proposals', 'knowledge sharing', 'runbooks', 'playbooks', 'guidelines',
      'readme', 'technical writing',
    ],
    verbs: ['authored', 'documented', 'standardized', 'published', 'drafted', 'synthesized'],
    positive_signals: [
      'Authored 12 comprehensive Architecture Decision Records (ADRs) to document system trade-offs',
      'Created standardized onboarding playbook cutting new engineer ramp-up time from 3 weeks to 4 days',
      'Wrote comprehensive API specifications with OpenAPI/Swagger and automated contract testing',
    ],
    negative_patterns: [
      'Verbal-only tribal knowledge with missing documentation evidence',
      'Unmaintainable systems lacking runbooks or operational documentation',
    ],
    remedy_template:
      'Highlight technical specs, team runbooks, design proposals (RFCs), and documentation you authored for the team.',
  },
  {
    name: 'Frugality & Resource Optimization',
    category: 'Efficiency',
    keywords: [
      'reduced costs', 'cloud spend', 'optimized resources', 'frugal', 'streamlined',
      'cut compute', 'downgraded tier', 'prevented overhead', 'lean budget',
      'cost-effective', 'cache optimization',
    ],
    verbs: ['optimized', 'reduced', 'streamlined', 'consolidated', 'curbed', 'slashed'],
    positive_signals: [
      'Reduced monthly AWS infrastructure bill by $18,000 via auto-scaling and spot instances',
      'Consolidated redundant Redis clusters, lowering monthly database spend by 35%',
      'Eliminated unused third-party SaaS subscriptions by developing lightweight in-house automation',
    ],
    negative_patterns: [
      'Over-engineering simple requirements with expensive infrastructure',
      'No awareness of operational running costs or compute footprints',
    ],
    remedy_template:
      'Quantify the dollar savings, cloud compute reductions, or resource efficiencies achieved by your architectural decisions.',
  },
];

export interface ReframingRule {
  pattern: RegExp;
  cultural_category: string;
  original_example: string;
  suggested_reframing: string;
  explanation: string;
}

export const CULTURAL_REFRAMINGS_DATASET: ReframingRule[] = [
  {
    pattern: /(helped|assisted|supported|was responsible for)\b/i,
    cultural_category: 'Extreme Ownership',
    original_example: 'Assisted senior engineer with building the authentication microservice.',
    suggested_reframing:
      'Co-engineered the OAuth2 authentication microservice, owning JWT token validation and secure refresh endpoints.',
    explanation:
      'Shifts passive support wording to active co-engineering with concrete domain ownership.',
  },
  {
    pattern: /(worked on|handled|did)\b/i,
    cultural_category: 'Bias for Action',
    original_example: 'Worked on bug fixes and performance improvements.',
    suggested_reframing:
      'Resolved 28 high-priority production bugs across sprint, accelerating release velocity by 25%.',
    explanation:
      'Replaces vague verbs with quantifiable output and positive velocity impact.',
  },
  {
    pattern: /(used python to create|wrote scripts in)\b/i,
    cultural_category: 'Deep Dive & Rigor',
    original_example: 'Used Python to create data processing scripts.',
    suggested_reframing:
      'Architected automated Python ETL pipeline processing 500k daily records with automated data schema validation.',
    explanation:
      'Demonstrates scale, data integrity awareness, and professional architecture over amateur scripting.',
  },
  {
    pattern: /(responsible for meetings|attended meetings)\b/i,
    cultural_category: 'Collaboration & Influence',
    original_example: 'Responsible for attending sprint meetings and standups.',
    suggested_reframing:
      'Facilitated bi-weekly sprint planning and retrospectives, aligning product priorities across 6 engineers.',
    explanation:
      'Shows proactive leadership and team orchestration rather than passive attendance.',
  },
  {
    pattern: /(made a project|developed website)\b/i,
    cultural_category: 'Customer Obsession',
    original_example: 'Developed e-commerce website for final year project.',
    suggested_reframing:
      'Built full-stack e-commerce platform incorporating real-time Stripe checkout, achieving <1.2s page load and responsive mobile accessibility.',
    explanation:
      'Frames project through end-user experience, payment reliability, and performance benchmarks.',
  },
];
