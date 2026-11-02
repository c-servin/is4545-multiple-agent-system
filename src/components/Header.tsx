import React from 'react';
import {
  Activity,
  Moon,
  Sun,
  Database,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { RunMode } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  runMode: RunMode;
  setRunMode: (mode: RunMode) => void;
  onOpenDataModal: () => void;
  onStartWorkflow: () => void;
  onResetWorkflow: () => void;
  isRunning: boolean;
  hasCompleted: boolean;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  runMode,
  setRunMode,
  onOpenDataModal,
  onStartWorkflow,
  onResetWorkflow,
  isRunning,
  hasCompleted,
  totalRecords,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Hospital Patient Experience
            </h1>
            <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
              6-Agent Intelligence System
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation & Mode Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setRunMode('auto')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                runMode === 'auto'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto Run
            </button>
            <button
              onClick={() => setRunMode('step_by_step')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                runMode === 'step_by_step'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Step-by-Step Review
            </button>
          </div>

          {/* Dataset button */}
          <button
            onClick={onOpenDataModal}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Database className="w-3.5 h-3.5 text-teal-500" />
            <span>Dataset ({totalRecords} records)</span>
          </button>
        </div>

        {/* Zone 3: Workflow Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Reset button if completed */}
          {hasCompleted && !isRunning && (
            <button
              onClick={onResetWorkflow}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onStartWorkflow}
            disabled={isRunning}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              isRunning
                ? 'bg-amber-500 text-white cursor-wait animate-pulse'
                : hasCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/25 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : hasCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Rerun Intelligence</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Agent Team</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
