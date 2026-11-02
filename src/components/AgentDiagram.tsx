import React, { useRef, useState, useEffect } from 'react';
import {
  Brain,
  MessageSquareText,
  TrendingUp,
  AlertOctagon,
  FileText,
  BarChart2,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { AgentId, AgentStatus, AgentWorkflowState, WorkflowStep } from '../types';

interface AgentDiagramProps {
  workflowState: AgentWorkflowState;
  currentStep: WorkflowStep;
  activeAgentId: AgentId | null;
  onSelectAgent: (agentId: AgentId) => void;
  onRerunAgent?: (agentId: AgentId) => void;
  isStepReviewMode: boolean;
  activeDataFlow: 'none' | '4_to_specialists' | 'specialists_to_5' | '5_to_4';
}

interface AgentMeta {
  id: AgentId;
  number: string;
  name: string;
  role: string;
  colorName: string;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AGENTS_META: Record<AgentId, AgentMeta> = {
  agent4_plan: {
    id: 'agent4_plan',
    number: '01 & 04',
    name: 'Agent 4: Orchestrator',
    role: 'Plan Assignment & Executive Decision',
    colorName: 'violet',
    themeColor: '#8b5cf6',
    accentBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    borderColor: 'border-violet-300 dark:border-violet-700',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    icon: Brain,
  },
  agent1: {
    id: 'agent1',
    number: '02',
    name: 'Agent 1: Feedback Insight',
    role: 'Theme, Sentiment & Operational Root Causes',
    colorName: 'rose',
    themeColor: '#f43f5e',
    accentBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-300 dark:border-rose-700',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    icon: MessageSquareText,
  },
  agent2: {
    id: 'agent2',
    number: '02',
    name: 'Agent 2: Experience Monitoring',
    role: 'Macro Trends, Equity & Disparity Detection',
    colorName: 'amber',
    themeColor: '#f59e0b',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    icon: TrendingUp,
  },
  agent3: {
    id: 'agent3',
    number: '02',
    name: 'Agent 3: Complaint Triage',
    role: 'Clinical Severity (L1-L4) & Human Review',
    colorName: 'crimson',
    themeColor: '#ef4444',
    accentBg: 'bg-red-500/10 dark:bg-red-500/20',
    borderColor: 'border-red-300 dark:border-red-700',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    icon: AlertOctagon,
  },
  agent6: {
    id: 'agent6',
    number: '02',
    name: 'Agent 6: Communication Quality',
    role: 'Health Literacy, Tone & 6th-Grade Message',
    colorName: 'cyan',
    themeColor: '#06b6d4',
    accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    borderColor: 'border-cyan-300 dark:border-cyan-700',
    badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    icon: FileText,
  },
  agent5: {
    id: 'agent5',
    number: '03',
    name: 'Agent 5: Healthcare Analytics',
    role: 'Multi-Agent Synthesis & Executive Dashboards',
    colorName: 'emerald',
    themeColor: '#10b981',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    icon: BarChart2,
  },
  agent4_decision: {
    id: 'agent4_decision',
    number: '04',
    name: 'Agent 4: Final Decision',
    role: 'Executive Directives & Escalation Routing',
    colorName: 'violet',
    themeColor: '#8b5cf6',
    accentBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    borderColor: 'border-violet-300 dark:border-violet-700',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    icon: Brain,
  },
};

export const AgentDiagram: React.FC<AgentDiagramProps> = ({
  workflowState,
  activeAgentId,
  onSelectAgent,
  activeDataFlow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lineCoords, setLineCoords] = useState<{
    toSpecialists: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>;
    toAnalytics: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>;
    analyticsToOrchestrator: { x1: number; y1: number; x2: number; y2: number; cx1: number; cy1: number; cx2: number; cy2: number } | null;
  }>({
    toSpecialists: [],
    toAnalytics: [],
    analyticsToOrchestrator: null,
  });

  // Calculate live connection coordinates between agent boxes
  const updateConnections = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const getCenter = (el: HTMLElement | null, side: 'top' | 'bottom' | 'right' | 'left') => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const relativeX = rect.left - containerRect.left;
      const relativeY = rect.top - containerRect.top;

      switch (side) {
        case 'top':
          return { x: relativeX + rect.width / 2, y: relativeY };
        case 'bottom':
          return { x: relativeX + rect.width / 2, y: relativeY + rect.height };
        case 'right':
          return { x: relativeX + rect.width, y: relativeY + rect.height / 2 };
        case 'left':
          return { x: relativeX, y: relativeY + rect.height / 2 };
      }
    };

    const orchestratorEl = cardRefs.current['agent4_plan'];
    const analyticsEl = cardRefs.current['agent5'];

    const orchBottom = getCenter(orchestratorEl, 'bottom');
    const analyticsTop = getCenter(analyticsEl, 'top');
    const analyticsRight = getCenter(analyticsEl, 'right');
    const orchRight = getCenter(orchestratorEl, 'right');

    const specialists: AgentId[] = ['agent1', 'agent2', 'agent3', 'agent6'];

    const toSpecialists = specialists.map((id) => {
      const specEl = cardRefs.current[id];
      const specTop = getCenter(specEl, 'top');
      return {
        id,
        x1: orchBottom.x,
        y1: orchBottom.y,
        x2: specTop.x,
        y2: specTop.y,
      };
    });

    const toAnalytics = specialists.map((id) => {
      const specEl = cardRefs.current[id];
      const specBottom = getCenter(specEl, 'bottom');
      return {
        id,
        x1: specBottom.x,
        y1: specBottom.y,
        x2: analyticsTop.x,
        y2: analyticsTop.y,
      };
    });

    // Elegant loop back up to Agent 4 on the right flank
    let analyticsToOrchestrator = null;
    if (analyticsEl && orchestratorEl) {
      analyticsToOrchestrator = {
        x1: analyticsRight.x,
        y1: analyticsRight.y,
        x2: orchRight.x,
        y2: orchRight.y,
        cx1: Math.max(analyticsRight.x, orchRight.x) + 70,
        cy1: analyticsRight.y + 10,
        cx2: Math.max(analyticsRight.x, orchRight.x) + 70,
        cy2: orchRight.y - 10,
      };
    }

    setLineCoords({
      toSpecialists,
      toAnalytics,
      analyticsToOrchestrator,
    });
  };

  useEffect(() => {
    updateConnections();
    window.addEventListener('resize', updateConnections);
    const timeout = setTimeout(updateConnections, 200);
    return () => {
      window.removeEventListener('resize', updateConnections);
      clearTimeout(timeout);
    };
  }, [workflowState]);

  const renderStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'waiting_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
            <Eye className="w-3 h-3" />
            Review Needed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Skipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const renderAgentBox = (agentId: AgentId) => {
    const meta = AGENTS_META[agentId];
    const state = workflowState[agentId];
    const isRunning = state.status === 'running' || activeAgentId === agentId;
    const isCompleted = state.status === 'completed';
    const isFailed = state.status === 'failed';
    const Icon = meta.icon;

    // Quick result snippet
    let resultPreview = '';
    if (isCompleted && state.result) {
      if (agentId === 'agent4_plan') {
        const plan = state.result as any;
        const activeCount = plan.agents?.filter((a: any) => a.run).length ?? 4;
        resultPreview = `Assigned ${activeCount} active specialist agents`;
      } else if (agentId === 'agent1') {
        const f = state.result as any;
        resultPreview = `Analyzed ${f.comments?.length || 0} comment clusters`;
      } else if (agentId === 'agent2') {
        const m = state.result as any;
        resultPreview = `Detected ${m.patterns?.length || 0} equity patterns`;
      } else if (agentId === 'agent3') {
        const t = state.result as any;
        const flagged = t.complaints?.filter((c: any) => c.human_review_required).length || 0;
        resultPreview = `${flagged} cases flagged for human review`;
      } else if (agentId === 'agent6') {
        const c = state.result as any;
        resultPreview = `Authored 6th-grade improved message`;
      } else if (agentId === 'agent5') {
        const a = state.result as any;
        resultPreview = `Synthesized ${a.top_priorities?.length || 5} leadership priorities`;
      } else if (agentId === 'agent4_decision') {
        const d = state.result as any;
        resultPreview = `Priority ${d.priority || 'High'} · 3 Directives`;
      }
    }

    return (
      <div
        key={agentId}
        ref={(el) => {
          cardRefs.current[agentId] = el;
        }}
        onClick={() => onSelectAgent(agentId)}
        style={{
          boxShadow: isRunning ? `0 0 25px ${meta.glowColor}` : undefined,
        }}
        className={`relative z-10 p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left bg-white dark:bg-slate-900 group hover:-translate-y-1 hover:shadow-lg ${
          isRunning
            ? `ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 ${meta.borderColor} agent-active-glow`
            : isCompleted
            ? 'border-emerald-300 dark:border-emerald-700/80 shadow-sm'
            : isFailed
            ? 'border-red-300 dark:border-red-700 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Dynamic active task radar ring */}
        {isRunning && (
          <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
            <span className="relative flex h-3.5 w-3.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: meta.themeColor }}
              />
              <span
                className="relative inline-flex rounded-full h-3.5 w-3.5"
                style={{ backgroundColor: meta.themeColor }}
              />
            </span>
          </div>
        )}

        {/* Top Header: Step number + Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            STEP {meta.number}
          </span>
          {renderStatusBadge(state.status)}
        </div>

        {/* Agent identity */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${meta.accentBg}`}
            style={{ color: meta.themeColor }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {meta.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
              {meta.role}
            </p>
          </div>
        </div>

        {/* Preview / Result or action clue */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {resultPreview ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{resultPreview}</span>
            </span>
          ) : isRunning ? (
            <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>Processing data...</span>
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1">
              <span>Inspect Agent</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900 p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      {/* Dynamic Animated SVG Arrow Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="flowGradOrchToSpec" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="flowGradSpecToAnalytics" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="flowGradAnalyticsToOrch" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Arrow markers */}
          <marker id="arrow-neutral" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-active-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#0d9488" />
          </marker>
          <marker id="arrow-active-violet" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#8b5cf6" />
          </marker>
          <marker id="arrow-active-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        {/* 1. Downward arrows from Agent 4 (Orchestrator) to 4 Specialists */}
        {lineCoords.toSpecialists.map((line) => {
          const isFlowActive =
            activeDataFlow === '4_to_specialists' ||
            workflowState[line.id as AgentId]?.status === 'running';
          const isCompleted = workflowState[line.id as AgentId]?.status === 'completed';

          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const pathD = `M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + dy * 0.5}, ${line.x2} ${line.y2 - dy * 0.5}, ${line.x2} ${line.y2}`;

          return (
            <g key={`orch-to-${line.id}`}>
              {/* Neutral baseline track */}
              <path
                d={pathD}
                fill="none"
                stroke={isCompleted ? '#cbd5e1' : '#e2e8f0'}
                strokeWidth={isCompleted ? '2' : '1.5'}
                className="dark:stroke-slate-800 transition-colors duration-300"
                markerEnd="url(#arrow-neutral)"
              />
              {/* Active flowing arrow stream */}
              {isFlowActive && (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#flowGradOrchToSpec)"
                    strokeWidth="3.5"
                    filter="url(#glow)"
                    className="animate-dash-flow"
                    markerEnd="url(#arrow-active-teal)"
                  />
                  <circle r="4" fill="#14b8a6">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={pathD} />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* 2. Downward arrows from 4 Specialists to Agent 5 (Analytics) */}
        {lineCoords.toAnalytics.map((line) => {
          const isFlowActive =
            activeDataFlow === 'specialists_to_5' ||
            workflowState['agent5']?.status === 'running';
          const isCompleted = workflowState['agent5']?.status === 'completed';

          const dy = line.y2 - line.y1;
          const pathD = `M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + dy * 0.5}, ${line.x2} ${line.y2 - dy * 0.5}, ${line.x2} ${line.y2}`;

          return (
            <g key={`spec-to-5-${line.id}`}>
              {/* Neutral baseline track */}
              <path
                d={pathD}
                fill="none"
                stroke={isCompleted ? '#cbd5e1' : '#e2e8f0'}
                strokeWidth={isCompleted ? '2' : '1.5'}
                className="dark:stroke-slate-800 transition-colors duration-300"
                markerEnd="url(#arrow-neutral)"
              />
              {/* Active flowing stream */}
              {isFlowActive && (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#flowGradSpecToAnalytics)"
                    strokeWidth="3.5"
                    filter="url(#glow)"
                    className="animate-dash-flow"
                    markerEnd="url(#arrow-active-emerald)"
                  />
                  <circle r="4" fill="#10b981">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={pathD} />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* 3. Loop Arrow from Agent 5 back up to Agent 4 (Final Decision) */}
        {lineCoords.analyticsToOrchestrator && (
          <g key="analytics-to-orch-loop">
            {(() => {
              const { x1, y1, x2, y2, cx1, cy1, cx2, cy2 } = lineCoords.analyticsToOrchestrator;
              const loopD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
              const isLoopActive =
                activeDataFlow === '5_to_4' ||
                workflowState['agent4_decision']?.status === 'running';
              const isDecisionDone = workflowState['agent4_decision']?.status === 'completed';

              return (
                <>
                  <path
                    d={loopD}
                    fill="none"
                    stroke={isDecisionDone ? '#c4b5fd' : '#e2e8f0'}
                    strokeWidth={isDecisionDone ? '2' : '1.5'}
                    strokeDasharray="4 4"
                    className="dark:stroke-slate-800 transition-colors duration-300"
                    markerEnd="url(#arrow-neutral)"
                  />
                  {isLoopActive && (
                    <>
                      <path
                        d={loopD}
                        fill="none"
                        stroke="url(#flowGradAnalyticsToOrch)"
                        strokeWidth="3.5"
                        filter="url(#glow)"
                        className="animate-dash-flow"
                        markerEnd="url(#arrow-active-violet)"
                      />
                      <circle r="4.5" fill="#8b5cf6">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path={loopD} />
                      </circle>
                    </>
                  )}
                </>
              );
            })()}
          </g>
        )}
      </svg>

      {/* Grid Content */}
      <div className="relative z-10 flex flex-col gap-10">
        {/* Tier 1: Agent 4 (Orchestrator) at the top */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {renderAgentBox('agent4_plan')}
          </div>
        </div>

        {/* Tier 2: The 4 Specialist Agents in the Middle Row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Specialist Intelligence Tier (Runs Concurrently)
            </span>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              Step 2 Execution
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderAgentBox('agent1')}
            {renderAgentBox('agent2')}
            {renderAgentBox('agent3')}
            {renderAgentBox('agent6')}
          </div>
        </div>

        {/* Tier 3: Agent 5 (Analytics) at the Bottom */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {renderAgentBox('agent5')}
          </div>
        </div>
      </div>
    </div>
  );
};
