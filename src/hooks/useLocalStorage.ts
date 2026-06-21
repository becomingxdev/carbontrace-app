'use client';

import { useState, useEffect, useCallback } from 'react';

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
): [T, (value: T | null | ((val: T) => T | null)) => void] {
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

  const setValue = useCallback((value: T | null | ((val: T) => T | null)) => {
    setStoredValue((prev) => {
      let valueToStore: T | null;

      try {
        valueToStore = value instanceof Function ? value(prev) : value;
      } catch {
        return prev;
      }

      if (valueToStore === null) {
        try {
          localStorage.removeItem(key);
        } catch {
          return prev;
        }
        return initialValue;
      }

      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // Silently ignore write errors (e.g., private browsing quota)
      }

      return valueToStore;
    });
  }, [key, initialValue]);

  return [storedValue, setValue];
}
