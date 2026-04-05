import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'agrace_settings';

const DEFAULT_SETTINGS = {
  language: 'en-US',
  fontSize: 'font-md',
  highContrast: false,
  voiceResponse: false,
  familyAlerts: true,
  caregiverName: '',
  caregiverPhone: '',
};

// Maps between camelCase (client) and snake_case (database)
function fromDb(row) {
  return {
    language: row.language,
    fontSize: row.font_size,
    highContrast: row.high_contrast,
    voiceResponse: row.voice_response,
    familyAlerts: row.family_alerts,
    caregiverName: row.caregiver_name,
    caregiverPhone: row.caregiver_phone,
  };
}

function toDb(settings) {
  return {
    language: settings.language,
    font_size: settings.fontSize,
    high_contrast: settings.highContrast,
    voice_response: settings.voiceResponse,
    family_alerts: settings.familyAlerts,
    caregiver_name: settings.caregiverName,
    caregiver_phone: settings.caregiverPhone,
  };
}

export function useSettings(userId) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load from Supabase when authenticated
  useEffect(() => {
    if (!userId) return;

    supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        if (data) {
          const merged = { ...DEFAULT_SETTINGS, ...fromDb(data) };
          setSettings(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      });
  }, [userId]);

  // Apply font size class to body
  useEffect(() => {
    document.body.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl');
    document.body.classList.add(settings.fontSize);
  }, [settings.fontSize]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback(
    (updates) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };

        // Write to Supabase if authenticated (fire-and-forget)
        if (userId) {
          supabase
            .from('user_settings')
            .update({ ...toDb(next), updated_at: new Date().toISOString() })
            .eq('user_id', userId);
        }

        return next;
      });
    },
    [userId]
  );

  return { settings, updateSettings };
}
