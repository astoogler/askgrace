// Suggestion chips shown on first chat open
export const SUGGESTION_CHIPS = [
  { id: 'health', label: 'Health tips for today', icon: '💚' },
  { id: 'meds', label: 'Help with my medications', icon: '💊' },
  { id: 'scam', label: 'Is this a scam?', icon: '🛡️' },
  { id: 'family', label: 'How to video call family', icon: '📱' },
  { id: 'exercise', label: 'Easy exercises for me', icon: '🚶' },
  { id: 'lonely', label: "I'm feeling lonely", icon: '💛' },
];

// Daily tips rotated on the home screen (14 total, 1 per day)
export const DAILY_TIPS = [
  "Drink a glass of water first thing in the morning — it helps wake up your body.",
  "Try a short walk today, even 10 minutes makes a difference.",
  "Call or text someone you love today — connection keeps us healthy.",
  "Try a crossword puzzle or word game to keep your mind sharp.",
  "Eat a colorful plate — more colors means more nutrients.",
  "Take a moment to stretch your arms and shoulders. It feels wonderful!",
  "Write down three things you're grateful for today.",
  "Check that you've taken all your medications for today.",
  "Open the curtains and let some sunlight in — it boosts your mood.",
  "Listen to your favorite music today. It's good for the soul!",
  "Try deep breathing: breathe in for 4 counts, hold for 4, breathe out for 4.",
  "Drink water between meals — staying hydrated helps with energy.",
  "Look through old photos today — happy memories are good medicine.",
  "Set a reminder to stand up and move every hour. Your body will thank you!",
];

// Reminder type definitions with display config
export const REMINDER_TYPES = [
  { value: 'pill', label: 'Pill', icon: '💊', color: 'var(--forest)' },
  { value: 'event', label: 'Event', icon: '📅', color: 'var(--brown)' },
  { value: 'call', label: 'Call', icon: '📞', color: 'var(--amber)' },
];

// Default reminders for first-time users
export const DEFAULT_REMINDERS = [
  { id: '1', name: 'Morning Medication', time: '08:00 AM', type: 'pill', done: false },
  { id: '2', name: 'Call daughter Sarah', time: '10:00 AM', type: 'call', done: false },
  { id: '3', name: 'Afternoon walk', time: '02:00 PM', type: 'event', done: false },
  { id: '4', name: 'Evening Medication', time: '06:00 PM', type: 'pill', done: false },
];

// Language options for settings
export const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'it-IT', label: 'Italiano' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'ko-KR', label: '한국어' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
];
