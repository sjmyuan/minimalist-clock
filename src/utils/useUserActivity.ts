import { useState, useEffect, useCallback, useRef } from 'react';

interface UseUserActivityOptions {
  timeout?: number;
  enabled?: boolean;
}

export function useUserActivity(options: UseUserActivityOptions = {}) {
  const { timeout = 3000, enabled = true } = options;
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (!enabled) {
      setIsActive(true);
      return;
    }

    setIsActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, timeout);
  }, [timeout, enabled]);

  useEffect(() => {
    if (!enabled) {
      // Use setTimeout to avoid synchronous state update warning
      const timer = setTimeout(() => setIsActive(true), 0);
      return () => clearTimeout(timer);
    }

    const handleActivity = () => {
      resetTimeout();
    };

    // Listen to various user activity events
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('touchmove', handleActivity);

    // Initial timeout
    const initialTimer = setTimeout(() => resetTimeout(), 0);

    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('touchmove', handleActivity);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout, enabled]);

  return isActive;
}
