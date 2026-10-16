import React, { useState, useEffect } from 'react';
import { HistoryItem, AnalysisResponse } from '../types/ats';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../services/storage';
import { exportAnalysisPDF } from '../services/pdfExport';
import {
  History,
  FileText,
  Trash2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface Props {
  onSelectAnalysis: (analysis: AnalysisResponse, filename: string) => void;
  onNavigateToScorer: () => void;
}

export const HistoryView: React.FC<Props> = ({ onSelectAnalysis, onNavigateToScorer }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = () => {
    setHistoryItems(getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your analysis history?')) {
      clearAllHistory();
      loadHistory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-600" />
            <span>📊 Analysis History</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Past analyses saved against your account and local workspace.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold px-3 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
          >
            Clear History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">No analyses yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Run an ATS scoring on the ATS Scorer page first. Your analyses will appear here.
            </p>
          </div>
          <button
            onClick={onNavigateToScorer}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
          >
            🎯 Go to ATS Scorer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Saved Analyses: {historyItems.length}
          </div>

          {historyItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const res = item.analysis_result;
            const comps = res.component_scores || {
              formatting: 0,
              keywords: 0,
              content: 0,
              skill_validation: 0,
              ats_compatibility: 0,
            };
            const score = item.ats_score;
            const badgeColor =
              score >= 80
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : score >= 60
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200';

            const formattedDate = new Date(item.created_at).toLocaleString();

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                        {item.filename}
                      </h3>
                      <div className="text-xs text-gray-500 mt-0.5">{formattedDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-extrabold px-3 py-1 rounded-full border ${badgeColor}`}
                    >
                      {score.toFixed(0)} / 100
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnalysis(res, item.filename);
                      }}
                      title="Open full report"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportAnalysisPDF(res, item.filename);
                      }}
                      title="Download PDF"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete"
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-gray-50/80 border-t border-gray-100 text-sm space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500">Formatting</div>
                        <div className="text-base font-bold text-gray-800">
                          {comps.formatting.toFixed(0)} / 20
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500">Keywords</div>
                        <div className="text-base font-bold text-gray-800">
                          {comps.keywords.toFixed(0)} / 25
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500">Content</div>
                        <div className="text-base font-bold text-gray-800">
                          {comps.content.toFixed(0)} / 25
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500">Validation</div>
                        <div className="text-base font-bold text-gray-800">
                          {comps.skill_validation.toFixed(0)} / 15
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500">Compatibility</div>
                        <div className="text-base font-bold text-gray-800">
                          {comps.ats_compatibility.toFixed(0)} / 15
                        </div>
                      </div>
                    </div>

                    {res.jd_comparison && (
                      <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-700">
                        <strong>Target JD Match:</strong> {res.jd_comparison.match_percentage}%
                        (Matched: {res.jd_comparison.matched_keywords.length} keywords)
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => onSelectAnalysis(res, item.filename)}
                        className="text-xs font-semibold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        View Full Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
