'use client';

import { useState, useEffect } from 'react';

/**
 * Generic hook that syncs a piece of React state with a localStorage key.
 *
 * - Initialises from localStorage on first client mount (safe: no SSR read).
 * - Persists every state update automatically.
 * - Supports a `null` sentinel to clear the stored value.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | null) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage on client mount only
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // Silently ignore parse errors — fall back to initialValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | null) => {
    try {
      if (value === null) {
        localStorage.removeItem(key);
        setStoredValue(initialValue);
      } else {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Silently ignore write errors (e.g., private browsing quota)
    }
  };

  return [storedValue, setValue];
}
