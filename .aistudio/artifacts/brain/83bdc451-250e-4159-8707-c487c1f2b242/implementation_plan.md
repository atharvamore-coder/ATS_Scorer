# ATS Resume Scorer — Advanced Optimization & Offline Review Suite

Comprehensive enhancement to the ATS Resume Scorer featuring an in-browser real-time side-by-side editor with dynamic recalculation, explainable scoring breakdown, dedicated Fresher/Internship mode with Indian resume conventions, multi-job comparison matrix, skill-gap learning roadmaps, and offline downloadable comprehensive PDF reports.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the planning clarification:
> - **Download Format**: Comprehensive PDF report only — structured multi-page document with score breakdowns, line-by-line evidence, prioritized fixes, and an offline action checklist.
> - **Editor Interface**: Side-by-side split screen with resume editing on the left and live score telemetry / 1-click suggestions on the right.
> - **Fresher & Regional Support**: Dedicated toggle for Fresher/Internship mode with Indian academic conventions (10-point CGPA, marks percentages, college societies/fests, semester project evaluation, and expected graduation timelines).

---

## 1. Overview & Core Concept

### What It Does
Empowers job seekers, fresh graduates, and career changers to optimize their resumes with transparent, explainable scoring. Instead of a black-box number, users receive exact resume text matches, job description requirement correlations, skill-bridge workarounds (e.g., substituting PowerBI for Tableau), a dynamic real-time editor where score bars adjust on keystroke, and a multi-job comparison matrix to target several roles simultaneously.

### Target Audience & Persona
- **Fresh Engineering & Degree Graduates (India & Global)**: Seeking internships or entry-level positions where academic projects, hackathons, and coursework serve as primary skill evidence without multi-year experience penalties.
- **Mid-Career Professionals**: Tailoring resumes across multiple competitive job descriptions with tight keyword alignment.
- **Mentors & Career Counselors**: Reviewing comprehensive offline PDF diagnostic reports to provide targeted feedback.

### Key Value
Transforms resume preparation from a guessing game into an interactive, gamified optimization workflow with transparent algorithmic explanations and copy-paste-ready improvements.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Intake & Mode Selection**:
   - The user selects **Standard Mode** (experienced) or **Fresher / Internship Mode** (Indian academic standards, CGPA, college projects).
   - Uploads a PDF/DOCX or pastes resume text, and adds one or multiple target job descriptions.
2. **Analysis & Explainable Dashboard**:
   - Displays the 5-dimension score breakdown with deep explainability cards linking **Exact Resume Line** $\rightarrow$ **Target Requirement** $\rightarrow$ **Point Impact** $\rightarrow$ **Copy-Paste Correction**.
3. **Interactive Side-by-Side Optimizer**:
   - Split-pane layout: editable markdown/plain text on the left, live score gauges and copy-paste recommendations on the right.
   - Clicking *"Apply Suggestion"* immediately patches the resume text and animates the score delta.
4. **Skill-Gap Learning Roadmap & Workarounds**:
   - Highlights missing requirements and provides immediate workarounds (e.g. demonstrating equivalent tools).
   - Generates a 4-phase learning progression (Fundamentals $\rightarrow$ Practice Exercise $\rightarrow$ Portfolio Project $\rightarrow$ Verified Free Learning Resources).
5. **Multi-Job Comparison Dashboard**:
   - Matrix comparing one resume across up to 3 target roles, highlighting shared universal requirements vs. niche gaps.
6. **Comprehensive Offline PDF Export**:
   - One-click generation of a multi-page, executive-grade PDF diagnostic report with categorized scores, evidence tables, and prioritized action plans.

### Visual Identity & Theme
- **Canvas & Neutrals**: Clean professional background (`#F8FAFC` slate canvas) with crisp white cards (`#FFFFFF`) and hairline slate borders (`#E2E8F0`).
- **Accent & Primary**: Indigo (`#4F46E5`) for primary brand actions, emerald (`#10B981`) for passing scores, amber (`#F59E0B`) for warnings/workarounds, and rose (`#EF4444`) for critical deficits.
- **Typography**: Plus Jakarta Sans for headers and navigation, DM Sans for high-density scannability, and tabular monospace (`font-mono tabular-nums`) for numeric metrics and code comparisons.
- **Zero-Pill Restraint**: Metadata rendered with clean typographical separators (`·`, `/`); interactive filter controls styled as clean segmented buttons.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Client-Side Real-Time Scoring Engine vs. Server Latency
- **Chosen Approach**: Execute all scoring, regex parsing, n-gram matching, and explainability calculations in a reactive client-side TypeScript pipeline with debounced recalculation (300ms).
- **Why**: Allows instant feedback inside the split-screen editor without network latency or server rate limits, preserving 100% user privacy.
- **Alternatives Considered**: Sending every keystroke to a server LLM endpoint would introduce 1.5s–3s delays, breaking the gamified real-time experience.

### 2. Dedicated Fresher & India-Specific Rule Set
- **Chosen Approach**: A first-class mode toggle that swaps the scoring weights:
  - Eliminates the penalty for missing formal work history if academic projects, internships, hackathons, or tech club roles are present.
  - Recognizes Indian grading metrics: `CGPA: 8.4/10`, `82.5% Aggregate`, degree nomenclatures (`B.Tech`, `B.E.`, `B.Sc`, `BCA`, `MCA`), and expected graduation years.
- **Why**: Over 80% of student applicants are rejected by generic ATS calculators that penalize resumes lacking 3+ years of corporate experience.

### 3. Multi-Job Comparison Synthesis
- **Chosen Approach**: A multi-tab comparison engine parsing up to 3 job descriptions concurrently, extracting the Venn diagram intersection of shared core competencies and role-specific outliers.
- **Why**: Helps users build a single, resilient "master resume" that qualifies for multiple related openings.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ATS Resume Scorer                             │
│                                                                        │
│   ┌────────────────────┐     ┌─────────────────────────────────────┐   │
│   │   Navigation Bar   │ ──> │ Mode Switch: Fresher / Standard     │   │
│   └────────────────────┘     └─────────────────────────────────────┘   │
│             │                                                          │
│             ▼                                                          │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Primary Workspace Views                    │   │
│   │                                                                │   │
│   │  [ Scorer View ]  [ Real-Time Editor ]  [ Multi-Job Matrix ]   │   │
│   │  [ Roadmaps ]     [ History Storage ]   [ Resources & Tips ]   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│             │                                   │                      │
│             ▼                                   ▼                      │
│   ┌────────────────────────────┐     ┌─────────────────────────────┐   │
│   │ Client-Side Scoring Engine │     │     PDF Reporting Engine    │   │
│   │                            │     │                             │   │
│   │ • 5-Dimension Scorer       │     │ • jsPDF Document Builder    │   │
│   │ • Skill Bridge Engine      │     │ • Evidence & Action Plan    │   │
│   │ • Explainable Diff Engine  │     │ • Category Score Badges     │   │
│   │ • India/Fresher Normalizer │     │ • Offline Diagnostic Sheet  │   │
│   └────────────────────────────┘     └─────────────────────────────┘   │
│             │                                   │                      │
│             ▼                                   ▼                      │
│   ┌────────────────────────────┐     ┌─────────────────────────────┐   │
│   │      Browser Storage       │     │ Optional Firebase / Cloud   │   │
│   │  (localStorage Persistent) │     │ (Firestore + Google Auth)   │   │
│   └────────────────────────────┘     └─────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Stores

1. **`ScoringMode`**: `'standard' | 'fresher'`
2. **`ExplainableIssue`**:
   - `resume_snippet`: Original text from resume
   - `job_requirement`: Correlating job requirement
   - `why_it_matters`: Strategic ATS impact
   - `score_impact`: Numeric delta (e.g. `+4 pts`)
   - `suggested_correction`: Copy-paste ready improvement
3. **`SkillBridge`**:
   - `missing_skill`: Required skill
   - `adjacent_skill`: Owned skill
   - `workaround_strategy`: Framing advice
   - `suggested_bullet`: Ready-to-use resume line
4. **`LearningRoadmap`**:
   - `skill`: Missing technology/skill
   - `milestones`: Array of `{ phase: string, title: string, description: string, free_resource_url?: string }`
5. **`MultiJobComparison`**:
   - `jobs`: Array of `{ title: string, company: string, raw_text: string }`
   - `shared_skills`: Skills common across 2+ jobs
   - `unique_skills`: Role-specific keywords
   - `master_recommendations`: High-leverage changes improving all matches

---

## 5. Execution Steps

1. **Step 1: Core Scoring & Explainability Engine Updates**
   - Enhance `src/services/scorer.ts` to include the `Fresher/Internship` weighting logic, Indian CGPA/degree pattern recognizers, and the `ExplainableIssue` generator.
   - Build `src/services/skillBridge.ts` for skill adjacency matching and learning roadmaps.
2. **Step 2: Real-Time Side-by-Side Editor (`src/views/EditorView.tsx`)**
   - Create split-screen interface with live debounced scoring, diff highlights, and 1-click *"Apply Fix"* buttons.
3. **Step 3: Multi-Job Comparison Dashboard (`src/views/MultiJobView.tsx`)**
   - Create multi-JD upload interface with intersection analysis, Venn breakdown, and universal recommendations.
4. **Step 4: Skill-Gap Learning Roadmap Component**
   - Create interactive roadmap cards with practice tasks, project ideas, and curated learning links.
5. **Step 5: Comprehensive PDF Report Generator (`src/services/pdfExport.ts`)**
   - Upgrade PDF export into a detailed multi-page diagnostic document with executive summary, category scores, explainable evidence tables, and a print-ready offline action checklist.
6. **Step 6: Verification & Final Polish**
   - Compile applet with `compile_applet`, verify responsive desktop layouts, and ensure zero lint errors.
