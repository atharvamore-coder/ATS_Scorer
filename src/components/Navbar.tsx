import React, { useState } from 'react';
import { Home, Target, Zap, Layers, Compass, History, BookOpen, User, LogOut, CheckCircle2, HeartHandshake } from 'lucide-react';
import { UserSession } from '../types/ats';

export type AppView = 'landing' | 'scorer' | 'editor' | 'culture' | 'multijob' | 'roadmaps' | 'history' | 'resources';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserSession;
  onToggleUser: () => void;
}

export const Navbar: React.FC<Props> = ({ currentView, onNavigate, user, onToggleUser }) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const navItems: Array<{ id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'scorer', label: 'ATS Scorer', icon: Target },
    { id: 'editor', label: 'Live Editor', icon: Zap },
    { id: 'culture', label: 'Culture Fit', icon: HeartHandshake },
    { id: 'multijob', label: 'Multi-Job Compare', icon: Layers },
    { id: 'roadmaps', label: 'Skill Roadmaps', icon: Compass },
    { id: 'history', label: 'History', icon: History },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              🎯
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight block leading-none">
                ATS Resume Scorer
              </span>
              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                AI Optimization Suite
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = currentView === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Account Section */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs overflow-hidden">
                {user.is_logged_in ? (
                  <span>{user.name.charAt(0)}</span>
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-gray-800 block leading-tight">
                  {user.is_logged_in ? user.name : 'Guest User'}
                </span>
                <span className="text-[10px] text-gray-400 block leading-none mt-0.5">
                  {user.is_logged_in ? 'Google Account' : 'Click to Sign In'}
                </span>
              </div>
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 animate-fadeIn">
                <div className="p-2 border-b border-gray-100 mb-2">
                  <p className="text-xs text-gray-500">Account status</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                  {user.is_logged_in && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authenticated Session</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    onToggleUser();
                    setShowAccountDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4 text-gray-500" />
                  <span>{user.is_logged_in ? 'Switch to Guest Mode' : 'Sign In with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto no-scrollbar">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
