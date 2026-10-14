import React, { useState, useRef } from 'react';
import { AnalysisResponse, ScoringMode } from '../types/ats';
import { calculateATSAnalysis } from '../services/scorer';
import { saveAnalysisToHistory } from '../services/storage';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../data/samples';
import {
  Upload,
  Briefcase,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Zap,
  Trash2,
} from 'lucide-react';

interface Props {
  initialResult?: AnalysisResponse | null;
  initialFilename?: string;
  initialResumeText?: string;
  initialJobDescription?: string;
  onOpenEditorWithData?: (resumeText: string, jdText: string, mode: ScoringMode) => void;
  onOpenRoadmaps?: () => void;
  onOpenMultiJob?: (resumeText: string) => void;
  onUpdateAnalysisState?: (resumeText: string, jdText: string, mode: ScoringMode, analysis: AnalysisResponse) => void;
  onClearAll?: () => void;
  onSetPdfUploaded?: (isPdf: boolean) => void;
}

export const ScorerView: React.FC<Props> = ({
  initialResult,
  initialFilename,
  initialResumeText,
  initialJobDescription,
  onOpenEditorWithData,
  onOpenRoadmaps,
  onOpenMultiJob,
  onUpdateAnalysisState,
  onClearAll,
  onSetPdfUploaded,
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [scoringMode, setScoringMode] = useState<ScoringMode>(
    initialResult?.mode || 'fresher'
  );
  const [resumeText, setResumeText] = useState<string>(
    initialResumeText || SAMPLE_RESUMES[0].content
  );
  const [jobDescription, setJobDescription] = useState<string>(
    initialJobDescription || SAMPLE_JOB_DESCRIPTIONS[0].content
  );
  const [fileName, setFileName] = useState<string>(
    initialFilename || 'aarav-sharma-fresher.pdf'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    initialResult || null
  );
  const [currentFileDisplay, setCurrentFileDisplay] = useState<string>(
    initialFilename || 'aarav-sharma-fresher.pdf'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteResume = () => {
    setResumeText('');
    setFileName('');
    setCurrentFileDisplay('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSetPdfUploaded?.(false);
  };

  const handleDeleteJD = () => {
    setJobDescription('');
  };

  const handleDeleteAll = () => {
    setResumeText('');
    setJobDescription('');
    setFileName('');
    setCurrentFileDisplay('');
    setAnalysisResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSetPdfUploaded?.(false);
    onClearAll?.();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setErrorMessage(null);
    setFileName(file.name);

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    onSetPdfUploaded?.(isPdf);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const cleaned = text
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        setResumeText(cleaned.length > 50 ? cleaned : text);
      }
    };
    reader.readAsText(file);
  };

  const loadSampleResume = (id: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === id);
    if (sample) {
      setResumeText(sample.content);
      setFileName(`${sample.id}-resume.pdf`);
      onSetPdfUploaded?.(true);
      setErrorMessage(null);
      if (id === 'fresher-india') {
        setScoringMode('fresher');
      }
    }
  };

  const loadSampleJD = () => {
    const sample = SAMPLE_JOB_DESCRIPTIONS[0];
    if (sample) {
      setJobDescription(sample.content);
    }
  };

  const handleAnalyze = () => {
    if (!resumeText || resumeText.trim().length < 40) {
      setErrorMessage('Please upload a resume or paste your resume content (at least 40 characters) first.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const result = calculateATSAnalysis(resumeText, jobDescription, scoringMode);
        setAnalysisResult(result);
        setCurrentFileDisplay(fileName);

        saveAnalysisToHistory(fileName, result, jobDescription.slice(0, 100));
        onUpdateAnalysisState?.(resumeText, jobDescription, scoringMode, result);
      } catch (err) {
        console.error('Analysis error', err);
        setErrorMessage('Failed to analyze resume. Please verify the content format.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);
  };

  const handleToggleMode = (newMode: ScoringMode) => {
    setScoringMode(newMode);
    if (analysisResult) {
      const updated = calculateATSAnalysis(resumeText, jobDescription, newMode);
      setAnalysisResult(updated);
      onUpdateAnalysisState?.(resumeText, jobDescription, newMode, updated);
    }
  };

  if (analysisResult) {
    return (
      <ResultsDashboard
        analysis={analysisResult}
        filename={currentFileDisplay}
        onReset={() => setAnalysisResult(null)}
        onOpenEditor={() => {
          if (onOpenEditorWithData) {
            onOpenEditorWithData(resumeText, jobDescription, scoringMode);
          }
        }}
        onOpenRoadmaps={onOpenRoadmaps}
        onOpenMultiJob={() => onOpenMultiJob?.(resumeText)}
        onToggleMode={handleToggleMode}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            🎯 ATS Resume Scorer
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Evaluate your resume against ATS algorithmic filters with explainable feedback and instant fixes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {(resumeText || jobDescription || fileName) && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition shadow-xs"
              title="Delete all inputs in ATS Scorer tab"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete / Reset</span>
            </button>
          )}

          {/* Scoring Mode Toggle */}
          <div className="p-1 bg-gray-100 rounded-xl inline-flex border border-gray-200">
            <button
              onClick={() => setScoringMode('standard')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                scoringMode === 'standard'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Standard Mode
            </button>
            <button
              onClick={() => setScoringMode('fresher')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                scoringMode === 'fresher'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Fresher / Indian Mode</span>
            </button>
          </div>
        </div>
      </div>

      {scoringMode === 'fresher' && (
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Fresher Mode Active:</strong> Eliminates penalties for lacking multi-year corporate tenure. Validates academic projects, coursework, hackathons, college clubs (GDSC/IEEE/CSI), and Indian CGPA/percentages.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Input Step 1 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <span className="font-bold text-gray-900 text-base">Step 1: Resume Input</span>

          <div className="flex items-center gap-2">
            {resumeText && (
              <button
                type="button"
                onClick={handleDeleteResume}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                title="Delete current resume file and text"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Resume</span>
              </button>
            )}

            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setInputMode('upload')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  inputMode === 'upload' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => {
                  setInputMode('paste');
                  onSetPdfUploaded?.(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  inputMode === 'paste' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
          <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Test Samples:
          </span>
          {SAMPLE_RESUMES.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSampleResume(s.id)}
              className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 font-medium rounded-lg border border-indigo-200 shadow-xs transition"
            >
              {s.role}
            </button>
          ))}
        </div>

        {inputMode === 'upload' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose a resume (PDF, DOCX, TXT)
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-8 text-center transition cursor-pointer bg-gray-50/50 relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {resumeText ? fileName : 'Click to browse or drag and drop your resume file'}
                </div>
                <div className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 5MB supported
                </div>
                {resumeText && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{fileName || 'File loaded'} ({resumeText.length} characters)</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDeleteResume();
                      }}
                      className="relative z-10 inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-semibold bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition"
                      title="Delete uploaded file"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete File</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Paste Resume Plain Text
              </label>
              {resumeText && (
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Resume Text</span>
                </button>
              )}
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the full text of your resume here (Summary, Experience, Education, Skills, Projects)..."
              rows={10}
              className="w-full rounded-xl border border-gray-300 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {resumeText.length} characters
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Job Description */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-gray-900 text-base">
              Step 2: Target Job Description (Optional)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {jobDescription && (
              <button
                type="button"
                onClick={handleDeleteJD}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 text-rose-700 hover:text-rose-900 font-semibold bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
                title="Delete job description"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete JD</span>
              </button>
            )}
            <button
              onClick={loadSampleJD}
              className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
            >
              Insert Sample JD
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Paste the job posting to calculate keyword match percentage, identify missing skills, and unlock explainable corrections.
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description here to check matching keywords and gap analysis..."
          rows={6}
          className="w-full rounded-xl border border-gray-300 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Analyze Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {(resumeText || jobDescription) && (
          <button
            type="button"
            onClick={handleDeleteAll}
            className="px-5 py-4 rounded-xl text-rose-700 font-bold text-sm bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center justify-center gap-2"
            title="Delete both resume and job description inputs"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete All Inputs</span>
          </button>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex-1 py-4 rounded-xl text-white font-bold text-base bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Resume Across 5 ATS Dimensions...</span>
            </>
          ) : (
            <>
              <span>🚀 Analyze Resume ({scoringMode === 'fresher' ? 'Fresher' : 'Standard'})</span>
            </>
          )}
        </button>

        {onOpenEditorWithData && (
          <button
            onClick={() => onOpenEditorWithData(resumeText, jobDescription, scoringMode)}
            className="px-6 py-4 rounded-xl text-indigo-700 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Open in Live Optimizer</span>
          </button>
        )}
      </div>
    </div>
  );
};
