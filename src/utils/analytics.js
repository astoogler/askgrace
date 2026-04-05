// Ask Grace — Analytics Instrumentation Layer
// DO NOT MODIFY THIS FILE — it is the analytics contract for the app.

const STORAGE_KEY = 'agrace_signals';
const SESSION_KEY = 'agrace_session_id';
const ANON_KEY = 'agrace_anon_id';

function getOrCreateId(key) {
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function getAnonId() { return getOrCreateId(ANON_KEY); }

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function log(event, data = {}) {
  const entry = {
    event,
    ...data,
    anonId: getAnonId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
  };
  const signals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  signals.push(entry);
  // Keep last 500 signals to avoid storage bloat
  if (signals.length > 500) signals.splice(0, signals.length - 500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

/** Call once on app mount */
export function trackSessionStart() {
  log('session_start');
}

/** Call when active tab/screen changes */
export function trackScreen(screenName) {
  log('screen_view', { screen: screenName });
}

/** Call before every Claude API request */
export function trackMessage(text, riskLevel = 'safe') {
  const wordCount = text.trim().split(/\s+/).length;
  log('message_sent', { wordCount, riskLevel });
}

/** Call on reminder CRUD actions */
export function trackReminder(action, reminderType) {
  log('reminder_action', { action, reminderType });
}

/** Call on any meaningful feature interaction */
export function trackFeature(feature, meta = {}) {
  log('feature_use', { feature, ...meta });
}

/** Call on thumbs up/down feedback */
export function trackFeedback(vote, category = 'general') {
  log('feedback', { vote, category });
}

/** Dev helper — returns all stored signals */
export function getLocalSignals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
