-- Ask Grace — Emergency Contacts Table
-- Supports up to 5 family/emergency contacts per user.
-- Run this in your Supabase SQL Editor.

CREATE TABLE public.emergency_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  relationship    TEXT NOT NULL DEFAULT 'family'
                  CHECK (relationship IN ('spouse', 'son', 'daughter', 'sibling', 'grandchild', 'friend', 'neighbor', 'caregiver', 'other')),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_emergency_contacts_user ON public.emergency_contacts (user_id, sort_order ASC);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own contacts"   ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own contacts" ON public.emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own contacts" ON public.emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own contacts" ON public.emergency_contacts FOR DELETE USING (auth.uid() = user_id);
