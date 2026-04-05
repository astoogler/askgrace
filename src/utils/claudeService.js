// Claude API service — calls the Supabase Edge Function, never Anthropic directly.
// The API key lives server-side in the Edge Function.

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export class GateError extends Error {
  constructor() {
    super('signup_required');
    this.name = 'GateError';
  }
}

// System prompt is now built server-side from SOUL + SKILLS + user context.
// The client only sends messages and identity.
export async function sendToGrace(history, userMessage, _unused, { accessToken, anonId } = {}) {
  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const headers = { 'Content-Type': 'application/json' };

  // Supabase Edge Functions require an Authorization header.
  // Use the user's session token if logged in, otherwise the public anon key.
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
  }

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, anonId }),
  });

  // Freemium gate — server says guest has used all free messages
  if (response.status === 403) {
    const body = await response.json().catch(() => ({}));
    if (body.gate === 'signup_required') {
      throw new GateError();
    }
    throw new Error('Access denied');
  }

  if (response.status === 429) {
    throw new Error('rate_limited');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
