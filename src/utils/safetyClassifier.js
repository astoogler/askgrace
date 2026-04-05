// Risk keyword detection — runs on every user message before the API call.
// Returns the highest-priority risk level found.

const EMERGENCY_PATTERNS = [
  /\b(911|emergency|help me|i('?m| am) (falling|choking|dying|having a heart attack))\b/i,
  /\b(can'?t breathe|chest pain|stroke|seizure|unconscious|bleeding badly)\b/i,
  /\b(someone broke in|house fire|i('?ve| have) fallen|gas leak)\b/i,
  /\b(suicide|kill myself|end my life|want to die|don'?t want to live)\b/i,
  /\b(self[- ]?harm|hurt myself|overdose)\b/i,
];

const SCAM_PATTERNS = [
  /\b(irs|social security).*(call|phone|said|told)/i,
  /\b(won|prize|lottery|sweepstakes|inheritance).*(money|claim|pay|fee)/i,
  /\b(gift card|wire transfer|western union|bitcoin|cryptocurrency)/i,
  /\b(tech support|microsoft|apple).*(call|remote|access)/i,
  /\b(nigerian|prince|overseas).*(money|transfer|bank)/i,
  /\b(romance|dating|online).*(send money|wire|bank account)/i,
  /\b(grandson|grandchild|relative).*(jail|trouble|money|bail)/i,
  /\b(too good to be true|send.*personal information|verify.*account)/i,
];

const FINANCIAL_PATTERNS = [
  /\b(investment|invest|stock|bond|portfolio|401k|ira|retirement fund)/i,
  /\b(tax|taxes|irs|deduction|refund|filing)/i,
  /\b(will|trust|estate|inheritance|beneficiary|power of attorney)/i,
  /\b(debt|loan|mortgage|credit card|interest rate|apr)/i,
  /\b(bank account|savings|checking|financial advisor|accountant)/i,
  /\b(social security|pension|annuity|reverse mortgage)/i,
  /\b(someone.*(took|taking|stole|stealing).*money)/i,
];

const MEDICAL_PATTERNS = [
  /\b(medication|medicine|prescription|dosage|side effect)/i,
  /\b(blood pressure|diabetes|cholesterol|heart|cancer|arthritis)/i,
  /\b(doctor|hospital|surgery|treatment|diagnosis)/i,
  /\b(pain|dizzy|dizziness|nausea|symptom|fever|rash|swelling)/i,
  /\b(supplement|vitamin|herbal|home remedy)/i,
  /\b(sick|vomit|throwing up|can'?t hold.*down|not feeling well)/i,
  /\b(headache|migraine|tired|fatigue|exhausted|weak|weakness)/i,
  /\b(fall|fell|falling|balance|unsteady)/i,
  /\b(cough|cold|flu|infection|sore throat|congestion)/i,
  /\b(injury|injured|hurt|bruise|cut|bleeding)/i,
];

export function classifyRisk(text) {
  if (!text || typeof text !== 'string') return 'safe';

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(text)) return 'emergency';
  }

  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(text)) return 'scam';
  }

  for (const pattern of FINANCIAL_PATTERNS) {
    if (pattern.test(text)) return 'financial';
  }

  for (const pattern of MEDICAL_PATTERNS) {
    if (pattern.test(text)) return 'medical';
  }

  return 'safe';
}

// Warning card content for each risk level
export const RISK_WARNINGS = {
  emergency: {
    icon: '🚨',
    title: 'Emergency Detected',
    description: 'If you are in immediate danger, please use the Emergency button at the top of the screen to call for help, or dial 911 directly.',
    variant: 'emergency',
  },
  scam: {
    icon: '🛡️',
    title: 'Possible Scam Alert',
    description: 'This sounds like it could be a scam. Please do not send money or share personal information. Talk to a family member before taking any action.',
    variant: 'scam',
  },
  medical: {
    icon: '💚',
    title: 'Health Topic',
    description: 'Grace can share general wellness tips, but please talk to your doctor before making any health decisions.',
    variant: 'medical',
  },
  financial: {
    icon: '💰',
    title: 'Financial Topic',
    description: 'Grace can explain general financial concepts, but please consult a qualified financial advisor for advice about your specific situation.',
    variant: 'financial',
  },
};
