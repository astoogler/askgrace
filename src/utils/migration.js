// One-time migration of localStorage data to Supabase on first login.
// Runs automatically via AuthContext after successful auth.

const MIGRATION_FLAG = 'agrace_migrated';

export async function migrateLocalDataToSupabase(supabase, userId) {
  // Skip if already migrated for this user
  if (localStorage.getItem(MIGRATION_FLAG) === userId) return;

  try {
    // Migrate settings
    const storedSettings = localStorage.getItem('agrace_settings');
    if (storedSettings) {
      const s = JSON.parse(storedSettings);
      await supabase.from('user_settings').upsert({
        user_id: userId,
        language: s.language || 'en-US',
        font_size: s.fontSize || 'font-md',
        high_contrast: s.highContrast || false,
        voice_response: s.voiceResponse || false,
        family_alerts: s.familyAlerts !== false,
        caregiver_name: s.caregiverName || '',
        caregiver_phone: s.caregiverPhone || '',
      });
    }

    // Migrate reminders
    const storedReminders = localStorage.getItem('agrace_reminders');
    if (storedReminders) {
      const reminders = JSON.parse(storedReminders);
      const rows = reminders.map((r, i) => ({
        user_id: userId,
        name: r.name,
        time: r.time,
        type: r.type,
        done: r.done || false,
        sort_order: i,
      }));
      if (rows.length > 0) {
        await supabase.from('reminders').insert(rows);
      }
    }

    // Mark guest session as converted
    const anonId = localStorage.getItem('agrace_anon_id');
    if (anonId) {
      await supabase.rpc('mark_guest_converted', {
        p_anon_id: anonId,
        p_user_id: userId,
      });
    }

    // Mark migration complete — keep localStorage as offline cache
    localStorage.setItem(MIGRATION_FLAG, userId);
  } catch (err) {
    // Migration is best-effort — don't block the user if it fails
    // They can still use Supabase defaults and re-enter data
  }
}
