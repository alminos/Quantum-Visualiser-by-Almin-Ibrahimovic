import React, { useState } from 'react';
import { ActiveTab, ThemeMode } from '../types';
import {
  Sun,
  Moon,
  Compass,
  Radio,
  Cpu,
  BookOpen,
  Trophy,
  Layers,
  Menu,
  X,
  Wifi,
  WifiOff,
  Download,
  Atom,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isOnline: boolean;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  isOnline,
  canInstallPwa,
  onInstallPwa,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'superposition', label: 'Superposition', icon: <Compass className="w-4 h-4" /> },
    { id: 'entanglement', label: 'Entanglement', icon: <Radio className="w-4 h-4" /> },
    { id: 'gates', label: 'Logic Gates', icon: <Cpu className="w-4 h-4" /> },
    { id: 'hardware', label: 'Hardware Parts', icon: <Layers className="w-4 h-4" /> },
    { id: 'tutorial', label: 'Tutorial Mode', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Milestones', icon: <Trophy className="w-4 h-4" /> },
    { id: 'reference', label: 'Reference & About', icon: <Atom className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: ActiveTab) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo & Destination */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Atom className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                Quantum Visualiser
              </span>
              <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                almin.co.uk/quantum/
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Interactive Mechanics and Computing Simulator
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Offline Status, Install, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Online/Offline status pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
            title={isOnline ? 'Online mode active' : 'Offline mode active: Cached materials available'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline Ready'}</span>
          </div>

          {/* PWA Install Button */}
          {canInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark and light theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1 shadow-lg">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400">
            Destination: almin.co.uk/quantum/
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {canInstallPwa && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onInstallPwa();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-cyan-600 text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install Offline Application
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
