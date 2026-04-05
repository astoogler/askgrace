import { useState, useEffect, useCallback, useRef } from 'react';
import { trackFeature } from '../utils/analytics';

export function useEmergency(caregiverName, caregiverPhone) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setCountdown(5);
    trackFeature('emergency_bar_tap');
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    setIsOpen(false);
    setCountdown(5);
    trackFeature('emergency_cancelled');
  }, [clearTimer]);

  // Countdown — when it hits 0, open the phone dialer
  useEffect(() => {
    if (!isOpen) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          trackFeature('emergency_triggered');

          // Open phone dialer with caregiver number or 911
          const phone = caregiverPhone ? caregiverPhone.replace(/\D/g, '') : '911';
          window.location.href = `tel:${phone}`;

          setIsOpen(false);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isOpen, clearTimer, caregiverName, caregiverPhone]);

  return { isOpen, countdown, open, cancel };
}
