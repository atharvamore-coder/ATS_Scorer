import React from 'react';
import { Target, Shield, CheckCircle2, Award, ArrowRight, Zap, Sparkles, HeartHandshake, Compass } from 'lucide-react';

interface Props {
  onStart: () => void;
  onOpenEditor?: () => void;
  onOpenMultiJob?: () => void;
  onOpenRoadmaps?: () => void;
  onOpenCulture?: () => void;
  onSelectSample?: (sampleId: string) => void;
}

export const LandingView: React.FC<Props> = ({
  onStart,
  onOpenEditor,
  onOpenMultiJob,
  onOpenRoadmaps,
  onOpenCulture,
}) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center text-white bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive ATS Optimization & Diagnostic Suite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          🎯 ATS Resume Scorer
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl mx-auto mb-3">
          Explainable ATS Scoring, Live Real-Time Editor & Fresher Support
        </h2>
        <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto mb-8">
          Get transparent feedback linking your exact resume lines to job requirements, test edits in the live side-by-side optimizer, compare against multiple roles, and download a 3-page diagnostic PDF.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-md transition transform hover:-translate-y-0.5"
          >
            🚀 Analyze Resume
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-500/50 hover:bg-indigo-500/70 border border-white/20 text-white shadow-md transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Live Split-Screen Editor
            </button>
          )}

          {onOpenMultiJob && (
            <button
              onClick={onOpenMultiJob}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-purple-500/50 hover:bg-purple-500/70 border border-white/20 text-white shadow-md transition transform hover:-translate-y-0.5"
            >
              <Target className="w-4 h-4 text-purple-200" />
              Multi-Job Compare
            </button>
          )}

          {onOpenCulture && (
            <button
              onClick={onOpenCulture}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-rose-500/50 hover:bg-rose-500/70 border border-white/20 text-white shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-rose-200" />
              Company Culture & Work-Life Balance
            </button>
          )}
        </div>
      </div>

      {/* Key Features Overview */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">✨ Key Features</h2>
          <p className="text-sm text-gray-500 mt-1">
            Engineered to simulate real-world Applicant Tracking System parsers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Comprehensive Scoring</h3>
            <p className="text-xs text-gray-500 mb-3">Get detailed scores across 5 key dimensions:</p>
            <ul className="space-y-1.5 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Formatting (20%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Keywords & Skills (25%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Content Quality (25%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Skill Validation (15%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                ATS Compatibility (15%)
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">🔍 Skill Validation</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Verify that your claimed skills are substantiated with real project bullets and work history.
            </p>
            <div className="p-3 bg-purple-50 rounded-xl text-xs font-semibold text-purple-800">
              No more empty buzzword claims! We check if skills are demonstrated in projects.
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">🔒 Privacy First</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              All resume analysis runs locally in your environment. Your resume data remains strictly confidential and secure.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-800">
              100% Private & Secure — zero third-party tracking.
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100/70 rounded-3xl p-8 border border-gray-200/80">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">🚀 How It Works</h2>
          <p className="text-sm text-gray-500 mt-1">Three simple steps to pass ATS filters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-xs border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Upload Your Resume</h4>
            <p className="text-xs text-gray-600">
              Upload PDF or DOCX file, or paste your resume text directly.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-xs border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-gray-900 mb-1">AI ATS Analysis</h4>
            <p className="text-xs text-gray-600">
              Models evaluate formatting, keywords, quantifiable achievements, and validation.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-xs border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Actionable Feedback</h4>
            <p className="text-xs text-gray-600">
              Get detailed suggestions, action items, and export a polished PDF report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
