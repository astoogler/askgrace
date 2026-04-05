// Ask Grace — Claude API Proxy Edge Function
// Builds system prompt server-side from SOUL + SKILLS + user context.
// Uses cheaper/faster models for free users, better models for paid users.
// Optimized: parallel DB queries to reduce latency.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// --- Tier configuration ---
// Each tier defines the model, token limit, and daily message cap.
// Future: store these in a `tiers` table for admin control.
const TIERS = {
  guest: {
    model: 'claude-haiku-4-5-20251001',
    maxTokens: 512,
    dailyLimit: 5,
    totalLimit: 5,  // Hard cap for guests (freemium gate)
  },
  free: {
    model: 'claude-haiku-4-5-20251001',
    maxTokens: 768,
    dailyLimit: 50,
  },
  // TODO: Enable when paid tiers launch
  // pro: {
  //   model: 'claude-sonnet-4-20250514',
  //   maxTokens: 1024,
  //   dailyLimit: 300,
  // },
  // premium: {
  //   model: 'claude-opus-4-20250514',
  //   maxTokens: 2048,
  //   dailyLimit: 100,
  // },
};

const RATE_LIMIT_PER_MINUTE = 10;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://askgrace.org',
  'https://www.askgrace.org',
  'https://app.askgrace.org',
];

// Cache system prompt in memory across requests in the same isolate
let cachedPrompt: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function errorResponse(status: number, message: string, req: Request, extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });
}

function validateInput(body: any): string | null {
  if (!body.messages || !Array.isArray(body.messages)) return 'messages must be an array';
  if (body.messages.length > 50) return 'Too many messages (max 50)';
  for (const msg of body.messages) {
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) return 'Invalid message role';
    if (typeof msg.content !== 'string') return 'Message content must be a string';
    if (msg.content.length > 10000) return 'Message too long (max 10000 chars)';
  }
  return null;
}

async function getSystemPrompt(supabase: any): Promise<string> {
  if (cachedPrompt && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPrompt;
  }

  const { data: prompts } = await supabase
    .from('system_prompts')
    .select('category, content, sort_order')
    .eq('enabled', true)
    .order('sort_order', { ascending: true });

  if (!prompts || prompts.length === 0) {
    return 'You are Grace, a warm and helpful AI companion for seniors. Be kind, clear, and safe.';
  }

  const soul = prompts.filter((p: any) => p.category === 'soul').map((p: any) => p.content);
  const skills = prompts.filter((p: any) => p.category === 'skill').map((p: any) => p.content);

  cachedPrompt = [...soul, ...skills].join('\n\n');
  cacheTimestamp = Date.now();
  return cachedPrompt;
}

function buildUserContext(settings: any): string {
  if (!settings) return '';
  const parts: string[] = ['## ABOUT THE PERSON YOU ARE SPEAKING WITH'];
  if (settings.caregiver_name) parts.push(`- Their caregiver/emergency contact is named ${settings.caregiver_name}.`);
  if (settings.caregiver_phone) parts.push(`- Their caregiver's phone number is ${settings.caregiver_phone}.`);
  if (settings.language && settings.language !== 'en-US') parts.push(`- Their preferred language is ${settings.language}. Try to respond in that language when possible.`);
  return parts.length > 1 ? parts.join('\n') : '';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed', req);
  }

  try {
    let body: any;
    try { body = await req.json(); } catch { return errorResponse(400, 'Invalid JSON', req); }

    const validationError = validateInput(body);
    if (validationError) return errorResponse(400, validationError, req);

    const { messages, anonId } = body;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // --- Step 1: Identify caller (auth check) ---
    let userId: string | null = null;
    let isGuest = true;
    // TODO: Add tier lookup from a user `subscriptions` table when paid tiers launch
    let tierName = 'guest';

    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          userId = user.id;
          isGuest = false;
          tierName = 'free'; // TODO: Look up paid tier from subscriptions table
        }
      } catch { /* anon key — treat as guest */ }
    }

    const tier = TIERS[tierName as keyof typeof TIERS] || TIERS.guest;
    const identityCol = isGuest ? 'anon_id' : 'user_id';
    const identityVal = isGuest ? (anonId || 'unknown') : userId;
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();

    // --- Step 2: Run all checks in PARALLEL (major speed optimization) ---
    // Previously these ran sequentially (5 round-trips). Now 1 round-trip.
    const parallelQueries: Promise<any>[] = [
      // [0] Rate limit: requests in last minute
      supabase.from('usage_log').select('*', { count: 'exact', head: true })
        .eq(identityCol, identityVal).gte('created_at', oneMinuteAgo),
      // [1] Rate limit: requests in last day
      supabase.from('usage_log').select('*', { count: 'exact', head: true })
        .eq(identityCol, identityVal).gte('created_at', oneDayAgo),
      // [2] System prompt (may use cache)
      getSystemPrompt(supabase),
    ];

    // [3] Guest session check (only for guests)
    if (isGuest) {
      if (!anonId || typeof anonId !== 'string' || anonId.length > 64) {
        return errorResponse(400, 'Invalid guest identifier', req);
      }
      parallelQueries.push(
        supabase.from('guest_sessions').select('messages_used').eq('anon_id', anonId).maybeSingle()
      );
    }

    // [4] User settings (only for authenticated)
    if (userId) {
      parallelQueries.push(
        supabase.from('user_settings').select('caregiver_name, caregiver_phone, language')
          .eq('user_id', userId).maybeSingle()
      );
    }

    const results = await Promise.all(parallelQueries);

    // --- Step 3: Process results ---
    const minuteCount = results[0]?.count ?? 0;
    const dayCount = results[1]?.count ?? 0;
    let systemPrompt = results[2] as string;

    if (minuteCount >= RATE_LIMIT_PER_MINUTE) {
      return errorResponse(429, 'Too many requests. Please wait a moment.', req);
    }
    if (dayCount >= tier.dailyLimit) {
      return errorResponse(429, 'Daily limit reached. Please try again tomorrow.', req);
    }

    // Guest freemium gate
    if (isGuest) {
      const guestData = results[3]?.data;
      let used = 0;

      if (guestData) {
        used = guestData.messages_used;
      } else {
        await supabase.from('guest_sessions').insert({ anon_id: anonId, messages_used: 0 });
      }

      if (used >= (tier.totalLimit ?? tier.dailyLimit)) {
        return errorResponse(403, 'Free messages used', req, { gate: 'signup_required' });
      }

      // Fire-and-forget: don't await the increment
      supabase.from('guest_sessions')
        .update({ messages_used: used + 1, last_seen_at: new Date().toISOString() })
        .eq('anon_id', anonId).then(() => {});
    }

    // User context for authenticated users
    if (userId) {
      const settingsIdx = isGuest ? 4 : 3; // index depends on whether guest query ran
      const settingsData = results[parallelQueries.length - 1]?.data;
      const userContext = buildUserContext(settingsData);
      if (userContext) systemPrompt += '\n\n' + userContext;
    }

    // --- Step 4: Call Anthropic API with tier-appropriate model ---
    let anthropicResponse: Response;
    try {
      anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: tier.model,
          max_tokens: tier.maxTokens,
          system: systemPrompt,
          messages,
        }),
      });
    } catch {
      return errorResponse(502, 'Failed to reach AI service', req);
    }

    if (!anthropicResponse.ok) {
      return errorResponse(502, 'AI service error', req);
    }

    const data = await anthropicResponse.json();

    // Fire-and-forget: log usage without blocking response
    const tokensIn = data.usage?.input_tokens ?? 0;
    const tokensOut = data.usage?.output_tokens ?? 0;
    supabase.from('usage_log').insert({
      user_id: userId,
      anon_id: isGuest ? anonId : null,
      endpoint: 'chat',
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      model: tier.model,
    }).then(() => {});

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    });

  } catch {
    return errorResponse(500, 'Internal server error', req);
  }
});
