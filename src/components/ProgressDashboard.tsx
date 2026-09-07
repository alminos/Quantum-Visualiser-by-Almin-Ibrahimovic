import React, { useState } from 'react';
import { UserProgress, Badge } from '../types';
import { BADGES, LEARNING_MODULES } from '../data/learningModules';
import {
  Award,
  CheckCircle,
  Trophy,
  RotateCcw,
  Download,
  Flame,
  Star,
  BookCheck,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress: () => void;
  isDark: boolean;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onResetProgress,
  isDark,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Total checkable checkpoints
  const totalCheckpoints = LEARNING_MODULES.reduce(
    (acc, m) => acc + m.checkpoints.length,
    0
  );
  const completedCheckpointsCount = progress.completedCheckpoints.length;
  const checkpointPct = Math.min(
    100,
    Math.round((completedCheckpointsCount / (totalCheckpoints || 1)) * 100)
  );

  // Quiz completion
  const totalQuizzes = LEARNING_MODULES.length;
  const passedQuizzesCount = Object.keys(progress.quizScores).filter(
    (k) => progress.quizScores[k] >= 70
  ).length;

  // Compute earned badges dynamically
  const earnedBadgeIds = new Set<string>(progress.badgesUnlocked);
  if (progress.simulationsExplored.includes('superposition')) {
    earnedBadgeIds.add('badge_first_superposition');
  }
  if (progress.simulationsExplored.includes('entanglement')) {
    earnedBadgeIds.add('badge_entanglement_master');
  }
  if (progress.circuitsCreatedCount > 0) {
    earnedBadgeIds.add('badge_circuit_architect');
  }
  if (progress.simulationsExplored.includes('hardware')) {
    earnedBadgeIds.add('badge_cryo_engineer');
  }
  if (passedQuizzesCount >= 3) {
    earnedBadgeIds.add('badge_scholar');
  }

  // Composite overall score
  const overallPercentage = Math.round(
    (checkpointPct * 0.4) +
    ((passedQuizzesCount / totalQuizzes) * 100 * 0.4) +
    ((earnedBadgeIds.size / BADGES.length) * 100 * 0.2)
  );

  const handleExportSummary = () => {
    const textReport = [
      'QUANTUM MECHANICS & COMPUTING VISUALISER - PROGRESS SUMMARY',
      'Hosted at: almin.co.uk/quantum/',
      `Generated on: ${new Date().toISOString()}`,
      '-------------------------------------------------------',
      `Overall Mastery Score: ${overallPercentage}%`,
      `Completed Checkpoints: ${completedCheckpointsCount} / ${totalCheckpoints} (${checkpointPct}%)`,
      `Quizzes Passed: ${passedQuizzesCount} / ${totalQuizzes}`,
      `Badges Unlocked: ${earnedBadgeIds.size} / ${BADGES.length}`,
      `Circuits Created: ${progress.circuitsCreatedCount}`,
      '-------------------------------------------------------',
      'Module Breakdown:',
      ...LEARNING_MODULES.map((m) => {
        const score = progress.quizScores[m.id];
        return `* ${m.title}: ${score !== undefined ? `${score}% Score` : 'Quiz Not Taken'}`;
      }),
      '-------------------------------------------------------',
      'Copyright (C) Almin Ibrahimovic. All knowledge used and any code under MIT.',
    ].join('\n');

    navigator.clipboard.writeText(textReport).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 3000);
    });
  };

  return (
    <div id="progress-dashboard-module" className="space-y-6">
      {/* Header */}
      <div
        id="dashboard-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                Learner Analytics
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Individual Quantum Learning Milestones
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Track your individual progress across quantum theory checkpoints, logic gate challenges,
              and cryogenic hardware explorations. Stored securely and available offline in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-progress-btn"
              onClick={handleExportSummary}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              {copiedReport ? 'Copied Summary to Clipboard' : 'Export Progress Report'}
            </button>
            <button
              id="reset-progress-btn"
              onClick={() => setShowConfirmReset(true)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation modal for reset */}
      {showConfirmReset && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-xs flex items-center justify-between">
          <span className="text-rose-900 dark:text-rose-200 font-medium">
            Are you sure you want to reset all saved checkpoints, quiz scores, and unlocked milestones?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onResetProgress();
                setShowConfirmReset(false);
              }}
              className="px-3 py-1.5 rounded bg-rose-600 text-white font-bold cursor-pointer"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mastery */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curriculum Mastery
            </span>
            <Trophy className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {overallPercentage}%
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Checkpoints */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Checkpoints Completed
            </span>
            <BookCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {completedCheckpointsCount} / {totalCheckpoints}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-3 block">
            {checkpointPct}% of tutorial steps finished
          </span>
        </div>

        {/* Quizzes Passed */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Knowledge Quizzes Passed
            </span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {passedQuizzesCount} / {totalQuizzes}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-3 block">
            Passing threshold: 70% score
          </span>
        </div>

        {/* Circuits & Simulations */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Simulations Explored
            </span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {progress.simulationsExplored.length} / 4
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-3 block">
            {progress.circuitsCreatedCount} circuit architectures built
          </span>
        </div>
      </div>

      {/* Earned Mastery Badges */}
      <div
        id="mastery-badges"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Mastery Milestone Badges ({earnedBadgeIds.size} / {BADGES.length} Unlocked)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {Math.round((earnedBadgeIds.size / BADGES.length) * 100)}% Badges
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = earnedBadgeIds.has(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border text-center transition ${
                  isUnlocked
                    ? 'border-amber-500/80 bg-gradient-to-b from-amber-500/10 to-transparent shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    isUnlocked
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {b.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  {b.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Progress Detailed Breakdown */}
      <div
        id="module-breakdown"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Module Curriculum Breakdown
        </h3>

        <div className="space-y-3">
          {LEARNING_MODULES.map((mod) => {
            const completedCount = mod.checkpoints.filter((cp) =>
              progress.completedCheckpoints.includes(cp.id)
            ).length;
            const score = progress.quizScores[mod.id];

            return (
              <div
                key={mod.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400">{mod.category}</span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {mod.title}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Checkpoints</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {completedCount} / {mod.checkpoints.length}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Quiz Score</span>
                    <span
                      className={`font-mono font-bold ${
                        score !== undefined
                          ? score >= 70
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {score !== undefined ? `${score}%` : 'Not Taken'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
