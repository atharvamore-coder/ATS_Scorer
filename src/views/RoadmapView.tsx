import React, { useState } from 'react';
import { SkillRoadmap, SkillWorkaround } from '../types/ats';
import { Compass, BookOpen, ExternalLink, Sparkles, CheckCircle2, Code2 } from 'lucide-react';

interface Props {
  roadmaps: SkillRoadmap[];
  workarounds: SkillWorkaround[];
  onOpenEditor?: () => void;
}

export const RoadmapView: React.FC<Props> = ({ roadmaps, workarounds, onOpenEditor }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(
    roadmaps.length > 0 ? roadmaps[0].skill : ''
  );

  const activeRoadmap = roadmaps.find((r) => r.skill === selectedSkill) || roadmaps[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Compass className="w-7 h-7 text-indigo-600" />
          <span>Skill-Gap Learning Roadmaps & Workarounds</span>
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Bridge target job requirements: learn how to demonstrate missing competencies or frame adjacent skills you already have.
        </p>
      </div>

      {/* Skill Bridge Workarounds Banner */}
      {workarounds.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-6 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-amber-950">
              Immediate Skill Bridge Workarounds (Apply Today)
            </h2>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Don't have a required tool? Frame your adjacent tool proficiency to satisfy ATS filters without waiting weeks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workarounds.map((w, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-amber-200/60 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">
                    Missing: <span className="text-rose-600">{w.missing_skill}</span> → Owned:{' '}
                    <span className="text-emerald-700">{w.adjacent_skill}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-600">{w.workaround_strategy}</p>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-800 font-mono">
                  "{w.suggested_bullet}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Learning Roadmaps */}
      {roadmaps.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Skill Selector Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
            {roadmaps.map((r) => (
              <button
                key={r.skill}
                onClick={() => setSelectedSkill(r.skill)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSkill === r.skill
                    ? 'bg-white text-indigo-700 shadow-xs border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {r.skill} ({r.difficulty})
              </button>
            ))}
          </div>

          {activeRoadmap && (
            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Learning Roadmap
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 mt-2">
                    Mastering {activeRoadmap.skill}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated Time: {activeRoadmap.estimated_time} · Difficulty: {activeRoadmap.difficulty}
                  </p>
                </div>

                {onOpenEditor && (
                  <button
                    onClick={onOpenEditor}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                  >
                    Edit Resume Bullet Points
                  </button>
                )}
              </div>

              {/* 4 Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRoadmap.milestones.map((m, idx) => {
                  const phaseColors = {
                    Fundamentals: 'bg-blue-50 text-blue-700 border-blue-200',
                    'Practice Exercise': 'bg-purple-50 text-purple-700 border-purple-200',
                    'Portfolio Project': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Free Resources': 'bg-amber-50 text-amber-700 border-amber-200',
                  }[m.phase];

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-gray-200 bg-gray-50/40 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${phaseColors}`}
                        >
                          Step {idx + 1}: {m.phase}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm mt-1">{m.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{m.description}</p>
                      </div>

                      {m.resource_url && (
                        <div className="border-t border-gray-200/60 pt-3">
                          <a
                            href={m.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                          >
                            <span>Open Free Resource</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No Missing Skills Detected</h3>
          <p className="text-xs text-gray-500 mt-1">
            Provide a job description on the ATS Scorer page to generate custom roadmaps for missing requirements.
          </p>
        </div>
      )}
    </div>
  );
};
