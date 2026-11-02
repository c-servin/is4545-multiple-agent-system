import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sliders,
  Check,
  Edit3,
} from 'lucide-react';
import {
  AgentWorkflowState,
  AgentId,
  WorkflowStep,
  PlannedAgent,
} from '../types';

interface StepReviewBarProps {
  currentStep: WorkflowStep;
  workflowState: AgentWorkflowState;
  plannedAgents: PlannedAgent[];
  onTogglePlannedAgent: (index: number) => void;
  onEditPlannedTask: (index: number, newTask: string) => void;
  onApproveAndContinue: () => void;
  onRerunAgent: (agentId: AgentId) => void;
  isRunning: boolean;
}

export const StepReviewBar: React.FC<StepReviewBarProps> = ({
  currentStep,
  workflowState,
  plannedAgents,
  onTogglePlannedAgent,
  onEditPlannedTask,
  onApproveAndContinue,
  onRerunAgent,
  isRunning,
}) => {
  if (currentStep === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 p-5 shadow-lg shadow-teal-500/5 transition-all">
      {/* Top Header of Step Review */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            {currentStep}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Step-by-Step Review Gate</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                Step {currentStep} of 4
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentStep === 1 && 'Agent 4 created the execution plan. Review, toggle specialists on/off, or adjust assigned tasks before running.'}
              {currentStep === 2 && 'Specialist agents completed concurrent analysis. Review results or rerun any agent before analytics synthesis.'}
              {currentStep === 3 && 'Agent 5 synthesized executive analytics. Review dashboard insights before final decision authorization.'}
              {currentStep === 4 && 'Agent 4 delivered final management directives and escalation review list.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {currentStep < 4 && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onApproveAndContinue}
              disabled={isRunning}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-500 cursor-wait'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-teal-500/25 active:scale-95'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Executing Step {currentStep + 1}...</span>
                </>
              ) : (
                <>
                  <span>Approve & Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Step 1 Specific: Specialist Agent Toggles & Task Editor */}
      {currentStep === 1 && plannedAgents.length > 0 && (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Specialist Dispatch Plan (Editable)
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Toggle switch to skip or run an agent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plannedAgents.map((plan, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  plan.run
                    ? 'border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {plan.agent}
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.run}
                      onChange={() => onTogglePlannedAgent(idx)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300"
                    />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {plan.run ? 'Include' : 'Skip'}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={plan.task}
                    onChange={(e) => onEditPlannedTask(idx, e.target.value)}
                    placeholder="Assigned task description..."
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 or 3 Specific: Rerun buttons for individual agents */}
      {(currentStep === 2 || currentStep === 3) && (
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>All results have been computed. If any agent output appears anomalous, select re-run:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentStep === 2 && (
              <>
                <button
                  onClick={() => onRerunAgent('agent1')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-rose-500" />
                  Rerun Agent 1
                </button>
                <button
                  onClick={() => onRerunAgent('agent2')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-amber-500" />
                  Rerun Agent 2
                </button>
                <button
                  onClick={() => onRerunAgent('agent3')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-red-500" />
                  Rerun Agent 3
                </button>
                <button
                  onClick={() => onRerunAgent('agent6')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-cyan-500" />
                  Rerun Agent 6
                </button>
              </>
            )}

            {currentStep === 3 && (
              <button
                onClick={() => onRerunAgent('agent5')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-emerald-500" />
                Rerun Agent 5 Analytics
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
