export interface PatientRecord {
  Record_ID: string;
  Patient_Persona: string;
  Age_Group: string;
  Visit_Type: string;
  Service_Line: string;
  Year: number;
  Patient_Satisfaction: number;
  Communication_Rating: number;
  Followup_Compliance: number; // 0 or 1
  Portal_Usage: number; // 0 or 1
  Readmission_Risk: 'Low' | 'Moderate' | 'High';
  AI_Risk_Flag: 'Standard' | 'Hallucination Risk' | 'Bias Review' | 'Human Review Required';
  Comment: string;
}

export interface DistinctComment {
  id: string; // e.g. "C1", "C2"
  text: string;
  count: number;
  avgCommunicationRating: number;
  riskFlagCounts: Record<string, number>;
  recordIds: string[];
}

export interface CalculatedKPIs {
  totalRecords: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followupRate: number; // percentage (0-100)
  portalUseRate: number; // percentage (0-100)
  satisfactionByServiceLine: Record<string, number>;
  satisfactionByYear: Record<string, number>;
  readmissionRiskCounts: {
    Low: number;
    Moderate: number;
    High: number;
  };
  aiRiskFlagCounts: {
    'Standard': number;
    'Hallucination Risk': number;
    'Bias Review': number;
    'Human Review Required': number;
  };
  personaStats: Record<string, { count: number; avgSat: number; avgComm: number; portalRate: number }>;
  visitTypeStats: Record<string, { count: number; avgSat: number; avgComm: number; followupRate: number }>;
}

export type AgentId = 'agent4_plan' | 'agent1' | 'agent2' | 'agent3' | 'agent6' | 'agent5' | 'agent4_decision';

export type AgentStatus = 'pending' | 'running' | 'waiting_review' | 'completed' | 'skipped' | 'failed';

export interface PlannedAgent {
  agent: string;
  run: boolean;
  task: string;
  reason: string;
}

export interface Agent4PlanOutput {
  goal: string;
  agents: PlannedAgent[];
}

export interface Agent1FeedbackOutput {
  comments: Array<{
    id: string;
    theme: string;
    sentiment: string;
    reasoning: string;
    operational_issue: string;
    risk_or_bias_concern: string;
    recommended_action: string;
  }>;
  summary: string;
}

export interface Agent2MonitoringOutput {
  patterns: Array<{
    pattern: string;
    evidence: string;
  }>;
  operational_issues: string[];
  equity_concerns: Array<{
    group: string;
    concern: string;
    evidence: string;
  }>;
  risk: {
    patient_safety: string;
    reputational: string;
    compliance: string;
    equity: string;
  };
  recommendation: string;
  additional_information_needed: string;
}

export interface Agent3TriageOutput {
  complaints: Array<{
    id: string;
    primary_category: string;
    secondary_categories: string[];
    severity_level: number;
    severity_reasoning: string;
    risks: Array<{
      risk: string;
      why: string;
    }>;
    route_to: string;
    human_review_required: boolean;
    human_review_reason: string;
  }>;
  summary: string;
}

export interface Agent6CommunicationOutput {
  evaluations: Array<{
    id: string;
    purpose: string;
    purpose_rationale: string;
    scores: {
      clarity: string;
      completeness: string;
      empathy: string;
      patient_centeredness: string;
      actionability: string;
    };
    health_literacy_concern: string;
    risk: string;
    risk_reason: string;
    improvements: string[];
  }>;
  improved_patient_message: string;
  executive_summary: {
    overall_quality: string;
    major_strengths: string;
    major_weaknesses: string;
    highest_risk: string;
    most_important_improvement: string;
  };
}

export interface Agent5AnalyticsOutput {
  headline: string;
  satisfaction_insights: string[];
  top_themes: string[];
  hidden_problems: Array<{
    problem: string;
    evidence: string;
  }>;
  ai_risk_monitoring: {
    hallucination_trap: string[];
    bias_related: string[];
    human_review: string[];
  };
  top_priorities: string[];
  quick_wins: string[];
  long_term_ai_opportunities: string[];
  additional_information_needed: string;
}

export interface Agent4DecisionOutput {
  top_alert: string;
  answer: string;
  priority: 'Low' | 'Medium' | 'High' | string;
  priority_reason: string;
  recommended_actions: Array<{
    action: string;
    owner: string;
    timeframe: string;
  }>;
  human_review: Array<{
    item: string;
    reason: string;
  }>;
}

export interface AgentWorkflowState {
  agent4_plan: { status: AgentStatus; result: Agent4PlanOutput | null; error: string | null; runDurationMs?: number };
  agent1: { status: AgentStatus; result: Agent1FeedbackOutput | null; error: string | null; runDurationMs?: number };
  agent2: { status: AgentStatus; result: Agent2MonitoringOutput | null; error: string | null; runDurationMs?: number };
  agent3: { status: AgentStatus; result: Agent3TriageOutput | null; error: string | null; runDurationMs?: number };
  agent6: { status: AgentStatus; result: Agent6CommunicationOutput | null; error: string | null; runDurationMs?: number };
  agent5: { status: AgentStatus; result: Agent5AnalyticsOutput | null; error: string | null; runDurationMs?: number };
  agent4_decision: { status: AgentStatus; result: Agent4DecisionOutput | null; error: string | null; runDurationMs?: number };
}

export type RunMode = 'auto' | 'step_by_step';

export type WorkflowStep = 0 | 1 | 2 | 3 | 4; // 0 = idle, 1 = planning, 2 = specialists, 3 = analytics, 4 = decision
