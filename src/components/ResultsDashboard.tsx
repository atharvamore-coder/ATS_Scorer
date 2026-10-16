import React, { useState } from 'react';
import { AnalysisResponse, ScoringMode } from '../types/ats';
import { ScoreDisplay } from './ScoreDisplay';
import { exportAnalysisPDF } from '../services/pdfExport';
import {
  Download,
  CheckCircle,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Sparkles,
  Lightbulb,
  Zap,
  GraduationCap,
  Copy,
  Check,
  Compass,
  Trash2,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  analysis: AnalysisResponse;
  filename: string;
  onReset?: () => void;
  onOpenEditor?: () => void;
  onOpenRoadmaps?: () => void;
  onOpenMultiJob?: () => void;
  onOpenCulture?: () => void;
  onToggleMode?: (newMode: ScoringMode) => void;
}

export const ResultsDashboard: React.FC<Props> = ({
  analysis,
  filename,
  onReset,
  onOpenEditor,
  onOpenRoadmaps,
  onOpenMultiJob,
  onOpenCulture,
  onToggleMode,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'moderate' | 'low'>('all');
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [expandedSkills, setExpandedSkills] = useState<{ validated: boolean; unvalidated: boolean }>({
    validated: true,
    unvalidated: true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleIssue = (index: number) => {
    setExpandedIssues((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPDF = () => {
    exportAnalysisPDF(analysis, filename);
  };

  const feedbackList = analysis.detailed_feedback || [];
  const filteredFeedback = feedbackList.filter((item) => {
    if (activeTab === 'all') return true;
    const sev = (item.severity_level || '').toLowerCase();
    if (activeTab === 'critical') return sev === 'critical' || sev === 'high';
    if (activeTab === 'moderate') return sev === 'moderate' || sev === 'medium';
    if (activeTab === 'low') return sev === 'low';
    return true;
  });

  const skillDetails = analysis.skill_validation_details;
  const jdMatch = analysis.jd_comparison || analysis.jd_match_analysis;
  const academic = analysis.academic_details;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {analysis.mode === 'fresher' ? 'Fresher & Indian Standards Mode' : 'Standard Experience Mode'}
            </span>
            {onToggleMode && (
              <button
                onClick={() => onToggleMode(analysis.mode === 'fresher' ? 'standard' : 'fresher')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Switch to {analysis.mode === 'fresher' ? 'Standard' : 'Fresher'}
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            {filename}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Live Optimizer
            </button>
          )}

          {onOpenMultiJob && (
            <button
              onClick={onOpenMultiJob}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition"
            >
              <Target className="w-4 h-4 text-purple-500" />
              Multi-Job Matrix
            </button>
          )}

          {onOpenRoadmaps && (
            <button
              onClick={onOpenRoadmaps}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              Skill Roadmaps
            </button>
          )}

          {onOpenCulture && (
            <button
              onClick={onOpenCulture}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              Culture & Work-Life Balance
            </button>
          )}

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Download Comprehensive PDF
          </button>

          {onReset && (
            <button
              onClick={onReset}
              title="Delete current analysis results and return to input screen"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Analysis</span>
            </button>
          )}
        </div>
      </div>

      {/* Indian Academic & Fresher Signals Card (if active or detected) */}
      {analysis.mode === 'fresher' && academic && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-950 flex items-center gap-2 text-base">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Fresher & Indian Academic Credentials Recognized</span>
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md">
              Zero Multi-Year Penalty Applied
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-gray-500 block">CGPA / Marks</span>
              <span className="font-bold text-blue-900 text-sm">
                {academic.cgpa ? `${academic.cgpa} / 10` : academic.percentage || 'Recorded'}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-gray-500 block">Institution Tier</span>
              <span className="font-bold text-blue-900 text-sm">
                {academic.institution_type || 'Accredited'}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-gray-500 block">Hackathons</span>
              <span className="font-bold text-blue-900 text-sm">
                {academic.has_hackathons ? '✓ Participated' : 'None Detected'}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <span className="text-gray-500 block">Technical Societies</span>
              <span className="font-bold text-blue-900 text-sm">
                {academic.has_college_clubs ? '✓ Active Member' : 'None Detected'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Score + 5 Breakdown Bars */}
      <ScoreDisplay analysis={analysis} />

      {/* Strengths & Critical Issues Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>💪 Strengths</span>
          </h3>
          {analysis.strengths && analysis.strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {analysis.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-gray-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100/50"
                >
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Keep improving your resume to unlock strengths!</p>
          )}
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <span>🚨 Critical Issues</span>
          </h3>
          {analysis.critical_issues && analysis.critical_issues.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                These issues should be addressed first for better ATS performance.
              </p>
              <ul className="space-y-2">
                {analysis.critical_issues.map((issue, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-gray-800 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100"
                  >
                    <span className="text-rose-600 font-bold mt-0.5">✕</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-100">
              <p className="font-semibold">✅ No Critical Issues Found!</p>
              <p className="text-xs text-emerald-700 mt-1">
                Your resume doesn't have any severe blockers. Nice work!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Explainable Scoring & Copy-Paste Ready Corrections */}
      {analysis.explainable_issues && analysis.explainable_issues.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Explainable ATS Scoring & Copy-Paste Corrections</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Transparent line-by-line breakdown correlating your exact text with target job requirements.
              </p>
            </div>
            {onOpenEditor && (
              <button
                onClick={onOpenEditor}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                Apply in Live Editor →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.explainable_issues.map((ei) => (
              <div
                key={ei.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{ei.issue_title}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +{ei.score_impact} pts
                    </span>
                  </div>

                  {ei.exact_resume_text && ei.exact_resume_text !== '[Not found anywhere in resume]' && (
                    <div className="text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-700 block">Your Current Text:</span>
                      <span className="italic line-through">"{ei.exact_resume_text.slice(0, 90)}"</span>
                    </div>
                  )}

                  <div className="text-[11px] text-gray-600">
                    <span className="font-semibold text-gray-700 block">Requirement:</span>
                    {ei.job_requirement}
                  </div>

                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-700 block">Why It Matters:</span>
                    {ei.why_it_matters}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      Suggested Correction:
                    </span>
                    <button
                      onClick={() => handleCopy(ei.id, ei.suggested_correction)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      {copiedId === ei.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Fix</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs font-mono text-indigo-950">
                    "{ei.suggested_correction}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Bridge Workarounds */}
      {analysis.skill_workarounds && analysis.skill_workarounds.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Skill Bridge Workarounds</span>
              </h3>
              <p className="text-xs text-amber-800">
                You lack certain tools requested by the job description, but your adjacent skills can bridge the gap.
              </p>
            </div>
            {onOpenRoadmaps && (
              <button
                onClick={onOpenRoadmaps}
                className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
              >
                View Full Roadmaps →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.skill_workarounds.map((w, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                <div className="text-xs font-bold text-gray-900">
                  Target: <span className="text-rose-600">{w.missing_skill}</span> ↔ You Have:{' '}
                  <span className="text-emerald-700">{w.adjacent_skill}</span>
                </div>
                <p className="text-xs text-gray-600">{w.workaround_strategy}</p>
                <div className="p-2.5 bg-gray-50 rounded-lg text-xs font-mono text-gray-800">
                  "{w.suggested_bullet}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Validation Section */}
      {skillDetails && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span>Skill Validation & Evidence Check</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {skillDetails.validation_pct}% Validated
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-5">
            Verifies that your claimed skills are evidenced in your projects and work experience, not just listed as buzzwords.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-xs text-gray-500 font-medium">Total Skills</div>
              <div className="text-2xl font-bold text-gray-900 mt-0.5">{skillDetails.total}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
              <div className="text-xs text-emerald-700 font-medium">Validated</div>
              <div className="text-2xl font-bold text-emerald-700 mt-0.5">
                {skillDetails.validated_count}
              </div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-center border border-indigo-100">
              <div className="text-xs text-indigo-700 font-medium">Validation Rate</div>
              <div className="text-2xl font-bold text-indigo-700 mt-0.5">
                {skillDetails.validation_pct}%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {skillDetails.validated.length > 0 && (
              <div className="border border-emerald-200 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSkills((p) => ({ ...p, validated: !p.validated }))
                  }
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-50/70 text-emerald-900 font-semibold text-sm hover:bg-emerald-100/70 transition"
                >
                  <span>✅ Validated Skills ({skillDetails.validated.length})</span>
                  {expandedSkills.validated ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSkills.validated && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white">
                    {skillDetails.validated.map((v, i) => (
                      <div
                        key={i}
                        className="text-xs p-2 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="font-semibold text-gray-900">{v.skill}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          Demonstrated in: {v.projects.join(', ') || 'Experience'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {skillDetails.unvalidated.length > 0 && (
              <div className="border border-amber-200 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSkills((p) => ({ ...p, unvalidated: !p.unvalidated }))
                  }
                  className="w-full flex items-center justify-between p-3.5 bg-amber-50/70 text-amber-900 font-semibold text-sm hover:bg-amber-100/70 transition"
                >
                  <span>⚠️ Unvalidated Skills ({skillDetails.unvalidated.length})</span>
                  {expandedSkills.unvalidated ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSkills.unvalidated && (
                  <div className="p-4 bg-white">
                    <p className="text-xs text-amber-700 mb-2.5">
                      These skills are listed in your skills section but lack accompanying evidence in projects or experience:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillDetails.unvalidated.map((u, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-medium"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job Description Match */}
      {jdMatch && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>🎯 Job Description Match</span>
            </h3>
            <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {jdMatch.match_percentage}% Overall Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Keyword Overlap Match</span>
                  <span>{jdMatch.match_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${jdMatch.match_percentage}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  ✅ Matched Keywords ({jdMatch.matched_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {jdMatch.matched_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  ❌ Missing Target Keywords ({jdMatch.missing_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {jdMatch.missing_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-200 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {jdMatch.skills_gap && jdMatch.skills_gap.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    📊 Skills Gap to Address
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
                    {jdMatch.skills_gap.slice(0, 5).map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
