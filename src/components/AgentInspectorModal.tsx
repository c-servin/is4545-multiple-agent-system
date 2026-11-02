import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Code2,
  FileText,
  Database,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { AgentId, AgentWorkflowState } from '../types';
import { AGENT_PROMPTS } from '../services/agentApi';

interface AgentInspectorModalProps {
  agentId: AgentId | null;
  onClose: () => void;
  workflowState: AgentWorkflowState;
  onRerunAgent?: (agentId: AgentId) => void;
  inputDataSnippet?: any;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({
  agentId,
  onClose,
  workflowState,
  onRerunAgent,
  inputDataSnippet,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'json' | 'input'>('cards');
  const [copied, setCopied] = useState(false);

  if (!agentId) return null;

  const agentState = workflowState[agentId];
  const promptMeta = AGENT_PROMPTS[agentId];
  const result = agentState?.result;

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderResultCards = () => {
    if (!result) {
      return (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">This agent has not executed yet or has no generated outputs.</p>
          {agentState?.error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-left">
              <p className="text-xs font-bold text-red-700 dark:text-red-400">Execution Error:</p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1 font-mono">{agentState.error}</p>
            </div>
          )}
        </div>
      );
    }

    if (agentId === 'agent4_plan') {
      const plan = result as any;
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 mb-1">
              Restated Goal
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{plan.goal}</p>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assigned Specialist Tasks
          </h4>
          <div className="space-y-2.5">
            {plan.agents?.map((a: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{a.agent}</span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      a.run
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {a.run ? 'Active' : 'Skipped'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Task: </span>
                  {a.task}
                </p>
                {a.reason && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-semibold">Reasoning: </span>
                    {a.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (agentId === 'agent1') {
      const fb = result as any;
      return (
        <div className="space-y-4">
          {fb.summary && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-1">
                Executive Synthesis
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200">{fb.summary}</p>
            </div>
          )}

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Distinct Comment Theme & Sentiment Breakdown
          </h4>
          <div className="space-y-3">
            {fb.comments?.map((c: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Theme: {c.theme}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        c.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : c.sentiment === 'Negative'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}
                    >
                      {c.sentiment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Reasoning: </span>
                  {c.reasoning}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Operational Issue: </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.operational_issue}</p>
                  </div>
                  <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Risk / Bias Concern: </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.risk_or_bias_concern}</p>
                  </div>
                </div>

                <div className="p-2 rounded bg-teal-50 dark:bg-teal-950/30 text-xs text-teal-800 dark:text-teal-300">
                  <span className="font-semibold">Recommended Action: </span>
                  {c.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (agentId === 'agent2') {
      const mon = result as any;
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">
              Primary Managerial Recommendation
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200">{mon.recommendation}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Demographic & Service Line Patterns
            </h4>
            <div className="space-y-2">
              {mon.patterns?.map((p: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">{p.pattern}</p>
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{p.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Healthcare Equity & Accessibility Review
            </h4>
            <div className="space-y-2">
              {mon.equity_concerns?.map((e: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300">{e.group}</span>
                  <p className="text-slate-700 dark:text-slate-200 mt-0.5">{e.concern}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 italic text-[11px]">{e.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(mon.risk || {}).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  {key.replace('_', ' ')}
                </span>
                <span
                  className={`text-xs font-extrabold ${
                    val === 'High'
                      ? 'text-red-600 dark:text-red-400'
                      : val === 'Moderate'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (agentId === 'agent3') {
      const tri = result as any;
      return (
        <div className="space-y-4">
          {tri.summary && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300 mb-1">
                Triage Overview
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200">{tri.summary}</p>
            </div>
          )}

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Triaged Complaints & Escalation Paths
          </h4>
          <div className="space-y-3">
            {tri.complaints?.map((c: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    {c.id} · {c.primary_category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        c.severity_level >= 3
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                          : c.severity_level === 2
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      Severity Level {c.severity_level}
                    </span>
                    {c.human_review_required && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white animate-pulse">
                        HUMAN REVIEW REQUIRED
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Reasoning: </span>
                  {c.severity_reasoning}
                </p>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Escalation Route:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{c.route_to}</span>
                </div>

                {c.human_review_required && (
                  <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                    <span className="font-bold">Human Review Trigger: </span>
                    {c.human_review_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (agentId === 'agent6') {
      const comm = result as any;
      return (
        <div className="space-y-4">
          {comm.improved_patient_message && (
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-600" />
                  Improved Patient Message (6th-Grade Reading Level)
                </h4>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                  ≤ 80 words
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-cyan-100 dark:border-cyan-900/60 leading-relaxed italic">
                "{comm.improved_patient_message}"
              </p>
            </div>
          )}

          {comm.executive_summary && (
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <p>
                <span className="font-bold text-slate-500 dark:text-slate-400">Overall Quality: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{comm.executive_summary.overall_quality}</span>
              </p>
              <p>
                <span className="font-bold text-slate-500 dark:text-slate-400">Major Weakness: </span>
                <span className="text-slate-700 dark:text-slate-300">{comm.executive_summary.major_weaknesses}</span>
              </p>
              <p>
                <span className="font-bold text-red-600 dark:text-red-400">Highest Risk: </span>
                <span className="text-slate-700 dark:text-slate-300">{comm.executive_summary.highest_risk}</span>
              </p>
            </div>
          )}

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Communication Dimension Scores
          </h4>
          <div className="space-y-2">
            {comm.evaluations?.map((e: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{e.id} · {e.purpose}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                    Risk: {e.risk}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-center pt-1 border-t border-slate-100 dark:border-slate-800">
                  {Object.entries(e.scores || {}).map(([dim, score]) => (
                    <div key={dim} className="p-1 rounded bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block truncate">{dim}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{String(score)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (agentId === 'agent5') {
      const an = result as any;
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
              Executive Overview Headline
            </h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{an.headline}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Top 5 Organizational Priorities
            </h4>
            <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-800 dark:text-slate-200 font-medium">
              {an.top_priorities?.map((p: string, idx: number) => (
                <li key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-800/80">
                  {p}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20">
              <h5 className="font-bold text-teal-800 dark:text-teal-300 mb-1">Quick Wins (&lt; 3 Months)</h5>
              <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 text-[11px]">
                {an.quick_wins?.map((q: string, idx: number) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg border border-violet-200 dark:border-violet-900 bg-violet-50/40 dark:bg-violet-950/20">
              <h5 className="font-bold text-violet-800 dark:text-violet-300 mb-1">Long-term AI Opportunities (6-12 Mo)</h5>
              <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 text-[11px]">
                {an.long_term_ai_opportunities?.map((l: string, idx: number) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if (agentId === 'agent4_decision') {
      const dec = result as any;
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              Top Management Alert
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{dec.top_alert}</p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <h5 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
              Answer to Manager's Question
            </h5>
            <p className="text-slate-800 dark:text-slate-200 text-sm">{dec.answer}</p>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recommended Management Directives
          </h4>
          <div className="space-y-2">
            {dec.recommended_actions?.map((act: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{act.action}</p>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1">
                  <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{act.owner}</strong></span>
                  <span>Timeframe: <strong className="text-teal-600 dark:text-teal-400">{act.timeframe}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {promptMeta?.title || agentId}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  agentState?.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : agentState?.status === 'running'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {agentState?.status || 'pending'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Healthcare AI Agent Inspector & Telemetry Log
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onRerunAgent && (
              <button
                onClick={() => onRerunAgent(agentId)}
                title="Rerun this agent"
                className="p-1.5 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'cards'
                  ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Structured Findings
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw JSON
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'input'
                  ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Received Input Payload
            </button>
          </div>

          {activeTab === 'json' && result && (
            <button
              onClick={copyToClipboard}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[calc(90vh-140px)]">
          {activeTab === 'cards' && renderResultCards()}

          {activeTab === 'json' && (
            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
              <pre>{result ? JSON.stringify(result, null, 2) : '// No agent output generated yet'}</pre>
            </div>
          )}

          {activeTab === 'input' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">System Instruction Prompt:</span>
                <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {promptMeta?.systemInstruction}
                </p>
              </div>

              {inputDataSnippet && (
                <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
                  <span className="text-slate-400 block mb-2 font-bold">// Feeding Data Payload to Agent:</span>
                  <pre>{JSON.stringify(inputDataSnippet, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
