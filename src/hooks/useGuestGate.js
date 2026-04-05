import { useState, useCallback } from 'react';

const LOCAL_KEY = 'agrace_guest_chats';

// Tracks guest message count for instant UI feedback.
// The server (Edge Function) is the source of truth — this is just for fast UX.
export function useGuestGate(isAuthenticated) {
  const [isGateActive, setIsGateActive] = useState(false);

  const getLocalCount = useCallback(() => {
    try {
      return parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10);
    } catch {
      return 0;
    }
  }, []);

  const incrementLocal = useCallback(() => {
    const count = getLocalCount() + 1;
    localStorage.setItem(LOCAL_KEY, count.toString());
  }, [getLocalCount]);

  // Called when the Edge Function returns 403 { gate: 'signup_required' }
  const triggerGate = useCallback(() => {
    setIsGateActive(true);
  }, []);

  const dismissGate = useCallback(() => {
    setIsGateActive(false);
  }, []);

  // Clear gate if user becomes authenticated
  const clearGate = useCallback(() => {
    setIsGateActive(false);
  }, []);

  return {
    isGateActive: !isAuthenticated && isGateActive,
    triggerGate,
    dismissGate,
    clearGate,
    incrementLocal,
    getLocalCount,
  };
}
