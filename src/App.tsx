import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  Brain,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';
import {
  AgentId,
  AgentWorkflowState,
  CalculatedKPIs,
  PatientRecord,
  PlannedAgent,
  RunMode,
  WorkflowStep,
} from './types';
import {
  DEFAULT_PATIENT_RECORDS,
  extractDistinctComments,
} from './data/defaultData';
import { calculateKPIs } from './services/kpiCalculator';
import { AGENT_PROMPTS, callLLM } from './services/agentApi';
import { Header } from './components/Header';
import { AgentDiagram } from './components/AgentDiagram';
import { StepReviewBar } from './components/StepReviewBar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DataTableModal } from './components/DataTableModal';
import { AgentInspectorModal } from './components/AgentInspectorModal';

const INITIAL_WORKFLOW_STATE: AgentWorkflowState = {
  agent4_plan: { status: 'pending', result: null, error: null },
  agent1: { status: 'pending', result: null, error: null },
  agent2: { status: 'pending', result: null, error: null },
  agent3: { status: 'pending', result: null, error: null },
  agent6: { status: 'pending', result: null, error: null },
  agent5: { status: 'pending', result: null, error: null },
  agent4_decision: { status: 'pending', result: null, error: null },
};

const DEFAULT_QUESTION =
  'What should management fix first to improve patient experience, and which cases need human review?';

const PRESET_QUESTIONS = [
  'What should management fix first to improve patient experience, and which cases need human review?',
  'Why are Emergency Department satisfaction scores lagging, and what operational bottlenecks exist?',
  'Which patient groups face communication barriers or health equity disparities during hospital discharge?',
  'Identify technology and patient portal barriers impacting older adults and rural patients.',
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Dataset & Manager Question state
  const [records, setRecords] = useState<PatientRecord[]>(DEFAULT_PATIENT_RECORDS);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(
    () => new Set(DEFAULT_PATIENT_RECORDS.map((r) => r.Record_ID))
  );
  const [managerQuestion, setManagerQuestion] = useState(DEFAULT_QUESTION);

  // Workflow execution state
  const [runMode, setRunMode] = useState<RunMode>('step_by_step');
  const [workflowState, setWorkflowState] = useState<AgentWorkflowState>(INITIAL_WORKFLOW_STATE);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
  const [activeDataFlow, setActiveDataFlow] = useState<
    'none' | '4_to_specialists' | 'specialists_to_5' | '5_to_4'
  >('none');
  const [plannedAgents, setPlannedAgents] = useState<PlannedAgent[]>([]);

  // Modals state
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [inspectedAgentId, setInspectedAgentId] = useState<AgentId | null>(null);

  // Filtered active records according to user selection
  const activeRecords = useMemo(() => {
    return records.filter((r) => selectedRecordIds.has(r.Record_ID));
  }, [records, selectedRecordIds]);

  // KPIs calculated exclusively in pure JavaScript
  const kpis: CalculatedKPIs = useMemo(() => {
    return calculateKPIs(activeRecords);
  }, [activeRecords]);

  // Distinct comments extracted for agent batch processing
  const distinctComments = useMemo(() => {
    return extractDistinctComments(activeRecords);
  }, [activeRecords]);

  // Handle record selection toggling
  const handleToggleRecordSelection = (id: string) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedRecordIds(new Set(records.map((r) => r.Record_ID)));
    } else {
      setSelectedRecordIds(new Set());
    }
  };

  // Helper to update individual agent state
  const updateAgent = (
    id: AgentId,
    status: AgentWorkflowState[AgentId]['status'],
    result: any = null,
    error: string | null = null
  ) => {
    setWorkflowState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
        result: result !== null ? result : prev[id].result,
        error,
      },
    }));
  };

  /**
   * STEP 1: Agent 4 Orchestrator Plans
   */
  const runStep1Planning = async () => {
    setIsRunning(true);
    setActiveAgentId('agent4_plan');
    setActiveDataFlow('none');
    setCurrentStep(1);
    updateAgent('agent4_plan', 'running');

    const promptObj = AGENT_PROMPTS.agent4_plan;
    const inputPayload = {
      question: managerQuestion,
      available_columns: [
        'Record_ID',
        'Patient_Persona',
        'Age_Group',
        'Visit_Type',
        'Service_Line',
        'Year',
        'Patient_Satisfaction',
        'Communication_Rating',
        'Followup_Compliance',
        'Portal_Usage',
        'Readmission_Risk',
        'AI_Risk_Flag',
        'Comment',
      ],
      kpis,
    };

    const res = await callLLM('agent4_plan', promptObj.userPrompt, promptObj.systemInstruction, inputPayload);

    if (res.success && res.result) {
      updateAgent('agent4_plan', 'completed', res.result);
      const agents = res.result.agents || [];
      setPlannedAgents(agents);
    } else {
      updateAgent('agent4_plan', 'failed', null, res.error);
    }

    setIsRunning(false);
    setActiveAgentId(null);
  };

  /**
   * STEP 2: Specialist Agents (1, 2, 3, 6) Run in Parallel
   */
  const runStep2Specialists = async (currentPlans: PlannedAgent[] = plannedAgents) => {
    setIsRunning(true);
    setCurrentStep(2);
    setActiveDataFlow('4_to_specialists');

    // Identify which specialists are enabled in the plan
    const shouldRun1 = currentPlans.find((p) => p.agent.includes('1'))?.run ?? true;
    const shouldRun2 = currentPlans.find((p) => p.agent.includes('2'))?.run ?? true;
    const shouldRun3 = currentPlans.find((p) => p.agent.includes('3'))?.run ?? true;
    const shouldRun6 = currentPlans.find((p) => p.agent.includes('6'))?.run ?? true;

    if (shouldRun1) updateAgent('agent1', 'running');
    else updateAgent('agent1', 'skipped');

    if (shouldRun2) updateAgent('agent2', 'running');
    else updateAgent('agent2', 'skipped');

    if (shouldRun3) updateAgent('agent3', 'running');
    else updateAgent('agent3', 'skipped');

    if (shouldRun6) updateAgent('agent6', 'running');
    else updateAgent('agent6', 'skipped');

    // Prepare inputs tailored specifically for each specialist agent prompt
    const promises: Promise<any>[] = [];

    // Agent 1: Distinct patient comments with ID and count
    if (shouldRun1) {
      const p1 = AGENT_PROMPTS.agent1;
      const data1 = {
        comments: distinctComments.map((c) => ({
          id: c.id,
          text: c.text,
          records_count: c.count,
        })),
      };
      promises.push(
        callLLM('agent1', p1.userPrompt, p1.systemInstruction, data1).then((res) => {
          if (res.success) updateAgent('agent1', 'completed', res.result);
          else updateAgent('agent1', 'failed', null, res.error);
        })
      );
    }

    // Agent 2: Aggregate performance numbers calculated in JS grouped by persona, visit type, etc.
    if (shouldRun2) {
      const p2 = AGENT_PROMPTS.agent2;
      const data2 = {
        kpis,
      };
      promises.push(
        callLLM('agent2', p2.userPrompt, p2.systemInstruction, data2).then((res) => {
          if (res.success) updateAgent('agent2', 'completed', res.result);
          else updateAgent('agent2', 'failed', null, res.error);
        })
      );
    }

    // Agent 3: Distinct comments, counts, and AI_Risk_Flag distribution
    if (shouldRun3) {
      const p3 = AGENT_PROMPTS.agent3;
      const data3 = {
        comments: distinctComments.map((c) => ({
          id: c.id,
          text: c.text,
          records_count: c.count,
          ai_risk_flags: c.riskFlagCounts,
        })),
      };
      promises.push(
        callLLM('agent3', p3.userPrompt, p3.systemInstruction, data3).then((res) => {
          if (res.success) updateAgent('agent3', 'completed', res.result);
          else updateAgent('agent3', 'failed', null, res.error);
        })
      );
    }

    // Agent 6: Distinct comments, count, and average Communication_Rating
    if (shouldRun6) {
      const p6 = AGENT_PROMPTS.agent6;
      const data6 = {
        comments: distinctComments.map((c) => ({
          id: c.id,
          text: c.text,
          records_count: c.count,
          avg_communication_rating: c.avgCommunicationRating,
        })),
      };
      promises.push(
        callLLM('agent6', p6.userPrompt, p6.systemInstruction, data6).then((res) => {
          if (res.success) updateAgent('agent6', 'completed', res.result);
          else updateAgent('agent6', 'failed', null, res.error);
        })
      );
    }

    await Promise.all(promises);

    setIsRunning(false);
    setActiveAgentId(null);
  };

  /**
   * STEP 3: Agent 5 Analytics Combines All Specialist Results
   */
  const runStep3Analytics = async () => {
    setIsRunning(true);
    setCurrentStep(3);
    setActiveAgentId('agent5');
    setActiveDataFlow('specialists_to_5');
    updateAgent('agent5', 'running');

    const p5 = AGENT_PROMPTS.agent5;
    const inputPayload = {
      kpis,
      specialist_findings: {
        agent1_feedback: workflowState.agent1.result,
        agent2_monitoring: workflowState.agent2.result,
        agent3_complaint_triage: workflowState.agent3.result,
        agent6_communication: workflowState.agent6.result,
      },
    };

    const res = await callLLM('agent5', p5.userPrompt, p5.systemInstruction, inputPayload);

    if (res.success && res.result) {
      updateAgent('agent5', 'completed', res.result);
    } else {
      updateAgent('agent5', 'failed', null, res.error);
    }

    setIsRunning(false);
    setActiveAgentId(null);
  };

  /**
   * STEP 4: Agent 4 Final Decision
   */
  const runStep4Decision = async () => {
    setIsRunning(true);
    setCurrentStep(4);
    setActiveAgentId('agent4_decision');
    setActiveDataFlow('5_to_4');
    updateAgent('agent4_decision', 'running');

    // Extract flagged cases for human review from Agent 3
    const flaggedFromAgent3 =
      workflowState.agent3.result?.complaints
        ?.filter((c) => c.human_review_required)
        ?.map((c) => ({
          id: c.id,
          category: c.primary_category,
          severity: c.severity_level,
          reason: c.human_review_reason,
        })) || [];

    const p4 = AGENT_PROMPTS.agent4_decision;
    const inputPayload = {
      question: managerQuestion,
      plan: workflowState.agent4_plan.result,
      analytics: workflowState.agent5.result,
      kpis,
      human_review_candidates: flaggedFromAgent3,
    };

    const res = await callLLM('agent4_decision', p4.userPrompt, p4.systemInstruction, inputPayload);

    if (res.success && res.result) {
      updateAgent('agent4_decision', 'completed', res.result);
    } else {
      updateAgent('agent4_decision', 'failed', null, res.error);
    }

    setIsRunning(false);
    setActiveAgentId(null);
  };

  /**
   * Rerun a single isolated agent
   */
  const handleRerunIndividualAgent = async (agentId: AgentId) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveAgentId(agentId);
    updateAgent(agentId, 'running');

    if (agentId === 'agent4_plan') {
      await runStep1Planning();
    } else if (agentId === 'agent1') {
      const p1 = AGENT_PROMPTS.agent1;
      const res = await callLLM('agent1', p1.userPrompt, p1.systemInstruction, {
        comments: distinctComments.map((c) => ({ id: c.id, text: c.text, records_count: c.count })),
      });
      if (res.success) updateAgent('agent1', 'completed', res.result);
      else updateAgent('agent1', 'failed', null, res.error);
    } else if (agentId === 'agent2') {
      const p2 = AGENT_PROMPTS.agent2;
      const res = await callLLM('agent2', p2.userPrompt, p2.systemInstruction, { kpis });
      if (res.success) updateAgent('agent2', 'completed', res.result);
      else updateAgent('agent2', 'failed', null, res.error);
    } else if (agentId === 'agent3') {
      const p3 = AGENT_PROMPTS.agent3;
      const res = await callLLM('agent3', p3.userPrompt, p3.systemInstruction, {
        comments: distinctComments.map((c) => ({
          id: c.id,
          text: c.text,
          records_count: c.count,
          ai_risk_flags: c.riskFlagCounts,
        })),
      });
      if (res.success) updateAgent('agent3', 'completed', res.result);
      else updateAgent('agent3', 'failed', null, res.error);
    } else if (agentId === 'agent6') {
      const p6 = AGENT_PROMPTS.agent6;
      const res = await callLLM('agent6', p6.userPrompt, p6.systemInstruction, {
        comments: distinctComments.map((c) => ({
          id: c.id,
          text: c.text,
          records_count: c.count,
          avg_communication_rating: c.avgCommunicationRating,
        })),
      });
      if (res.success) updateAgent('agent6', 'completed', res.result);
      else updateAgent('agent6', 'failed', null, res.error);
    } else if (agentId === 'agent5') {
      await runStep3Analytics();
    } else if (agentId === 'agent4_decision') {
      await runStep4Decision();
    }

    setIsRunning(false);
    setActiveAgentId(null);
  };

  /**
   * Main Start Workflow Handler
   */
  const handleStartWorkflow = async () => {
    if (isRunning) return;

    if (runMode === 'auto') {
      // Auto run: execute all 4 steps seamlessly
      await runStep1Planning();
      await runStep2Specialists();
      await runStep3Analytics();
      await runStep4Decision();
      setActiveDataFlow('none');
    } else {
      // Step-by-Step Review mode: run Step 1, then pause for user review
      await runStep1Planning();
    }
  };

  /**
   * Approve & Continue for Step-by-Step mode
   */
  const handleApproveAndContinue = async () => {
    if (currentStep === 1) {
      await runStep2Specialists();
    } else if (currentStep === 2) {
      await runStep3Analytics();
    } else if (currentStep === 3) {
      await runStep4Decision();
      setActiveDataFlow('none');
    }
  };

  const handleResetWorkflow = () => {
    setWorkflowState(INITIAL_WORKFLOW_STATE);
    setCurrentStep(0);
    setIsRunning(false);
    setActiveAgentId(null);
    setActiveDataFlow('none');
  };

  const handleTogglePlannedAgent = (idx: number) => {
    setPlannedAgents((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], run: !next[idx].run };
      return next;
    });
  };

  const handleEditPlannedTask = (idx: number, newTask: string) => {
    setPlannedAgents((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], task: newTask };
      return next;
    });
  };

  const hasCompletedWorkflow = workflowState.agent4_decision.status === 'completed';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP BAR */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        runMode={runMode}
        setRunMode={setRunMode}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onStartWorkflow={handleStartWorkflow}
        onResetWorkflow={handleResetWorkflow}
        isRunning={isRunning}
        hasCompleted={hasCompletedWorkflow}
        totalRecords={activeRecords.length}
      />

      {/* 2. MAIN APPLICATION CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Manager's Question Card */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Manager's Executive Inquiry</span>
            </div>
            <span className="text-xs text-slate-400">
              Agent 4 will formulate an execution plan answering this prompt
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={managerQuestion}
              onChange={(e) => setManagerQuestion(e.target.value)}
              disabled={isRunning}
              placeholder="Enter your management question..."
              className="w-full text-sm sm:text-base font-semibold bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Presets:</span>
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setManagerQuestion(q)}
                disabled={isRunning}
                className={`text-left px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                  managerQuestion === q
                    ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {q.length > 55 ? `${q.slice(0, 55)}...` : q}
              </button>
            ))}
          </div>
        </section>

        {/* Step-by-Step Review Bar */}
        {runMode === 'step_by_step' && currentStep > 0 && (
          <StepReviewBar
            currentStep={currentStep}
            workflowState={workflowState}
            plannedAgents={plannedAgents}
            onTogglePlannedAgent={handleTogglePlannedAgent}
            onEditPlannedTask={handleEditPlannedTask}
            onApproveAndContinue={handleApproveAndContinue}
            onRerunAgent={handleRerunIndividualAgent}
            isRunning={isRunning}
          />
        )}

        {/* 3. INTERACTIVE AGENT DIAGRAM & VISUALIZATION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Agent Architecture & Dynamic Data Flow
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any agent box to inspect tasks, inputs, results, and raw JSON logs.
              </p>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Active Agent Pipeline Running</span>
              </div>
            )}
          </div>

          <AgentDiagram
            workflowState={workflowState}
            currentStep={currentStep}
            activeAgentId={activeAgentId}
            onSelectAgent={(id) => setInspectedAgentId(id)}
            onRerunAgent={handleRerunIndividualAgent}
            isStepReviewMode={runMode === 'step_by_step'}
            activeDataFlow={activeDataFlow}
          />
        </section>

        {/* 4. EXECUTIVE DASHBOARD */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Hospital Leadership Intelligence Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unified multi-agent synthesis: Executive alerts, quality metrics, and clinical escalations.
              </p>
            </div>
          </div>

          <ExecutiveDashboard
            workflowState={workflowState}
            kpis={kpis}
            records={activeRecords}
            managerQuestion={managerQuestion}
          />
        </section>
      </main>

      {/* 5. MODALS */}
      {/* Dataset Management Modal */}
      <DataTableModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        records={records}
        onUpdateRecords={(newRecs) => setRecords(newRecs)}
        selectedRecordIds={selectedRecordIds}
        onToggleRecordSelection={handleToggleRecordSelection}
        onSelectAll={handleSelectAll}
      />

      {/* Agent Inspector Modal */}
      <AgentInspectorModal
        agentId={inspectedAgentId}
        onClose={() => setInspectedAgentId(null)}
        workflowState={workflowState}
        onRerunAgent={handleRerunIndividualAgent}
        inputDataSnippet={
          inspectedAgentId === 'agent4_plan'
            ? { question: managerQuestion, kpis }
            : inspectedAgentId === 'agent1'
            ? { distinct_comments_count: distinctComments.length, sample: distinctComments.slice(0, 3) }
            : inspectedAgentId === 'agent2'
            ? { kpis }
            : inspectedAgentId === 'agent3'
            ? { distinct_comments: distinctComments.slice(0, 3) }
            : inspectedAgentId === 'agent6'
            ? { distinct_comments: distinctComments.slice(0, 3) }
            : inspectedAgentId === 'agent5'
            ? { specialist_findings: 'Synthesizing Agents 1, 2, 3, 6' }
            : inspectedAgentId === 'agent4_decision'
            ? { question: managerQuestion, analytics: 'Agent 5 synthesis', kpis }
            : null
        }
      />
    </div>
  );
}
