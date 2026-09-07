import React, { useState } from 'react';
import { LEARNING_MODULES } from '../data/learningModules';
import { LearningModule, LessonCheckpoint, QuizQuestion } from '../types';
import {
  CheckCircle,
  Circle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface TutorialModeProps {
  onCheckpointComplete: (checkpointId: string) => void;
  onQuizScore: (moduleId: string, score: number) => void;
  completedCheckpoints: string[];
  quizScores: Record<string, number>;
  onNavigateTab: (tab: any) => void;
  isDark: boolean;
}

export const TutorialMode: React.FC<TutorialModeProps> = ({
  onCheckpointComplete,
  onQuizScore,
  completedCheckpoints,
  quizScores,
  onNavigateTab,
  isDark,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LEARNING_MODULES[0].id);
  const [checkpointIndex, setCheckpointIndex] = useState<number>(0);
  const [isTakingQuiz, setIsTakingQuiz] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentModule: LearningModule =
    LEARNING_MODULES.find((m) => m.id === selectedModuleId) || LEARNING_MODULES[0];

  const currentCheckpoint: LessonCheckpoint = currentModule.checkpoints[checkpointIndex];

  const handleNextCheckpoint = () => {
    onCheckpointComplete(currentCheckpoint.id);
    if (checkpointIndex < currentModule.checkpoints.length - 1) {
      setCheckpointIndex((prev) => prev + 1);
    } else {
      // Reached end of checkpoints: offer quiz
      setIsTakingQuiz(true);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handlePrevCheckpoint = () => {
    if (checkpointIndex > 0) {
      setCheckpointIndex((prev) => prev - 1);
    }
  };

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId);
    setCheckpointIndex(0);
    setIsTakingQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    currentModule.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    const percentage = Math.round((score / currentModule.quiz.length) * 100);
    onQuizScore(currentModule.id, percentage);
    setQuizSubmitted(true);
  };

  return (
    <div id="tutorial-mode-module" className="space-y-6">
      {/* Header */}
      <div
        id="tutorial-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                Guided Curriculum
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Comprehensive Quantum Learning Pathway
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Step-by-step guided lessons tailored for beginners and intermediate students.
              Read through core theoretical principles, test interactive checkpoints, and validate your mastery with knowledge quizzes.
            </p>
          </div>

          {/* Module Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Module:</span>
            <select
              value={selectedModuleId}
              onChange={(e) => handleSelectModule(e.target.value)}
              className="text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 cursor-pointer"
            >
              {LEARNING_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          {LEARNING_MODULES.map((mod, idx) => {
            const isSelected = mod.id === selectedModuleId;
            const score = quizScores[mod.id];
            const allCheckpointsDone = mod.checkpoints.every((cp) =>
              completedCheckpoints.includes(cp.id)
            );

            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod.id)}
                className={`px-3 py-2 rounded-lg font-medium transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-mono text-[10px]">
                  {idx + 1}
                </span>
                <span>{mod.title.split(' ')[0]}</span>
                {allCheckpointsDone && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {score !== undefined && (
                  <span className="font-mono text-[10px] bg-purple-950/40 text-purple-200 px-1.5 py-0.5 rounded">
                    {score}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Checkpoint List Navigation */}
        <div
          id="checkpoint-sidebar"
          className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Module Sections
            </h3>
            <span className="text-xs font-mono text-slate-400">{currentModule.durationMinutes} mins</span>
          </div>

          <div className="space-y-1.5">
            {currentModule.checkpoints.map((cp, idx) => {
              const isCurrent = !isTakingQuiz && idx === checkpointIndex;
              const isCompleted = completedCheckpoints.includes(cp.id);

              return (
                <div
                  key={cp.id}
                  onClick={() => {
                    setIsTakingQuiz(false);
                    setCheckpointIndex(idx);
                  }}
                  className={`p-2.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-slate-400">{idx + 1}.</span>
                    <span className="truncate">{cp.title}</span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
              );
            })}

            {/* Quiz Button Entry */}
            <div
              onClick={() => setIsTakingQuiz(true)}
              className={`p-2.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between mt-2 ${
                isTakingQuiz
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Knowledge Check Quiz</span>
              </div>
              {quizScores[currentModule.id] !== undefined && (
                <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">
                  {quizScores[currentModule.id]}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Checkpoint Content or Quiz View */}
        <div className="lg:col-span-8">
          {!isTakingQuiz ? (
            <div
              id="lesson-content-card"
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400">
                    Step {checkpointIndex + 1} of {currentModule.checkpoints.length}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentCheckpoint.title}
                  </h3>
                </div>
                {completedCheckpoints.includes(currentCheckpoint.id) && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Checkpoint Passed
                  </span>
                )}
              </div>

              {/* Lesson Text */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentCheckpoint.content}
              </div>

              {/* Interactive Task Box if any */}
              {currentCheckpoint.interactiveTask && (
                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Recommended Simulation Exercise:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {currentCheckpoint.interactiveTask.instruction}
                  </p>
                  <button
                    onClick={() => onNavigateTab(currentCheckpoint.interactiveTask?.type)}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    Open Interactive Simulation
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handlePrevCheckpoint}
                  disabled={checkpointIndex === 0}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Step
                </button>

                <button
                  onClick={handleNextCheckpoint}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {checkpointIndex < currentModule.checkpoints.length - 1
                    ? 'Complete & Continue'
                    : 'Proceed to Knowledge Quiz'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Panel */
            <div
              id="quiz-card"
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Knowledge Assessment
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentModule.title} - Quiz
                  </h3>
                </div>
                <button
                  onClick={() => setIsTakingQuiz(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Back to Lessons
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {currentModule.quiz.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div key={q.id} className="space-y-2.5">
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                        <span className="font-mono text-purple-600 dark:text-purple-400">
                          Q{qIdx + 1}.
                        </span>
                        <span>{q.question}</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pl-6">
                        {q.options.map((opt, optIdx) => {
                          const isOptionChosen = selectedOpt === optIdx;
                          let optStyle =
                            'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                            } else if (isOptionChosen) {
                              optStyle =
                                'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 line-through';
                            }
                          } else if (isOptionChosen) {
                            optStyle =
                              'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-semibold ring-1 ring-purple-500';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizAnswer(q.id, optIdx)}
                              className={`p-3 rounded-lg border text-xs text-left transition cursor-pointer flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctIndex && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation card after submit */}
                      {quizSubmitted && (
                        <div
                          className={`mt-2 p-3 rounded-lg text-xs ml-6 ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          }`}
                        >
                          <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Reset Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz
                  </button>
                ) : (
                  <div className="text-xs text-slate-500">
                    Answer all questions above to calculate your score.
                  </div>
                )}

                {!quizSubmitted && (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < currentModule.quiz.length}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
