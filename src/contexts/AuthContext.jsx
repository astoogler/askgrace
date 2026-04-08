import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabase';
import { migrateLocalDataToSupabase } from '../utils/migration';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);

        // Run one-time migration when user first authenticates
        if (s?.user) {
          await migrateLocalDataToSupabase(supabase, s.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOAuth = useCallback(async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email, password, displayName, phone = '', optIn = false) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName, phone },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    // Save phone and opt-in to profiles table if user was created
    if (data?.user?.id && (phone || optIn)) {
      supabase.from('profiles').update({
        phone: phone || '',
        sms_opt_in: optIn,
        email_opt_in: optIn,
        opted_in_at: optIn ? new Date().toISOString() : null,
      }).eq('id', data.user.id).then(() => {});
    }

    // Supabase returns a user with identities=[] when email confirmation is required
    if (data?.user && data.user.identities?.length === 0) {
      throw new Error('email_confirmation_required');
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithOAuth,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
