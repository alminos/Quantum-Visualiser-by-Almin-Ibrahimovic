import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, ThemeMode, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { SuperpositionSimulation } from './components/SuperpositionSimulation';
import { EntanglementSimulation } from './components/EntanglementSimulation';
import { QuantumCircuitBuilder } from './components/QuantumCircuitBuilder';
import { QuantumHardwareViewer } from './components/QuantumHardwareViewer';
import { TutorialMode } from './components/TutorialMode';
import { ProgressDashboard } from './components/ProgressDashboard';
import { ReferenceAndAbout } from './components/ReferenceAndAbout';
import { usePWA } from './hooks/usePWA';

const LOCAL_STORAGE_PROGRESS_KEY = 'quantum_edu_learner_progress_v1';
const LOCAL_STORAGE_THEME_KEY = 'quantum_edu_theme_preference';

const INITIAL_PROGRESS: UserProgress = {
  completedModules: [],
  completedCheckpoints: [],
  quizScores: {},
  simulationsExplored: [],
  circuitsCreatedCount: 0,
  badgesUnlocked: [],
  lastActiveTimestamp: Date.now(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('superposition');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (raw) {
        return { ...INITIAL_PROGRESS, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('Failed to parse saved user progress:', e);
    }
    return INITIAL_PROGRESS;
  });

  const { isOnline, canInstall, triggerInstall } = usePWA();

  // Synchronise theme with root HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Persist progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress:', e);
    }
  }, [progress]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Milestone triggers
  const handleSimulationExperiment = useCallback((condition: string) => {
    setProgress((prev) => {
      let changed = false;
      const updatedExplored = new Set(prev.simulationsExplored);

      let targetSim = 'superposition';
      if (condition.startsWith('bell_') || condition.startsWith('chsh_')) {
        targetSim = 'entanglement';
      } else if (condition.startsWith('circuit_') || condition.startsWith('bell_circuit_')) {
        targetSim = 'gates';
      }

      if (!updatedExplored.has(targetSim)) {
        updatedExplored.add(targetSim);
        changed = true;
      }

      const updatedBadges = new Set(prev.badgesUnlocked);
      let newBadge: string | null = null;
      if (condition === 'equal_superposition' || condition === 'phase_shift_180') {
        newBadge = 'badge_first_superposition';
      } else if (condition === 'bell_phi_plus_selected' || condition === 'chsh_violation_demonstrated') {
        newBadge = 'badge_entanglement_master';
      } else if (condition === 'bell_circuit_built' || condition === 'circuit_created') {
        newBadge = 'badge_circuit_architect';
      }

      if (newBadge && !updatedBadges.has(newBadge)) {
        updatedBadges.add(newBadge);
        changed = true;
      }

      if (!changed) {
        return prev;
      }

      return {
        ...prev,
        simulationsExplored: Array.from(updatedExplored),
        badgesUnlocked: Array.from(updatedBadges),
        lastActiveTimestamp: Date.now(),
      };
    });
  }, []);

  const handleCircuitCreated = useCallback((condition: string) => {
    setProgress((prev) => {
      let changed = false;
      const explored = new Set(prev.simulationsExplored);
      if (!explored.has('gates')) {
        explored.add('gates');
        changed = true;
      }

      const badges = new Set(prev.badgesUnlocked);
      if (!badges.has('badge_circuit_architect')) {
        badges.add('badge_circuit_architect');
        changed = true;
      }

      const newCount = prev.circuitsCreatedCount + (condition === 'circuit_created' ? 1 : 0);
      if (newCount !== prev.circuitsCreatedCount) {
        changed = true;
      }

      if (!changed) {
        return prev;
      }

      return {
        ...prev,
        circuitsCreatedCount: newCount,
        simulationsExplored: Array.from(explored),
        badgesUnlocked: Array.from(badges),
        lastActiveTimestamp: Date.now(),
      };
    });
  }, []);

  const handleStageInspected = useCallback((stageId: string) => {
    setProgress((prev) => {
      const hasHardware = prev.simulationsExplored.includes('hardware');
      const hasBadge = prev.badgesUnlocked.includes('badge_cryo_engineer');
      if (hasHardware && hasBadge) {
        return prev;
      }
      return {
        ...prev,
        simulationsExplored: Array.from(new Set([...prev.simulationsExplored, 'hardware'])),
        badgesUnlocked: Array.from(new Set([...prev.badgesUnlocked, 'badge_cryo_engineer'])),
        lastActiveTimestamp: Date.now(),
      };
    });
  }, []);

  const handleCheckpointComplete = useCallback((checkpointId: string) => {
    setProgress((prev) => {
      if (prev.completedCheckpoints.includes(checkpointId)) {
        return prev;
      }
      return {
        ...prev,
        completedCheckpoints: [...prev.completedCheckpoints, checkpointId],
        lastActiveTimestamp: Date.now(),
      };
    });
  }, []);

  const handleQuizScore = useCallback((moduleId: string, score: number) => {
    setProgress((prev) => {
      const prevScore = prev.quizScores[moduleId];
      if (prevScore === score) {
        return prev;
      }
      const newScores = { ...prev.quizScores, [moduleId]: score };
      const updatedModules = new Set(prev.completedModules);
      if (score >= 70) {
        updatedModules.add(moduleId);
      }
      return {
        ...prev,
        quizScores: newScores,
        completedModules: Array.from(updatedModules),
        lastActiveTimestamp: Date.now(),
      };
    });
  }, []);

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    localStorage.removeItem(LOCAL_STORAGE_PROGRESS_KEY);
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Offline Status Awareness */}
      <OfflineBanner isOnline={isOnline} />

      {/* Main Responsive Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOnline={isOnline}
        canInstallPwa={canInstall}
        onInstallPwa={triggerInstall}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'superposition' && (
          <SuperpositionSimulation
            onExperimentComplete={handleSimulationExperiment}
            isDark={isDark}
          />
        )}

        {activeTab === 'entanglement' && (
          <EntanglementSimulation
            onExperimentComplete={handleSimulationExperiment}
            isDark={isDark}
          />
        )}

        {activeTab === 'gates' && (
          <QuantumCircuitBuilder
            onCircuitChanged={handleCircuitCreated}
            isDark={isDark}
          />
        )}

        {activeTab === 'hardware' && (
          <QuantumHardwareViewer
            onStageInspected={handleStageInspected}
            isDark={isDark}
          />
        )}

        {activeTab === 'tutorial' && (
          <TutorialMode
            onCheckpointComplete={handleCheckpointComplete}
            onQuizScore={handleQuizScore}
            completedCheckpoints={progress.completedCheckpoints}
            quizScores={progress.quizScores}
            onNavigateTab={setActiveTab}
            isDark={isDark}
          />
        )}

        {activeTab === 'dashboard' && (
          <ProgressDashboard
            progress={progress}
            onResetProgress={handleResetProgress}
            isDark={isDark}
          />
        )}

        {activeTab === 'reference' && (
          <ReferenceAndAbout isDark={isDark} />
        )}
      </main>

      {/* Footer with Copyright and Hosting Notice */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Quantum Mechanics and Computing Visualiser
            </div>
            <div>
              Target Host: <span className="font-mono text-cyan-600 dark:text-cyan-400">almin.co.uk/quantum/</span>
            </div>
            <div>
              Copyright (C) Almin Ibrahimovic. All knowledge used and any code under MIT License in about section.
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('superposition')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Superposition
            </button>
            <button
              onClick={() => setActiveTab('entanglement')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Entanglement
            </button>
            <button
              onClick={() => setActiveTab('gates')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Logic Gates
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Hardware Chandelier
            </button>
            <button
              onClick={() => setActiveTab('tutorial')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Tutorial Mode
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Milestones
            </button>
            <button
              onClick={() => setActiveTab('reference')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              About & Licensing
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
