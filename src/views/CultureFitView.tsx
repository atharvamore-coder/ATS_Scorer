import React, { useState, useMemo } from 'react';
import { CompanyCultureProfile, CompanyMatchAnalysis } from '../types/ats';
import { COMPANY_CULTURE_DATASET } from '../data/companyCultureDataset';
import { calculateCompanyCultureMatch } from '../services/cultureScorer';
import { SAMPLE_RESUMES } from '../data/samples';
import {
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Smile,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Building2,
  Star,
  Users,
  Briefcase,
  Coffee,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  resumeText: string;
  jobDescription?: string;
  onOpenEditorWithData?: (resumeText: string, jdText: string) => void;
  onSwitchToScorer?: () => void;
}

export const CultureFitView: React.FC<Props> = ({
  resumeText: initialResumeText,
  jobDescription = '',
  onOpenEditorWithData,
  onSwitchToScorer,
}) => {
  const [activeResumeText, setActiveResumeText] = useState<string>(
    initialResumeText || SAMPLE_RESUMES[0]?.content || ''
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('nextgen-cloud');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<
    'all' | 'high_wlb' | 'remote' | 'startups' | 'big_tech'
  >('all');
  const [activeDetailTab, setActiveDetailTab] = useState<'profile' | 'match' | 'interview'>('profile');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync if prop updates
  React.useEffect(() => {
    if (initialResumeText && initialResumeText.trim().length > 0) {
      setActiveResumeText(initialResumeText);
    }
  }, [initialResumeText]);

  // Selected company object
  const selectedCompany = useMemo(() => {
    return (
      COMPANY_CULTURE_DATASET.find((c) => c.id === selectedCompanyId) ||
      COMPANY_CULTURE_DATASET[0]
    );
  }, [selectedCompanyId]);

  // Company Match Analysis for the selected company
  const matchAnalysis = useMemo<CompanyMatchAnalysis>(() => {
    return calculateCompanyCultureMatch(activeResumeText, selectedCompany);
  }, [activeResumeText, selectedCompany]);

  // Precompute match scores for all companies for card badges
  const companyScores = useMemo(() => {
    const scores: Record<string, number> = {};
    COMPANY_CULTURE_DATASET.forEach((comp) => {
      const res = calculateCompanyCultureMatch(activeResumeText, comp);
      scores[comp.id] = res.match_score;
    });
    return scores;
  }, [activeResumeText]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return COMPANY_CULTURE_DATASET.filter((comp) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesDomain = comp.domain.toLowerCase().includes(q);
        const matchesLocation = comp.headquarters.toLowerCase().includes(q);
        if (!matchesName && !matchesDomain && !matchesLocation) return false;
      }

      // Filter mode
      if (filterMode === 'high_wlb') {
        return comp.work_life_balance.rating >= 4.3;
      }
      if (filterMode === 'remote') {
        return (
          comp.location_mode.toLowerCase().includes('remote') ||
          comp.location_mode.toLowerCase().includes('hybrid')
        );
      }
      if (filterMode === 'startups') {
        return comp.category === 'Fast Startup' || comp.category === 'High-Growth';
      }
      if (filterMode === 'big_tech') {
        return comp.category === 'Big Tech' || comp.category === 'Enterprise';
      }

      return true;
    });
  }, [searchQuery, filterMode]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Color helper for badges
  const getThemeBg = (color: string) => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-600 text-white';
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'sky':
        return 'bg-sky-600 text-white';
      case 'amber':
        return 'bg-amber-600 text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      case 'emerald':
        return 'bg-emerald-600 text-white';
      case 'rose':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  const getScoreTheme = (score: number) => {
    if (score >= 85)
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
      };
    if (score >= 70)
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-800',
      };
    if (score >= 55)
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
      };
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
    };
  };

  const scoreTheme = getScoreTheme(matchAnalysis.match_score);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Workplace & Culture Diagnostics
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 font-medium">
              100% Client-Side Dataset Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <HeartHandshake className="w-8 h-8 text-indigo-600" />
            <span>Company Culture & Work-Life Balance Explorer</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl">
            Explore everyday work-life balance, mission, core values, and interview culture tips across top companies in our datasets—and see how your resume aligns in clear, everyday language.
          </p>
        </div>

        {onOpenEditorWithData && (
          <button
            onClick={() => onOpenEditorWithData(activeResumeText, jobDescription)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Apply Culture Tips in Live Editor</span>
          </button>
        )}
      </div>

      {/* Resume Switcher Bar (Quickly test with sample or uploaded resume) */}
      <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-800">Evaluating Resume:</span>
          <span className="text-gray-500 truncate max-w-xs sm:max-w-md font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
            {activeResumeText.slice(0, 40).replace(/\n/g, ' ')}...
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-400 font-medium mr-1">Switch Resume:</span>
          {SAMPLE_RESUMES.map((sample) => {
            const isActive = activeResumeText === sample.content;
            return (
              <button
                key={sample.id}
                onClick={() => setActiveResumeText(sample.content)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sample.id === 'fresher-india' ? 'Aarav (Fresher)' : sample.id === 'swe-fullstack' ? 'Alex (Full Stack)' : 'Sam (Junior)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company by name, cloud, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Companies ({COMPANY_CULTURE_DATASET.length})
          </button>
          <button
            onClick={() => setFilterMode('high_wlb')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              filterMode === 'high_wlb'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>🌿 Best Work-Life Balance (4.3+)</span>
          </button>
          <button
            onClick={() => setFilterMode('remote')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterMode === 'remote'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Remote / Hybrid
          </button>
          <button
            onClick={() => setFilterMode('startups')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterMode === 'startups'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Fast Startups & Growth
          </button>
          <button
            onClick={() => setFilterMode('big_tech')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterMode === 'big_tech'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Big Tech & Enterprise
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Company Directory Grid on Left, Deep-Dive Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Company Cards Grid (5 columns on lg) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
            <span>SELECT A COMPANY TO EXPLORE</span>
            <span>{filteredCompanies.length} companies available</span>
          </div>

          <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredCompanies.map((company) => {
              const isSelected = company.id === selectedCompanyId;
              const score = companyScores[company.id] || 75;
              const sTheme = getScoreTheme(score);

              return (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${getThemeBg(
                          company.theme_color
                        )}`}
                      >
                        {company.logo_initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                            {company.name}
                          </h3>
                          {company.id === 'nextgen-cloud' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              Sample JD Match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {company.domain}
                        </p>
                      </div>
                    </div>

                    {/* Culture Match Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-extrabold text-right shrink-0 border ${sTheme.bg} ${sTheme.text} ${sTheme.border}`}
                    >
                      <span>{score}% Match</span>
                    </div>
                  </div>

                  {/* Work-Life Balance Quick Strip */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>{company.work_life_balance.rating}/5 WLB</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{company.work_life_balance.typical_hours.split('(')[0]}</span>
                    </div>

                    <span className="text-[11px] text-gray-400 font-medium">
                      {company.location_mode}
                    </span>
                  </div>

                  {/* Plain Language Summary */}
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {company.mission}
                  </p>
                </div>
              );
            })}

            {filteredCompanies.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-semibold">No companies match your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterMode('all');
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Company Deep-Dive & Match Breakdown (7 columns on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Company Banner Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-xs ${getThemeBg(
                    selectedCompany.theme_color
                  )}`}
                >
                  {selectedCompany.logo_initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {selectedCompany.name}
                    </h2>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {selectedCompany.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-0.5">
                    <span className="font-semibold text-gray-700">{selectedCompany.domain}</span>
                    <span>·</span>
                    <span>{selectedCompany.headquarters}</span>
                    <span>·</span>
                    <span className="text-indigo-600 font-medium">{selectedCompany.location_mode}</span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 shrink-0">
                <div className="text-center">
                  <div className={`text-2xl font-black ${scoreTheme.text} leading-none font-mono`}>
                    {matchAnalysis.match_score}%
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                    Culture Synergy
                  </div>
                </div>
                <div className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
                  {matchAnalysis.match_tier}
                </div>
              </div>
            </div>

            {/* Navigation Tabs for the Company Detail */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveDetailTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'profile'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Company & Work-Life Balance</span>
              </button>
              <button
                onClick={() => setActiveDetailTab('match')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'match'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Resume Match Breakdown</span>
              </button>
              <button
                onClick={() => setActiveDetailTab('interview')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'interview'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Interview Culture Tips</span>
              </button>
            </div>

            {/* TAB 1: COMPANY DETAILS & WORK-LIFE BALANCE */}
            {activeDetailTab === 'profile' && (
              <div className="space-y-6 pt-2">
                {/* 1. Mission */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 mb-1">
                    Company Mission in Plain English
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    "{selectedCompany.mission}"
                  </p>
                </div>

                {/* 2. DEDICATED WORK-LIFE BALANCE SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-emerald-600" />
                      <span>Work-Life Balance Reality & Schedule</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ⭐️ {selectedCompany.work_life_balance.rating} / 5.0 Rating
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WLB Rating & Vibe Card */}
                    <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase">
                        <Smile className="w-4 h-4 text-emerald-600" />
                        <span>Workplace Atmosphere</span>
                      </div>
                      <div className="text-base font-extrabold text-emerald-950">
                        {selectedCompany.work_life_balance.status_label}
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">
                        Stress Level: <strong>{selectedCompany.work_life_balance.stress_level}</strong>
                      </p>
                    </div>

                    {/* Typical Hours Card */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs uppercase">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>Typical Weekly Hours</span>
                      </div>
                      <div className="text-sm font-extrabold text-gray-900">
                        {selectedCompany.work_life_balance.typical_hours}
                      </div>
                      <p className="text-xs text-gray-500">
                        Predictable schedule without unexpected mandatory late nights.
                      </p>
                    </div>

                    {/* Weekend & After-Hours Policy */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs uppercase">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Weekend Policy</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        {selectedCompany.work_life_balance.weekend_policy}
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Managers respect personal time and discourage after-hours pings.
                      </p>
                    </div>

                    {/* Flexibility & PTO Perks */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs uppercase">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>Flexibility & Leave Policy</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        {selectedCompany.work_life_balance.flexibility_perks}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Core Values in Plain English */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900">
                    Core Values Explained Simply
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCompany.core_values.map((val, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-gray-900">
                            {idx + 1}. {val.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          <strong>What it means:</strong> {val.plain_meaning}
                        </p>
                        <p className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg font-medium">
                          <strong>Recruiters look for:</strong> {val.what_recruiters_look_for}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Day-to-Day Work Style */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Everyday Work Style & Meeting Rhythm</span>
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedCompany.work_style}
                  </p>
                </div>

                {/* 5. Perks & Benefits */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                    Workplace Perks & Benefits
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedCompany.perks.map((perk, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RESUME MATCH BREAKDOWN (OPTION 1 + OPTION 3) */}
            {activeDetailTab === 'match' && (
              <div className="space-y-6 pt-2">
                {/* Synergy Score Overview Card */}
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700">
                      Resume Alignment Verdict
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-0.5">
                      {matchAnalysis.match_score}% Cultural Synergy with {selectedCompany.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-lg leading-relaxed">
                      Your resume shows strong signals of hands-on building, practical problem solving, and technical execution that match their expectations.
                    </p>
                  </div>

                  <div className="text-center bg-white px-5 py-3 rounded-xl border border-indigo-100 shadow-2xs shrink-0">
                    <div className="text-3xl font-black text-indigo-600 font-mono">
                      {matchAnalysis.match_score}%
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">
                      {matchAnalysis.match_tier}
                    </div>
                  </div>
                </div>

                {/* OPTION 1: "Why Your Resume Matches This Company" */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
                      Why Your Resume Matches {selectedCompany.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {matchAnalysis.why_you_match.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs text-gray-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <p className="leading-relaxed font-medium">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OPTION 3: Interactive Breakdown Comparing Resume Highlights Against Target Culture */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Resume Highlights Mapped to {selectedCompany.name} Core Values</span>
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                      Exact points extracted from your resume
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchAnalysis.resume_highlight_connections.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2 hover:border-indigo-300 transition"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            Aligns with: {item.company_value}
                          </span>
                          <button
                            onClick={() => handleCopy(`bullet-${idx}`, item.resume_bullet)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
                          >
                            {copiedId === `bullet-${idx}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Bullet</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Resume Bullet */}
                        <div className="p-2.5 bg-gray-50 rounded-lg text-xs text-gray-800 font-mono border border-gray-100">
                          "{item.resume_bullet}"
                        </div>

                        {/* Why It Works */}
                        <p className="text-xs text-gray-600">
                          💡 <strong>Why recruiters like this:</strong> {item.why_it_works}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simple Ways to Stand Out (No Jargon) */}
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Simple Ways to Stand Out (Actionable Resume Tweaks)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                    {matchAnalysis.simple_ways_to_stand_out.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">👉</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>

                  {onOpenEditorWithData && (
                    <div className="pt-2">
                      <button
                        onClick={() =>
                          onOpenEditorWithData(activeResumeText, jobDescription)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-700 text-white hover:bg-amber-800 transition cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-200" />
                        <span>Update Bullets in Live Editor</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: INTERVIEW PREP & CULTURE QUESTIONS */}
            {activeDetailTab === 'interview' && (
              <div className="space-y-5 pt-2">
                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900">
                    How {selectedCompany.name} Conducts Culture Rounds
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Interviewers here care about how you solve disagreements, how you handle mistakes without panic, and whether you are genuinely curious to learn. Here are actionable tips and talking points tailored to your background.
                  </p>
                </div>

                {/* Actionable Interview Tips */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                    Top 4 Interview Tips for {selectedCompany.name}
                  </h4>
                  <div className="space-y-2">
                    {selectedCompany.interview_tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs text-xs text-gray-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Interview Questions & How to Answer */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Real Behavioral Questions & Tailored Talking Points</span>
                  </h4>

                  <div className="space-y-3">
                    {matchAnalysis.behavioral_interview_prep.map((qItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2.5"
                      >
                        <div className="font-extrabold text-sm text-gray-900">
                          Q: "{qItem.question}"
                        </div>

                        <div className="p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100 text-xs text-indigo-950">
                          <span className="font-bold block text-indigo-700 mb-0.5">
                            How to frame your answer:
                          </span>
                          {qItem.how_to_answer}
                        </div>

                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-700">
                          <span className="font-bold text-gray-900 block mb-0.5">
                            Talking point from your resume to reference:
                          </span>
                          <span className="font-mono text-gray-800">
                            "{qItem.suggested_resume_point}"
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
