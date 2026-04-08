-- Ask Grace — Add phone number and messaging opt-in to profiles
-- Run this in your Supabase SQL Editor.

ALTER TABLE public.profiles
  ADD COLUMN phone TEXT DEFAULT '',
  ADD COLUMN sms_opt_in BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN email_opt_in BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN opted_in_at TIMESTAMPTZ;
