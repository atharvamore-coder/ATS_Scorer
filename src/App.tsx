import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { ScorerView } from './views/ScorerView';
import { EditorView } from './views/EditorView';
import { MultiJobView } from './views/MultiJobView';
import { RoadmapView } from './views/RoadmapView';
import { CultureFitView } from './views/CultureFitView';
import { HistoryView } from './views/HistoryView';
import { ResourcesView } from './views/ResourcesView';
import { AnalysisResponse, ScoringMode, UserSession } from './types/ats';
import { getUserSession, saveUserSession, DEFAULT_USER } from './services/storage';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from './data/samples';
import { calculateATSAnalysis } from './services/scorer';
import { generateSkillRoadmaps, findSkillWorkarounds } from './services/skillBridge';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserSession>(getUserSession());

  // Shared application state
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES[0].content);
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JOB_DESCRIPTIONS[0].content);
  const [scoringMode, setScoringMode] = useState<ScoringMode>('fresher');
  const [filename, setFilename] = useState<string>('aarav-sharma-fresher.pdf');
  const [isPdfUploaded, setIsPdfUploaded] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Lazy computation for Roadmaps & Workarounds if user visits roadmaps directly
  const activeRoadmaps =
    analysisResult?.skill_roadmaps ||
    generateSkillRoadmaps(['Tableau', 'Docker', 'AWS', 'System Design']);

  const activeWorkarounds =
    analysisResult?.skill_workarounds ||
    findSkillWorkarounds(
      ['tableau', 'docker', 'aws'],
      ['powerbi', 'postgresql', 'react', 'python']
    );

  useEffect(() => {
    saveUserSession(user);
  }, [user]);

  const handleToggleUser = () => {
    setUser((prev) => {
      const next: UserSession = prev.is_logged_in
        ? {
            user_id: 'guest_user',
            email: 'guest@ats-scorer.local',
            name: 'Guest User',
            is_logged_in: false,
          }
        : DEFAULT_USER;
      saveUserSession(next);
      return next;
    });
  };

  const handleSelectHistoryAnalysis = (analysis: AnalysisResponse, historyFilename: string) => {
    setAnalysisResult(analysis);
    setFilename(historyFilename);
    setScoringMode(analysis.mode);
    setCurrentView('scorer');
  };

  const handleOpenEditorWithData = (rText: string, jdText: string, mode: ScoringMode) => {
    setResumeText(rText);
    setJobDescription(jdText);
    setScoringMode(mode);
    setCurrentView('editor');
  };

  const handleOpenMultiJobWithResume = (rText: string) => {
    setResumeText(rText);
    setCurrentView('multijob');
  };

  const handleUpdateAnalysisState = (
    rText: string,
    jdText: string,
    mode: ScoringMode,
    result: AnalysisResponse
  ) => {
    setResumeText(rText);
    setJobDescription(jdText);
    setScoringMode(mode);
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onToggleUser={handleToggleUser}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'landing' && (
          <LandingView
            onStart={() => setCurrentView('scorer')}
            onOpenEditor={() => setCurrentView('editor')}
            onOpenMultiJob={() => setCurrentView('multijob')}
            onOpenRoadmaps={() => setCurrentView('roadmaps')}
            onOpenCulture={() => setCurrentView('culture')}
          />
        )}

        {currentView === 'scorer' && (
          <ScorerView
            initialResult={analysisResult}
            initialFilename={filename}
            initialResumeText={resumeText}
            initialJobDescription={jobDescription}
            onOpenEditorWithData={handleOpenEditorWithData}
            onOpenRoadmaps={() => setCurrentView('roadmaps')}
            onOpenMultiJob={handleOpenMultiJobWithResume}
            onOpenCulture={() => setCurrentView('culture')}
            onUpdateAnalysisState={handleUpdateAnalysisState}
            onClearAll={() => {
              setResumeText('');
              setJobDescription('');
              setAnalysisResult(null);
              setFilename('');
              setIsPdfUploaded(false);
            }}
            onSetPdfUploaded={(isPdf) => setIsPdfUploaded(isPdf)}
          />
        )}

        {currentView === 'editor' && (
          <EditorView
            initialResumeText={resumeText}
            initialJobDescription={jobDescription}
            initialMode={scoringMode}
            isPdfUploaded={isPdfUploaded}
            filename={filename}
            onSwitchToScorer={() => setCurrentView('scorer')}
            onSaveToHistory={(updatedText, updatedAnalysis) => {
              setResumeText(updatedText);
              setAnalysisResult(updatedAnalysis);
            }}
          />
        )}

        {currentView === 'culture' && (
          <CultureFitView
            resumeText={resumeText}
            jobDescription={jobDescription}
            onOpenEditorWithData={(rText, jdText) => {
              setResumeText(rText);
              setJobDescription(jdText);
              setCurrentView('editor');
            }}
            onSwitchToScorer={() => setCurrentView('scorer')}
          />
        )}

        {currentView === 'multijob' && (
          <MultiJobView
            resumeText={resumeText}
            onOpenEditorWithFeedback={() => setCurrentView('editor')}
          />
        )}

        {currentView === 'roadmaps' && (
          <RoadmapView
            roadmaps={activeRoadmaps}
            workarounds={activeWorkarounds}
            onOpenEditor={() => setCurrentView('editor')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onNavigateToScorer={() => setCurrentView('scorer')}
          />
        )}

        {currentView === 'resources' && <ResourcesView />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ATS Resume Scorer · Explainable ATS Scoring & Offline Diagnostic Suite</p>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Client-side local parsing</span>
            <span>•</span>
            <span>100% Privacy guaranteed</span>
            <span>•</span>
            <span>Indian Academic Conventions Supported</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
