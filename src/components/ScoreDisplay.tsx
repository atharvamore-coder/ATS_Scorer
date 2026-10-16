import React from 'react';
import { AnalysisResponse } from '../types/ats';

interface Props {
  analysis: AnalysisResponse;
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; bar: string } {
  if (score >= 80) {
    return { text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', bar: 'bg-emerald-500' };
  }
  if (score >= 60) {
    return { text: '#d97706', bg: '#fffbeb', border: '#fde68a', bar: 'bg-amber-500' };
  }
  return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca', bar: 'bg-rose-500' };
}

export function getScoreEmoji(score: number): string {
  if (score >= 90) return '🌟';
  if (score >= 80) return '✅';
  if (score >= 70) return '👍';
  if (score >= 60) return '⚠️';
  return '🔴';
}

export const COMPONENTS_CONFIG = [
  { label: 'Formatting', key: 'formatting' as const, max: 20, icon: '📝' },
  { label: 'Keywords & Skills', key: 'keywords' as const, max: 25, icon: '🔑' },
  { label: 'Content Quality', key: 'content' as const, max: 25, icon: '📄' },
  { label: 'Skill Validation', key: 'skill_validation' as const, max: 15, icon: '✅' },
  { label: 'ATS Compatibility', key: 'ats_compatibility' as const, max: 15, icon: '🤖' },
];

export const ScoreDisplay: React.FC<Props> = ({ analysis }) => {
  const score = analysis.ats_score;
  const colors = getScoreColor(score);
  const emoji = getScoreEmoji(score);
  const components = analysis.component_scores;

  return (
    <div className="space-y-6">
      {/* Overall Score Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-center transition-all shadow-sm border"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-4xl sm:text-5xl">{emoji}</span>
          <span
            className="text-5xl sm:text-6xl font-extrabold tracking-tight"
            style={{ color: colors.text }}
          >
            {score.toFixed(0)}
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-gray-400 self-end mb-1">
            / 100
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-gray-800 mt-2">
          Overall ATS Score
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mt-1">
          {analysis.interpretation}
        </p>
      </div>

      {/* Score Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📈</span> Score Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPONENTS_CONFIG.map(({ label, key, max, icon }) => {
            const val = components[key] ?? 0;
            const pct = Math.min(100, Math.max(0, (val / max) * 100));
            const barColor =
              pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span>{icon}</span> {label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {val.toFixed(1)} / {max}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
