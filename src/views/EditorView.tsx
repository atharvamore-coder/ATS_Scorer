import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResponse, ScoringMode } from '../types/ats';
import { calculateATSAnalysis } from '../services/scorer';
import { exportAnalysisPDF } from '../services/pdfExport';
import {
  Sparkles,
  Zap,
  Check,
  Copy,
  Download,
  RotateCcw,
  PlusCircle,
  Award,
  Layers,
  ArrowRight,
  AlertTriangle,
  X,
  Upload,
} from 'lucide-react';

interface Props {
  initialResumeText: string;
  initialJobDescription: string;
  initialMode: ScoringMode;
  isPdfUploaded?: boolean;
  filename?: string;
  onSaveToHistory?: (text: string, analysis: AnalysisResponse) => void;
  onSwitchToScorer?: () => void;
}

export const EditorView: React.FC<Props> = ({
  initialResumeText,
  initialJobDescription,
  initialMode,
  isPdfUploaded = false,
  filename,
  onSaveToHistory,
  onSwitchToScorer,
}) => {
  const [resumeText, setResumeText] = useState<string>(initialResumeText);
  const [jobDescription, setJobDescription] = useState<string>(initialJobDescription);
  const [mode, setMode] = useState<ScoringMode>(initialMode);
  const [analysis, setAnalysis] = useState<AnalysisResponse>(() =>
    calculateATSAnalysis(initialResumeText, initialJobDescription, initialMode)
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);
  const baselineScore = useRef<number>(analysis.ats_score);

  const isPdf = isPdfUploaded || (filename ? filename.toLowerCase().endsWith('.pdf') : false);
  const [showPdfNotification, setShowPdfNotification] = useState<boolean>(isPdf);
  const [showPdfToast, setShowPdfToast] = useState<boolean>(isPdf);

  useEffect(() => {
    if (isPdf) {
      setShowPdfNotification(true);
      setShowPdfToast(true);
      const timer = setTimeout(() => setShowPdfToast(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isPdf]);

  // Debounced real-time recalculation
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated = calculateATSAnalysis(resumeText, jobDescription, mode);
      setAnalysis(updated);
      if (onSaveToHistory) {
        onSaveToHistory(resumeText, updated);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [resumeText, jobDescription, mode]);

  const scoreDelta = Math.round((analysis.ats_score - baselineScore.current) * 10) / 10;

  // 1-Click Apply Suggestion
  const handleApplyCorrection = (originalSnippet?: string, replacement?: string) => {
    if (!replacement) return;

    if (originalSnippet && resumeText.includes(originalSnippet)) {
      setResumeText((prev) => prev.replace(originalSnippet, replacement));
      setAppliedNotice(`Applied fix: "${replacement.slice(0, 40)}..."`);
    } else {
      // Append to resume under appropriate section or at end
      setResumeText((prev) => prev + '\n• ' + replacement);
      setAppliedNotice(`Appended suggestion to resume`);
    }

    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertSnippet = (snippet: string) => {
    setResumeText((prev) => prev + '\n' + snippet);
    setAppliedNotice('Inserted snippet into resume text.');
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  const handleExportPDF = () => {
    exportAnalysisPDF(analysis, 'optimized_resume.pdf');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-fadeIn">
      {/* Toast Notification for PDF upload */}
      {showPdfToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white border-2 border-amber-400 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-slideIn"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">Notice</span>
              <h4 className="text-sm font-bold text-gray-900">
                Upload text to use Live Editor
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              A PDF resume is currently loaded. Upload text to tweak bullet points with instant ATS score feedback.
            </p>
            {onSwitchToScorer && (
              <button
                onClick={onSwitchToScorer}
                className="mt-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>Go to ATS Scorer to paste/upload text</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPdfToast(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            title="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Starting-of-tab Notification Banner */}
      {showPdfNotification && (
        <div
          role="alert"
          className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-extrabold tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  Action Required
                </span>
                <h2 className="text-base font-bold text-amber-950">
                  Upload text to use Live Editor
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 mt-1">
                You have uploaded a PDF ({filename || 'resume.pdf'}). The Live Editor requires editable text to optimize bullet points and update your ATS score dynamically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onSwitchToScorer && (
              <button
                onClick={onSwitchToScorer}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-300 rounded-xl transition shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Text in Scorer</span>
              </button>
            )}
            <button
              onClick={() => setShowPdfNotification(false)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-xl transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              In-Browser Real-Time Resume Optimizer
            </h1>
            <p className="text-xs text-gray-500">
              Edit bullet points on the left — watch the ATS score recalculate dynamically on the right.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scoring Mode Toggle */}
          <div className="flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'standard' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-gray-600'
              }`}
            >
              Standard Mode
            </button>
            <button
              onClick={() => setMode('fresher')}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'fresher' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-gray-600'
              }`}
            >
              Fresher / Indian Mode
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Live Resume Editor (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[780px] overflow-hidden">
          {/* Editor Header */}
          <div className="p-3.5 bg-gray-50/90 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-gray-700 flex items-center gap-1.5">
              <span>📝</span> Resume Document Editor
            </span>

            {/* Quick Insertion Helpers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  insertSnippet(
                    '• Led [initiative], achieving [X]% improvement in [metric] by implementing [technology/technique].'
                  )
                }
                className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 transition"
                title="Insert Google XYZ Impact Formula"
              >
                + XYZ Metric
              </button>
              {mode === 'fresher' && (
                <button
                  onClick={() => insertSnippet('ACADEMICS: B.Tech in Computer Science | CGPA: 8.5/10 (Dean\'s Honor)')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-md border border-indigo-200 transition"
                >
                  + CGPA
                </button>
              )}
              <button
                onClick={() =>
                  insertSnippet(
                    'TECHNICAL SKILLS\nLanguages: Python, JavaScript, TypeScript, SQL\nFrameworks: React, FastAPI, Node.js\nTools: Docker, Git, AWS'
                  )
                }
                className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 transition"
              >
                + Skills
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 p-4 relative">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste or edit your resume text directly here..."
              className="w-full h-full resize-none font-mono text-xs sm:text-sm leading-relaxed text-gray-800 focus:outline-none p-2 border-0"
              spellCheck={false}
            />
          </div>

          {/* Editor Footer Stats */}
          <div className="p-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>
              {resumeText.split(/\s+/).filter(Boolean).length} words · {resumeText.length} characters
            </span>
            <span>Target JD: {jobDescription ? 'Loaded' : 'Optional (Add on Scorer)'}</span>
          </div>
        </div>

        {/* Right Pane: Live Telemetry & 1-Click Suggestions (5 columns) */}
        <div className="lg:col-span-5 space-y-4 h-[780px] overflow-y-auto pr-1">
          {/* Live Score Telemetry Gauge Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Live ATS Telemetry
              </span>
              {scoreDelta !== 0 && (
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    scoreDelta > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight">
                {analysis.ats_score.toFixed(0)}
                <span className="text-base font-semibold text-gray-400">/100</span>
              </div>
              <div className="flex-1 text-xs text-gray-600 border-l border-gray-200 pl-3">
                <span className="font-semibold text-gray-800 block">
                  {analysis.interpretation.split('.')[0]}
                </span>
                <span className="text-gray-500 mt-0.5 block">
                  {mode === 'fresher' ? 'Fresher mode active: no experience penalty' : 'Standard experience mode'}
                </span>
              </div>
            </div>

            {/* Component micro-progress bars */}
            <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-gray-100">
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Format</div>
                <div className="font-bold text-xs text-gray-800">
                  {analysis.component_scores.formatting.toFixed(0)}/20
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Keywords</div>
                <div className="font-bold text-xs text-gray-800">
                  {analysis.component_scores.keywords.toFixed(0)}/25
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Content</div>
                <div className="font-bold text-xs text-gray-800">
                  {analysis.component_scores.content.toFixed(0)}/25
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Validation</div>
                <div className="font-bold text-xs text-gray-800">
                  {analysis.component_scores.skill_validation.toFixed(0)}/15
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">ATS Safe</div>
                <div className="font-bold text-xs text-gray-800">
                  {analysis.component_scores.ats_compatibility.toFixed(0)}/15
                </div>
              </div>
            </div>
          </div>

          {/* Skill Bridge Workarounds */}
          {analysis.skill_workarounds && analysis.skill_workarounds.length > 0 && (
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Skill Bridge Workarounds</span>
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {analysis.skill_workarounds.length} Available
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                You lack certain target keywords, but have adjacent skills. Click below to inject an adaptable bullet point:
              </p>

              <div className="space-y-2">
                {analysis.skill_workarounds.map((w, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-amber-200/60 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800">
                        {w.missing_skill} ↔ {w.adjacent_skill}
                      </span>
                      <button
                        onClick={() => insertSnippet(`• ${w.suggested_bullet}`)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md transition"
                      >
                        + Insert Bullet
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-600 italic">"{w.suggested_bullet}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1-Click Explainable Corrections List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                1-Click Copy-Paste Fixes ({analysis.explainable_issues.length})
              </span>
              <span className="text-[11px] text-gray-400">Click Apply to patch directly</span>
            </div>

            {analysis.explainable_issues.map((issue) => {
              const isPresentInDoc =
                issue.original_text_to_replace &&
                resumeText.includes(issue.original_text_to_replace);

              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-2xs space-y-2 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200 mr-1.5">
                        {issue.severity}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {issue.issue_title}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                      +{issue.score_impact} pts
                    </span>
                  </div>

                  {issue.exact_resume_text && issue.exact_resume_text !== '[Not found anywhere in resume]' && (
                    <div className="text-[11px] p-2 rounded-md bg-gray-50 border border-gray-100 text-gray-600 line-through">
                      "{issue.exact_resume_text.slice(0, 90)}"
                    </div>
                  )}

                  <div className="text-[11px] p-2.5 rounded-md bg-indigo-50/70 border border-indigo-100 text-indigo-950">
                    <span className="font-semibold block text-[10px] uppercase text-indigo-700 mb-0.5">
                      Suggested Replacement:
                    </span>
                    "{issue.suggested_correction}"
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(issue.id, issue.suggested_correction)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-md transition"
                    >
                      {copiedId === issue.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleApplyCorrection(
                          issue.original_text_to_replace,
                          issue.suggested_correction
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-2xs transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isPresentInDoc ? 'Apply Fix' : 'Append Fix'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
