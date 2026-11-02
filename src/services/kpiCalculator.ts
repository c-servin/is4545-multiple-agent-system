import { PatientRecord, CalculatedKPIs } from '../types';

/**
 * Calculates all quantitative metrics in pure JavaScript (never with AI)
 */
export function calculateKPIs(records: PatientRecord[]): CalculatedKPIs {
  const total = records.length;
  if (total === 0) {
    return {
      totalRecords: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followupRate: 0,
      portalUseRate: 0,
      satisfactionByServiceLine: {},
      satisfactionByYear: {},
      readmissionRiskCounts: { Low: 0, Moderate: 0, High: 0 },
      aiRiskFlagCounts: {
        'Standard': 0,
        'Hallucination Risk': 0,
        'Bias Review': 0,
        'Human Review Required': 0,
      },
      personaStats: {},
      visitTypeStats: {},
    };
  }

  // Averages and rates
  let sumSat = 0;
  let sumComm = 0;
  let countFollowup = 0;
  let countPortal = 0;

  const satByServiceLineAcc: Record<string, { sum: number; count: number }> = {};
  const satByYearAcc: Record<number, { sum: number; count: number }> = {};

  const readmissionRiskCounts: { Low: number; Moderate: number; High: number } = {
    Low: 0,
    Moderate: 0,
    High: 0,
  };

  const aiRiskFlagCounts: {
    'Standard': number;
    'Hallucination Risk': number;
    'Bias Review': number;
    'Human Review Required': number;
  } = {
    'Standard': 0,
    'Hallucination Risk': 0,
    'Bias Review': 0,
    'Human Review Required': 0,
  };

  const personaAcc: Record<string, { sumSat: number; sumComm: number; portalCount: number; count: number }> = {};
  const visitTypeAcc: Record<string, { sumSat: number; sumComm: number; followupCount: number; count: number }> = {};

  records.forEach((r) => {
    sumSat += r.Patient_Satisfaction;
    sumComm += r.Communication_Rating;
    if (r.Followup_Compliance === 1) countFollowup++;
    if (r.Portal_Usage === 1) countPortal++;

    // Service line
    const sLine = r.Service_Line || 'Other';
    if (!satByServiceLineAcc[sLine]) satByServiceLineAcc[sLine] = { sum: 0, count: 0 };
    satByServiceLineAcc[sLine].sum += r.Patient_Satisfaction;
    satByServiceLineAcc[sLine].count += 1;

    // Year
    const yr = r.Year || 2026;
    if (!satByYearAcc[yr]) satByYearAcc[yr] = { sum: 0, count: 0 };
    satByYearAcc[yr].sum += r.Patient_Satisfaction;
    satByYearAcc[yr].count += 1;

    // Readmission Risk
    if (r.Readmission_Risk in readmissionRiskCounts) {
      readmissionRiskCounts[r.Readmission_Risk]++;
    } else {
      readmissionRiskCounts.Low++;
    }

    // AI Risk Flag
    if (r.AI_Risk_Flag in aiRiskFlagCounts) {
      aiRiskFlagCounts[r.AI_Risk_Flag]++;
    } else {
      aiRiskFlagCounts['Standard']++;
    }

    // Persona
    const persona = r.Patient_Persona || 'General';
    if (!personaAcc[persona]) personaAcc[persona] = { sumSat: 0, sumComm: 0, portalCount: 0, count: 0 };
    personaAcc[persona].sumSat += r.Patient_Satisfaction;
    personaAcc[persona].sumComm += r.Communication_Rating;
    if (r.Portal_Usage === 1) personaAcc[persona].portalCount++;
    personaAcc[persona].count++;

    // Visit type
    const vType = r.Visit_Type || 'Outpatient';
    if (!visitTypeAcc[vType]) visitTypeAcc[vType] = { sumSat: 0, sumComm: 0, followupCount: 0, count: 0 };
    visitTypeAcc[vType].sumSat += r.Patient_Satisfaction;
    visitTypeAcc[vType].sumComm += r.Communication_Rating;
    if (r.Followup_Compliance === 1) visitTypeAcc[vType].followupCount++;
    visitTypeAcc[vType].count++;
  });

  const satisfactionByServiceLine: Record<string, number> = {};
  Object.keys(satByServiceLineAcc).forEach((k) => {
    satisfactionByServiceLine[k] = parseFloat((satByServiceLineAcc[k].sum / satByServiceLineAcc[k].count).toFixed(2));
  });

  const satisfactionByYear: Record<string, number> = {};
  Object.keys(satByYearAcc).forEach((k) => {
    satisfactionByYear[k] = parseFloat((satByYearAcc[parseInt(k, 10)].sum / satByYearAcc[parseInt(k, 10)].count).toFixed(2));
  });

  const personaStats: Record<string, { count: number; avgSat: number; avgComm: number; portalRate: number }> = {};
  Object.keys(personaAcc).forEach((k) => {
    const item = personaAcc[k];
    personaStats[k] = {
      count: item.count,
      avgSat: parseFloat((item.sumSat / item.count).toFixed(2)),
      avgComm: parseFloat((item.sumComm / item.count).toFixed(2)),
      portalRate: parseFloat(((item.portalCount / item.count) * 100).toFixed(1)),
    };
  });

  const visitTypeStats: Record<string, { count: number; avgSat: number; avgComm: number; followupRate: number }> = {};
  Object.keys(visitTypeAcc).forEach((k) => {
    const item = visitTypeAcc[k];
    visitTypeStats[k] = {
      count: item.count,
      avgSat: parseFloat((item.sumSat / item.count).toFixed(2)),
      avgComm: parseFloat((item.sumComm / item.count).toFixed(2)),
      followupRate: parseFloat(((item.followupCount / item.count) * 100).toFixed(1)),
    };
  });

  return {
    totalRecords: total,
    avgSatisfaction: parseFloat((sumSat / total).toFixed(2)),
    avgCommunication: parseFloat((sumComm / total).toFixed(2)),
    followupRate: parseFloat(((countFollowup / total) * 100).toFixed(1)),
    portalUseRate: parseFloat(((countPortal / total) * 100).toFixed(1)),
    satisfactionByServiceLine,
    satisfactionByYear,
    readmissionRiskCounts,
    aiRiskFlagCounts,
    personaStats,
    visitTypeStats,
  };
}
