import { PatientRecord, DistinctComment } from '../types';

export const DEFAULT_PATIENT_RECORDS: PatientRecord[] = [
  // Comment C1: ED wait time & lack of check-in (8 records)
  {
    Record_ID: 'REC-101',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-102',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-103',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '18-35',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-104',
    Patient_Persona: 'Rural Patient',
    Age_Group: '51-65',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-105',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-106',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2024,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-107',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '51-65',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },
  {
    Record_ID: 'REC-108',
    Patient_Persona: 'Rural Patient',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Waited over 4 hours in the Emergency Department waiting room with acute abdominal pain without any nurse checking in or giving updates.',
  },

  // Comment C2: Confusing discharge & blood thinner instructions (6 records)
  {
    Record_ID: 'REC-109',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },
  {
    Record_ID: 'REC-110',
    Patient_Persona: 'Rural Patient',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },
  {
    Record_ID: 'REC-111',
    Patient_Persona: 'Working Parent',
    Age_Group: '51-65',
    Visit_Type: 'Inpatient',
    Service_Line: 'Neurology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Hallucination Risk',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },
  {
    Record_ID: 'REC-112',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2024,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },
  {
    Record_ID: 'REC-113',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },
  {
    Record_ID: 'REC-114',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '36-50',
    Visit_Type: 'Inpatient',
    Service_Line: 'Neurology',
    Year: 2025,
    Patient_Satisfaction: 3,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Discharge nurse handed me 10 pages of confusing papers with conflicting blood thinner instructions. Nobody explained warning signs.',
  },

  // Comment C3: Patient Portal login failure & hold time (6 records)
  {
    Record_ID: 'REC-115',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '18-35',
    Visit_Type: 'Outpatient',
    Service_Line: 'Orthopedics',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },
  {
    Record_ID: 'REC-116',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Telehealth',
    Service_Line: 'Pediatrics',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },
  {
    Record_ID: 'REC-117',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Outpatient',
    Service_Line: 'Cardiology',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },
  {
    Record_ID: 'REC-118',
    Patient_Persona: 'Rural Patient',
    Age_Group: '51-65',
    Visit_Type: 'Telehealth',
    Service_Line: 'Neurology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },
  {
    Record_ID: 'REC-119',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    Service_Line: 'Orthopedics',
    Year: 2024,
    Patient_Satisfaction: 3,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },
  {
    Record_ID: 'REC-120',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '18-35',
    Visit_Type: 'Telehealth',
    Service_Line: 'Pediatrics',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Tried to access my lab results on the patient portal but the password reset is broken and phone tech support had a 50-minute hold.',
  },

  // Comment C4: Surprise out-of-pocket invoice (5 records)
  {
    Record_ID: 'REC-121',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Received an unexpected out-of-pocket invoice for $1,850 for an out-of-network specialist consultation during an emergency visit.',
  },
  {
    Record_ID: 'REC-122',
    Patient_Persona: 'Rural Patient',
    Age_Group: '51-65',
    Visit_Type: 'Inpatient',
    Service_Line: 'Orthopedics',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Received an unexpected out-of-pocket invoice for $1,850 for an out-of-network specialist consultation during an emergency visit.',
  },
  {
    Record_ID: 'REC-123',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Standard',
    Comment: 'Received an unexpected out-of-pocket invoice for $1,850 for an out-of-network specialist consultation during an emergency visit.',
  },
  {
    Record_ID: 'REC-124',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '18-35',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2024,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Received an unexpected out-of-pocket invoice for $1,850 for an out-of-network specialist consultation during an emergency visit.',
  },
  {
    Record_ID: 'REC-125',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Received an unexpected out-of-pocket invoice for $1,850 for an out-of-network specialist consultation during an emergency visit.',
  },

  // Comment C5: Compassionate oncology nursing staff (Positive) (6 records)
  {
    Record_ID: 'REC-126',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },
  {
    Record_ID: 'REC-127',
    Patient_Persona: 'Working Parent',
    Age_Group: '51-65',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },
  {
    Record_ID: 'REC-128',
    Patient_Persona: 'Rural Patient',
    Age_Group: '65+',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2025,
    Patient_Satisfaction: 5,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },
  {
    Record_ID: 'REC-129',
    Patient_Persona: 'Tech-Savvy Adult',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2025,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },
  {
    Record_ID: 'REC-130',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '51-65',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 4,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },
  {
    Record_ID: 'REC-131',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Outpatient',
    Service_Line: 'Oncology',
    Year: 2024,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Dr. Miller and the oncology nursing staff treated my mother with tremendous compassion, dignity, and clear explanations during chemo.',
  },

  // Comment C6: Interpreter service delay & language equity (5 records)
  {
    Record_ID: 'REC-132',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '51-65',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Requested a Spanish medical interpreter during triage, but waited 45 minutes and doctor rushed through discharge without translation.',
  },
  {
    Record_ID: 'REC-133',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Neurology',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Human Review Required',
    Comment: 'Requested a Spanish medical interpreter during triage, but waited 45 minutes and doctor rushed through discharge without translation.',
  },
  {
    Record_ID: 'REC-134',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Requested a Spanish medical interpreter during triage, but waited 45 minutes and doctor rushed through discharge without translation.',
  },
  {
    Record_ID: 'REC-135',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '51-65',
    Visit_Type: 'Inpatient',
    Service_Line: 'Cardiology',
    Year: 2024,
    Patient_Satisfaction: 1,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Requested a Spanish medical interpreter during triage, but waited 45 minutes and doctor rushed through discharge without translation.',
  },
  {
    Record_ID: 'REC-136',
    Patient_Persona: 'Non-English Preferred',
    Age_Group: '18-35',
    Visit_Type: 'Emergency',
    Service_Line: 'Emergency',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AI_Risk_Flag: 'Bias Review',
    Comment: 'Requested a Spanish medical interpreter during triage, but waited 45 minutes and doctor rushed through discharge without translation.',
  },

  // Comment C7: Physical therapy team excellence (4 records)
  {
    Record_ID: 'REC-137',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Orthopedics',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Physical therapy team was punctual, motivating, and helped me walk safely with my walker before going home.',
  },
  {
    Record_ID: 'REC-138',
    Patient_Persona: 'Rural Patient',
    Age_Group: '51-65',
    Visit_Type: 'Inpatient',
    Service_Line: 'Orthopedics',
    Year: 2025,
    Patient_Satisfaction: 5,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Physical therapy team was punctual, motivating, and helped me walk safely with my walker before going home.',
  },
  {
    Record_ID: 'REC-139',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Inpatient',
    Service_Line: 'Orthopedics',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Physical therapy team was punctual, motivating, and helped me walk safely with my walker before going home.',
  },
  {
    Record_ID: 'REC-140',
    Patient_Persona: 'Elderly Chronic',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    Service_Line: 'Orthopedics',
    Year: 2024,
    Patient_Satisfaction: 4,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AI_Risk_Flag: 'Standard',
    Comment: 'Physical therapy team was punctual, motivating, and helped me walk safely with my walker before going home.',
  },
];

/**
 * Deduplicate comments from records:
 * Extract distinct comments, calculate their occurrence count, average communication rating,
 * and distribution of AI Risk Flags, assigning an ID like C1, C2, etc.
 */
export function extractDistinctComments(records: PatientRecord[]): DistinctComment[] {
  const map = new Map<string, {
    records: PatientRecord[];
  }>();

  records.forEach((rec) => {
    const text = (rec.Comment || '').trim();
    if (!text) return;
    if (!map.has(text)) {
      map.set(text, { records: [] });
    }
    map.get(text)!.records.push(rec);
  });

  const distinct: DistinctComment[] = [];
  let index = 1;

  map.forEach((value, text) => {
    const totalComm = value.records.reduce((acc, r) => acc + (r.Communication_Rating || 0), 0);
    const avgComm = value.records.length > 0 ? totalComm / value.records.length : 0;

    const riskFlags: Record<string, number> = {};
    value.records.forEach((r) => {
      const flag = r.AI_Risk_Flag || 'Standard';
      riskFlags[flag] = (riskFlags[flag] || 0) + 1;
    });

    distinct.push({
      id: `C${index}`,
      text,
      count: value.records.length,
      avgCommunicationRating: parseFloat(avgComm.toFixed(2)),
      riskFlagCounts: riskFlags,
      recordIds: value.records.map((r) => r.Record_ID),
    });
    index++;
  });

  return distinct;
}

/**
 * Parse CSV string to PatientRecord array
 */
export function parseCSVToRecords(csvText: string): PatientRecord[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const records: PatientRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser handling quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^["']|["']$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^["']|["']$/g, ''));

    if (values.length < 3) continue;

    const rowObj: any = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] ?? '';
    });

    records.push({
      Record_ID: rowObj.Record_ID || `REC-${100 + i}`,
      Patient_Persona: rowObj.Patient_Persona || 'Standard Patient',
      Age_Group: rowObj.Age_Group || '36-50',
      Visit_Type: rowObj.Visit_Type || 'Outpatient',
      Service_Line: rowObj.Service_Line || 'General Medicine',
      Year: parseInt(rowObj.Year, 10) || 2026,
      Patient_Satisfaction: parseFloat(rowObj.Patient_Satisfaction) || 3,
      Communication_Rating: parseFloat(rowObj.Communication_Rating) || 3,
      Followup_Compliance: parseInt(rowObj.Followup_Compliance, 10) === 1 ? 1 : 0,
      Portal_Usage: parseInt(rowObj.Portal_Usage, 10) === 1 ? 1 : 0,
      Readmission_Risk: ['Low', 'Moderate', 'High'].includes(rowObj.Readmission_Risk)
        ? rowObj.Readmission_Risk
        : 'Low',
      AI_Risk_Flag: ['Standard', 'Hallucination Risk', 'Bias Review', 'Human Review Required'].includes(rowObj.AI_Risk_Flag)
        ? rowObj.AI_Risk_Flag
        : 'Standard',
      Comment: rowObj.Comment || '',
    });
  }

  return records;
}

/**
 * Convert PatientRecords to downloadable CSV string
 */
export function exportRecordsToCSV(records: PatientRecord[]): string {
  const headers = [
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
  ];

  const rows = records.map((r) => [
    r.Record_ID,
    r.Patient_Persona,
    r.Age_Group,
    r.Visit_Type,
    r.Service_Line,
    r.Year,
    r.Patient_Satisfaction,
    r.Communication_Rating,
    r.Followup_Compliance,
    r.Portal_Usage,
    r.Readmission_Risk,
    r.AI_Risk_Flag,
    `"${(r.Comment || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
