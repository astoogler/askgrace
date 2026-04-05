-- Ask Grace — Initial Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. PROFILES (auto-created on signup)
-- ============================================
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. USER SETTINGS
-- ============================================
CREATE TABLE public.user_settings (
  user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  language        TEXT NOT NULL DEFAULT 'en-US',
  font_size       TEXT NOT NULL DEFAULT 'font-md'
                  CHECK (font_size IN ('font-sm', 'font-md', 'font-lg', 'font-xl')),
  high_contrast   BOOLEAN NOT NULL DEFAULT false,
  voice_response  BOOLEAN NOT NULL DEFAULT false,
  family_alerts   BOOLEAN NOT NULL DEFAULT true,
  caregiver_name  TEXT DEFAULT '',
  caregiver_phone TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own settings"   ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 3. CONVERSATIONS
-- ============================================
CREATE TABLE public.conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT DEFAULT 'New Conversation',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_user_id ON public.conversations (user_id, updated_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own conversations"   ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. MESSAGES (immutable — no UPDATE or DELETE for audit trail)
-- ============================================
CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  risk_level      TEXT DEFAULT 'safe'
                  CHECK (risk_level IN ('safe', 'emergency', 'scam', 'medical')),
  is_error        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON public.messages (conversation_id, created_at ASC);
CREATE INDEX idx_messages_user_id ON public.messages (user_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages"   ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- No UPDATE or DELETE policies — messages are an immutable audit trail

-- ============================================
-- 5. REMINDERS
-- ============================================
CREATE TABLE public.reminders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  time       TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('pill', 'event', 'call')),
  done       BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reminders_user_id ON public.reminders (user_id, sort_order ASC);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own reminders"   ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. GUEST SESSIONS (Edge Function only — no client access)
-- ============================================
CREATE TABLE public.guest_sessions (
  anon_id         TEXT PRIMARY KEY,
  messages_used   INTEGER NOT NULL DEFAULT 0,
  first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted       BOOLEAN NOT NULL DEFAULT false,
  converted_to    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;
-- No client policies — accessible only via service_role in Edge Function

-- ============================================
-- 7. USAGE LOG (Edge Function only — rate limiting + analytics)
-- ============================================
CREATE TABLE public.usage_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id     TEXT,
  endpoint    TEXT NOT NULL DEFAULT 'chat',
  tokens_in   INTEGER NOT NULL DEFAULT 0,
  tokens_out  INTEGER NOT NULL DEFAULT 0,
  model       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_log_user_day ON public.usage_log (user_id, created_at DESC);
CREATE INDEX idx_usage_log_anon_day ON public.usage_log (anon_id, created_at DESC);

ALTER TABLE public.usage_log ENABLE ROW LEVEL SECURITY;
-- No client policies — accessible only via service_role in Edge Function

-- ============================================
-- 8. AUTO-CREATE PROFILE + SETTINGS ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. HELPER: Mark guest as converted (called via RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.mark_guest_converted(p_anon_id TEXT, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.guest_sessions
  SET converted = true, converted_to = p_user_id, last_seen_at = now()
  WHERE anon_id = p_anon_id;
END;
$$;
