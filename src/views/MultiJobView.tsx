import React, { useState } from 'react';
import { JobPosting, MultiJobAnalysis } from '../types/ats';
import { analyzeMultiJobs } from '../services/multiJob';
import { Target, Layers, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Plus, Trash2 } from 'lucide-react';

interface Props {
  resumeText: string;
  onOpenEditorWithFeedback?: () => void;
}

const DEFAULT_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Data Analyst Intern',
    company: 'FinTech Dynamics',
    content: `Role: Data Analyst Intern
Responsibilities:
- Build and maintain interactive dashboards using Tableau and SQL.
- Write Python scripts to clean and aggregate transactional datasets.
- Collaborate with product managers to define tracking metrics and KPI reports.
Requirements: Python, SQL, Tableau, Pandas, Excel, Data Analysis, Git.`,
  },
  {
    id: 'job-2',
    title: 'Junior Business Intelligence Analyst',
    company: 'Global Retail Hub',
    content: `Role: Junior BI Analyst
Responsibilities:
- Perform data modeling and extract metrics from PostgreSQL databases.
- Develop PowerBI and Tableau data visualizations for executive stakeholders.
- Automate data pipeline reports with Python and scheduled cron tasks.
Requirements: SQL, PostgreSQL, PowerBI, Tableau, Python, Data Analytics, Communication.`,
  },
  {
    id: 'job-3',
    title: 'Product Analytics Intern',
    company: 'SaaS Stream',
    content: `Role: Product Analytics Intern
Responsibilities:
- Analyze user funnel conversion metrics and run A/B testing statistical analyses.
- Query cloud data warehouses using SQL and Python.
- Create automated weekly performance decks and monitor retention.
Requirements: Python, SQL, Statistics, Data Analysis, A/B Testing, Excel, Git.`,
  },
];

export const MultiJobView: React.FC<Props> = ({ resumeText, onOpenEditorWithFeedback }) => {
  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOBS);
  const [analysis, setAnalysis] = useState<MultiJobAnalysis>(() =>
    analyzeMultiJobs(resumeText, DEFAULT_JOBS)
  );

  const handleUpdateJob = (index: number, field: keyof JobPosting, value: string) => {
    const updated = [...jobs];
    updated[index] = { ...updated[index], [field]: value };
    setJobs(updated);
    setAnalysis(analyzeMultiJobs(resumeText, updated));
  };

  const handleAddJob = () => {
    if (jobs.length >= 4) return;
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: `Target Role #${jobs.length + 1}`,
      company: 'Target Company',
      content: 'Paste job description requirements here...',
    };
    const updated = [...jobs, newJob];
    setJobs(updated);
    setAnalysis(analyzeMultiJobs(resumeText, updated));
  };

  const handleDeleteJob = (id: string) => {
    if (jobs.length <= 1) return;
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    setAnalysis(analyzeMultiJobs(resumeText, updated));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Multi-Job Target Comparison Matrix</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Compare your resume across multiple job postings simultaneously to discover universal overlap vs. niche gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {jobs.length < 4 && (
            <button
              onClick={handleAddJob}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Add Target Job
            </button>
          )}
          {onOpenEditorWithFeedback && (
            <button
              onClick={onOpenEditorWithFeedback}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
            >
              <span>Open in Live Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Overview Match Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {analysis.jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">{job.company}</span>
                <span className="text-sm font-extrabold text-indigo-600">
                  {job.match_percentage}%
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-3 truncate">{job.title}</h3>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${job.match_percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>{job.matched_count} matched</span>
                <span>{job.missing_count} missing</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High Leverage Multi-Job Fixes */}
      {analysis.high_leverage_fixes.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-indigo-950">
              High-Leverage Multi-Job Fixes
            </h2>
          </div>
          <p className="text-xs text-indigo-900">
            These universal additions qualify your resume for multiple target positions simultaneously:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {analysis.high_leverage_fixes.map((fix, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-gray-900">{fix.recommendation}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {fix.potential_score_boost}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Benefits:{' '}
                  <span className="font-semibold text-gray-700">
                    {fix.benefiting_jobs.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universal Venn Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Universal Matched Skills */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Universal Core Strengths (Shared Across Roles)</span>
          </h3>
          <p className="text-xs text-gray-500">
            Skills present in your resume that meet the requirements of 2 or more target positions:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.universal_matched_skills.length > 0 ? (
              analysis.universal_matched_skills.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                >
                  ✓ {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No universal skills identified yet</span>
            )}
          </div>
        </div>

        {/* Universal Missing Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Universal Missing Competencies (Shared Gaps)</span>
          </h3>
          <p className="text-xs text-gray-500">
            Skills required by multiple postings that are currently absent from your resume:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.universal_missing_skills.length > 0 ? (
              analysis.universal_missing_skills.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-medium"
                >
                  ✕ {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-600 font-medium">All universal requirements are covered!</span>
            )}
          </div>
        </div>
      </div>

      {/* Editable Job Descriptions Accordion */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base">Target Job Descriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <div key={job.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => handleUpdateJob(idx, 'title', e.target.value)}
                  className="text-xs font-bold text-gray-900 bg-white border border-gray-200 px-2 py-1 rounded-md w-full mr-2"
                />
                {jobs.length > 1 && (
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                value={job.content}
                onChange={(e) => handleUpdateJob(idx, 'content', e.target.value)}
                rows={6}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {analysis.role_specific_gaps[job.title]?.length > 0 && (
                <div className="text-[11px] text-gray-500 border-t border-gray-200 pt-2">
                  <span className="font-semibold block text-gray-700">Role-Specific Gap:</span>
                  <span>{analysis.role_specific_gaps[job.title].join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
