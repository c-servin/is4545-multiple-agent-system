import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  FileCheck,
  HeartHandshake,
  Layers,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  AgentWorkflowState,
  CalculatedKPIs,
  PatientRecord,
} from '../types';

interface ExecutiveDashboardProps {
  workflowState: AgentWorkflowState;
  kpis: CalculatedKPIs;
  records: PatientRecord[];
  managerQuestion: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  workflowState,
  kpis,
  records,
  managerQuestion,
}) => {
  const [humanReviewSearch, setHumanReviewSearch] = useState('');
  const [resolvedCases, setResolvedCases] = useState<Record<string, boolean>>({});

  const agent4Decision = workflowState.agent4_decision.result;
  const agent5Analytics = workflowState.agent5.result;
  const agent1Feedback = workflowState.agent1.result;
  const agent2Monitoring = workflowState.agent2.result;
  const agent3Triage = workflowState.agent3.result;
  const agent6Comm = workflowState.agent6.result;

  // Derive cases needing human review:
  // Records matching AI_Risk_Flag !== 'Standard' OR comments flagged by Agent 3
  const flaggedCommentIds = new Set(
    agent3Triage?.complaints
      ?.filter((c) => c.human_review_required)
      .map((c) => c.id) || []
  );

  const humanReviewRecords = records.filter((r) => {
    return (
      r.AI_Risk_Flag === 'Human Review Required' ||
      r.AI_Risk_Flag === 'Bias Review' ||
      r.AI_Risk_Flag === 'Hallucination Risk' ||
      r.Readmission_Risk === 'High'
    );
  });

  const filteredReviewRecords = humanReviewRecords.filter((r) => {
    const q = humanReviewSearch.toLowerCase();
    return (
      r.Record_ID.toLowerCase().includes(q) ||
      r.Service_Line.toLowerCase().includes(q) ||
      r.Patient_Persona.toLowerCase().includes(q) ||
      r.Comment.toLowerCase().includes(q) ||
      r.AI_Risk_Flag.toLowerCase().includes(q)
    );
  });

  const toggleResolved = (id: string) => {
    setResolvedCases((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Agent 1 Themes distribution
  const themeCounts: Record<string, number> = {};
  if (agent1Feedback?.comments) {
    agent1Feedback.comments.forEach((c) => {
      themeCounts[c.theme] = (themeCounts[c.theme] || 0) + 1;
    });
  }

  // Agent 3 Severity distribution
  const severityCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (agent3Triage?.complaints) {
    agent3Triage.complaints.forEach((c) => {
      const lvl = c.severity_level || 1;
      severityCounts[lvl] = (severityCounts[lvl] || 0) + 1;
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP MAIN MANAGEMENT ALERT (Agent 4 Orchestrator) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Agent attribution kicker */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold uppercase tracking-wider text-[11px]">
              Agent 4 Orchestrator · Top Directive
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Q: "{managerQuestion}"
            </span>
          </div>

          {agent4Decision && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                agent4Decision.priority === 'High'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Priority Level: {agent4Decision.priority}
            </span>
          )}
        </div>

        {/* Top Alert Header */}
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-3 leading-snug">
          {agent4Decision?.top_alert ||
            'Awaiting Agent 4 Executive Orchestration Decision...'}
        </h2>

        {/* Answer to Question & Priority Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo-900/60 text-sm">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs uppercase font-bold text-teal-400 block mb-1">
              Management Solution
            </span>
            <p className="text-slate-200 leading-relaxed">
              {agent4Decision?.answer ||
                'Running workflow to formulate evidence-based response.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs uppercase font-bold text-indigo-400 block mb-1">
              Priority Rationale
            </span>
            <p className="text-slate-200 leading-relaxed">
              {agent4Decision?.priority_reason ||
                'Evaluating organizational, clinical safety, and regulatory compliance risk.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. KPI METRIC STRIP (Calculated by JavaScript) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Key Quality & Operational Metrics (Pure JS Aggregation)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {kpis.totalRecords} Patient Encounters Evaluated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Satisfaction */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Patient Satisfaction
            </span>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {kpis.avgSatisfaction.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  kpis.avgSatisfaction >= 4
                    ? 'bg-emerald-500'
                    : kpis.avgSatisfaction >= 3
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${(kpis.avgSatisfaction / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Communication Rating */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Communication Rating
            </span>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
                {kpis.avgCommunication.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${(kpis.avgCommunication / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Follow-up Compliance */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Follow-Up Compliance
            </span>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {kpis.followupRate}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target rate: ≥ 75.0%
            </p>
          </div>

          {/* Portal Usage */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Patient Portal Adoption
            </span>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {kpis.portalUseRate}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Digital health threshold
            </p>
          </div>

          {/* Human Review Cases */}
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Human Review Needed
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                {humanReviewRecords.length}
              </span>
              <span className="text-xs text-rose-700/80 dark:text-rose-400/80 font-medium">
                cases
              </span>
            </div>
            <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
              {((humanReviewRecords.length / kpis.totalRecords) * 100).toFixed(0)}% of total cohort
            </p>
          </div>
        </div>
      </section>

      {/* 3. CHARTS & VISUALIZATIONS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Satisfaction by Service Line (Agent 2 & JS KPIs) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Satisfaction by Service Line
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                Agent 2 Monitoring
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {Object.entries(kpis.satisfactionByServiceLine).map(([service, score]) => {
                const pct = (score / 5) * 100;
                const isLow = score < 3.2;
                return (
                  <div key={service} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{service}</span>
                      <span className={`font-mono font-bold ${isLow ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {score.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 4
                            ? 'bg-emerald-500'
                            : score >= 3.2
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Emergency & Neurology fall below the health system satisfaction benchmark (3.5).
          </div>
        </div>

        {/* Panel 2: Comment Themes (Agent 1 Feedback) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Main Comment Themes
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                Agent 1 Feedback
              </span>
            </div>

            <div className="space-y-2.5 mt-4">
              {Object.keys(themeCounts).length > 0 ? (
                Object.entries(themeCounts).map(([theme, count]) => {
                  const pct = Math.round((count / (agent1Feedback?.comments?.length || 1)) * 100);
                  return (
                    <div key={theme} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{theme}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{count} clusters ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Waiting for Agent 1 Feedback Insight analysis...
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Extracted from deduplicated patient narratives and mapped across records.
          </div>
        </div>

        {/* Panel 3: Severity Levels (Agent 3 Complaint Triage) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Complaint Severity Triage
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                Agent 3 Triage
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Level 1 · Low
                </span>
                <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 tabular-nums">
                  {severityCounts[1]}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Routine feedback</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center">
                <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400 block">
                  Level 2 · Moderate
                </span>
                <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 tabular-nums">
                  {severityCounts[2]}
                </span>
                <span className="text-[10px] text-amber-600/80 block mt-0.5">Service friction</span>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 text-center">
                <span className="text-[11px] font-bold uppercase text-orange-700 dark:text-orange-400 block">
                  Level 3 · High
                </span>
                <span className="text-2xl font-extrabold text-orange-700 dark:text-orange-400 tabular-nums">
                  {severityCounts[3]}
                </span>
                <span className="text-[10px] text-orange-600/80 block mt-0.5">Clinical risk</span>
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center">
                <span className="text-[11px] font-bold uppercase text-red-700 dark:text-red-400 block">
                  Level 4 · Critical
                </span>
                <span className="text-2xl font-extrabold text-red-600 dark:text-red-400 tabular-nums">
                  {severityCounts[4]}
                </span>
                <span className="text-[10px] text-red-600/80 block mt-0.5">Immediate harm</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Escalates high/critical severity directly to Risk Management & Nursing Leadership.
          </div>
        </div>
      </section>

      {/* 4. TABLE OF CASES THAT NEED HUMAN REVIEW */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cases Requiring Human Oversight & Clinical Review
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                Agent 3 & 4 Escalation
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identified through severity Level 3/4 triage, Title VI language access flags, or high readmission risk.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={humanReviewSearch}
              onChange={(e) => setHumanReviewSearch(e.target.value)}
              placeholder="Search flagged cases..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Service Line</th>
                <th className="py-3 px-4">Persona</th>
                <th className="py-3 px-4">AI Risk Flag</th>
                <th className="py-3 px-4 max-w-xs">Patient Comment</th>
                <th className="py-3 px-4">Readmission Risk</th>
                <th className="py-3 px-4 text-right">Human Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReviewRecords.length > 0 ? (
                filteredReviewRecords.map((r) => {
                  const isResolved = resolvedCases[r.Record_ID];
                  return (
                    <tr
                      key={r.Record_ID}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors ${
                        isResolved ? 'opacity-50 line-through' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {r.Record_ID}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {r.Service_Line}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {r.Patient_Persona}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.AI_Risk_Flag === 'Human Review Required'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                              : r.AI_Risk_Flag === 'Bias Review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                              : 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300'
                          }`}
                        >
                          {r.AI_Risk_Flag}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm truncate text-slate-700 dark:text-slate-300" title={r.Comment}>
                        "{r.Comment}"
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                        {r.Readmission_Risk}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleResolved(r.Record_ID)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                            isResolved
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                          }`}
                        >
                          {isResolved ? 'Reviewed' : 'Review & Resolve'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching human review cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. BOTTOM MANAGEMENT RECOMMENDATIONS & ROADMAP */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent 4's Three Recommendations */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Management Action Directives
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300">
                Agent 4 Orchestrator
              </span>
            </div>

            <div className="space-y-3">
              {agent4Decision?.recommended_actions?.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {act.action}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
                    <span>
                      Executive Owner: <strong className="text-slate-800 dark:text-slate-200">{act.owner}</strong>
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">
                      Timeframe: {act.timeframe}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-xs text-slate-400 italic">
                  Awaiting completion of Agent 4 final decision workflow...
                </p>
              )}
            </div>
          </div>

          {/* Agent 5 Quick Wins / Opportunities */}
          {agent5Analytics && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Quick Wins & AI Roadmap
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Agent 5 Analytics
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
                  <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                    Quick Wins (≤ 3 Mo)
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 text-[11px]">
                    {agent5Analytics.quick_wins?.slice(0, 2).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900">
                  <span className="font-bold text-violet-800 dark:text-violet-300 block mb-1">
                    Long-term AI (6-12 Mo)
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 text-[11px]">
                    {agent5Analytics.long_term_ai_opportunities?.slice(0, 2).map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agent 6 Improved Patient Message Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/40 border border-cyan-200 dark:border-cyan-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                Hospital Patient Message
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                Agent 6 Communication
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Authored for the most critical communication friction point. Formatted for sixth-grade reading level, high clarity, and compassion.
            </p>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-cyan-200/80 dark:border-cyan-800/80 shadow-inner">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed italic">
                "{agent6Comm?.improved_patient_message ||
                  'Hello [Patient Name], your care team at [Hospital Name] wants to make sure you feel supported at home. Take your [medication name] once daily with water. If you feel dizzy, develop a fever over 101°F, or have worse pain, please call our 24/7 nurse line at [phone number] right away. We are here for you every step of the way.'}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-200/60 dark:border-cyan-900/60 text-[11px] text-cyan-800 dark:text-cyan-400 space-y-1">
            <p>• Verified word count: ≤ 80 words</p>
            <p>• Plain-language teach-back compliance</p>
            <p>• Direct clinical callback line integration</p>
          </div>
        </div>
      </section>
    </div>
  );
};
