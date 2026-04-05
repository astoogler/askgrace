import { useState, useEffect, useCallback } from 'react';
import { trackReminder } from '../utils/analytics';
import { DEFAULT_REMINDERS } from '../constants/topics';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'agrace_reminders';

export function useReminders(userId) {
  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  // Load from Supabase when authenticated
  useEffect(() => {
    if (!userId) return;

    supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((r) => ({
            id: r.id,
            name: r.name,
            time: r.time,
            type: r.type,
            done: r.done,
          }));
          setReminders(mapped);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        }
      });
  }, [userId]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const toggleDone = useCallback(
    (id) => {
      setReminders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const updated = { ...r, done: !r.done };
          trackReminder(updated.done ? 'complete' : 'uncomplete', r.type);

          if (userId) {
            supabase
              .from('reminders')
              .update({ done: updated.done, updated_at: new Date().toISOString() })
              .eq('id', id);
          }

          return updated;
        })
      );
    },
    [userId]
  );

  const addReminder = useCallback(
    (reminder) => {
      const newReminder = {
        ...reminder,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        done: false,
      };
      setReminders((prev) => [...prev, newReminder]);
      trackReminder('add', reminder.type);

      if (userId) {
        supabase.from('reminders').insert({
          id: newReminder.id,
          user_id: userId,
          name: newReminder.name,
          time: newReminder.time,
          type: newReminder.type,
          done: false,
          sort_order: reminders.length,
        });
      }
    },
    [userId, reminders.length]
  );

  const deleteReminder = useCallback(
    (id) => {
      setReminders((prev) => {
        const target = prev.find((r) => r.id === id);
        if (target) trackReminder('delete', target.type);
        return prev.filter((r) => r.id !== id);
      });

      if (userId) {
        supabase.from('reminders').delete().eq('id', id);
      }
    },
    [userId]
  );

  const resetDaily = useCallback(() => {
    setReminders((prev) => prev.map((r) => ({ ...r, done: false })));

    if (userId) {
      supabase
        .from('reminders')
        .update({ done: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    }
  }, [userId]);

  const stats = {
    medicationsTaken: reminders.filter((r) => r.type === 'pill' && r.done).length,
    appointments: reminders.filter((r) => r.type === 'event').length,
    calls: reminders.filter((r) => r.type === 'call').length,
  };

  return { reminders, toggleDone, addReminder, deleteReminder, resetDaily, stats };
}
