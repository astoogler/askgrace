// Suggestion chips shown on first chat open
export const SUGGESTION_CHIPS = [
  { id: 'health', label: 'Health tips for today', icon: '💚' },
  { id: 'meds', label: 'Help with my medications', icon: '💊' },
  { id: 'scam', label: 'Is this a scam?', icon: '🛡️' },
  { id: 'family', label: 'How to video call family', icon: '📱' },
  { id: 'exercise', label: 'Easy exercises for me', icon: '🚶' },
  { id: 'lonely', label: "I'm feeling lonely", icon: '💛' },
];

// Daily tips rotated on the home screen (60 total — 2 months before repeating)
export const DAILY_TIPS = [
  // Hydration & Nutrition
  "Drink a glass of water first thing in the morning — it helps wake up your body.",
  "Eat a colorful plate — more colors means more nutrients.",
  "Drink water between meals — staying hydrated helps with energy.",
  "Try adding a handful of berries to your breakfast. They're packed with antioxidants.",
  "A cup of warm soup is a great way to stay hydrated and nourished.",
  "Try to eat a piece of fruit today. Your body will thank you.",
  "If plain water is boring, add a slice of lemon or cucumber for flavor.",
  "Eating smaller meals more often can help keep your energy steady all day.",

  // Movement & Exercise
  "Try a short walk today, even 10 minutes makes a difference.",
  "Take a moment to stretch your arms and shoulders. It feels wonderful!",
  "Set a reminder to stand up and move every hour. Your body will thank you!",
  "Try marching in place during a TV commercial break — easy and effective!",
  "Gentle chair exercises can strengthen your legs without any risk of falling.",
  "Roll your ankles in circles while sitting — it helps with circulation.",
  "Try touching your toes gently when you wake up. Stretching keeps you flexible.",
  "A slow walk after dinner can help with digestion and sleep.",

  // Social Connection
  "Call or text someone you love today — connection keeps us healthy.",
  "Send a quick message to an old friend. They'll be glad to hear from you.",
  "Ask a neighbor how they're doing today. Small connections matter.",
  "Write a short note or card to someone you appreciate. It'll make their day.",
  "If you're feeling lonely, remember — Grace is always here to chat.",
  "Plan a phone call with someone this week. Having something to look forward to helps.",
  "Share a happy memory with someone today. Reminiscing is good for the heart.",
  "Teach someone something you know well. Sharing knowledge keeps your mind active.",

  // Mental Health & Mindfulness
  "Write down three things you're grateful for today.",
  "Try deep breathing: breathe in for 4 counts, hold for 4, breathe out for 4.",
  "Open the curtains and let some sunlight in — it boosts your mood.",
  "It's okay to have a slow day. Rest is productive too.",
  "Spend five quiet minutes today doing nothing. Your brain needs breaks.",
  "If something is worrying you, try writing it down. Getting it out of your head helps.",
  "Smile at yourself in the mirror today. You deserve kindness — especially from yourself.",
  "Name one thing that went well today, no matter how small.",

  // Brain Health & Learning
  "Try a crossword puzzle or word game to keep your mind sharp.",
  "Look through old photos today — happy memories are good medicine.",
  "Learn one new word today. Expanding your vocabulary keeps your brain active.",
  "Try doing a familiar task with your non-dominant hand — it challenges your brain.",
  "Read a chapter of a book or a magazine article today. Reading keeps the mind young.",
  "Try to recall what you had for breakfast yesterday. Memory exercises help!",
  "Count backwards from 100 by 7s. It's a simple brain workout.",
  "Organize a drawer or shelf today. Sorting and deciding exercises your brain.",

  // Health & Wellness
  "Check that you've taken all your medications for today.",
  "Listen to your favorite music today. It's good for the soul!",
  "Wash your hands for 20 seconds — hum 'Happy Birthday' twice to time it.",
  "Check in with your body right now. Is anything sore? Tense? Take a moment to relax it.",
  "Good posture matters — sit up straight and roll your shoulders back.",
  "If you wear glasses, give them a good clean today. Clear vision helps prevent falls.",
  "Check the soles of your shoes. Worn-out soles can cause slips.",
  "Put on shoes with good support today, even inside the house.",

  // Home & Safety
  "Check that your hallways and paths are clear of tripping hazards.",
  "Make sure your smoke detector batteries are working. It only takes a minute.",
  "Leave a light on between your bedroom and bathroom for nighttime safety.",
  "Keep a flashlight by your bed in case the power goes out.",
  "Put important phone numbers on a card by the phone — just in case.",
  "If you have area rugs, make sure they have non-slip pads underneath.",
  "Check that your grab bars in the bathroom are secure.",
  "Keep your most-used items on shelves you can reach without a step stool.",
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
