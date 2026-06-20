/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  const testKey = 'test-key';
  const initialVal = { name: 'Carbon Trace' };

  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  test('returns initial value when local storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));
    expect(result.current[0]).toEqual(initialVal);
  });

  test('hydrates state with parsed value from local storage on mount', () => {
    const storedVal = { name: 'Updated Carbon' };
    window.localStorage.setItem(testKey, JSON.stringify(storedVal));

    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));

    // Initially it might be initialVal during render and hydrates via useEffect
    expect(result.current[0]).toEqual(storedVal);
  });

  test('saves state updates back to local storage', () => {
    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));
    const newVal = { name: 'New Carbon value' };

    act(() => {
      result.current[1](newVal);
    });

    expect(result.current[0]).toEqual(newVal);
    expect(window.localStorage.getItem(testKey)).toBe(JSON.stringify(newVal));
  });

  test('removes item from storage and falls back to initial value when passed null', () => {
    window.localStorage.setItem(testKey, JSON.stringify({ name: 'Old' }));

    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toEqual(initialVal);
    expect(window.localStorage.getItem(testKey)).toBeNull();
  });

  test('handles JSON parsing failure gracefully by using initial value', () => {
    window.localStorage.setItem(testKey, 'invalid-json-{');

    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));

    expect(result.current[0]).toEqual(initialVal);
  });

  test('handles localStorage write errors gracefully', () => {
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage(testKey, initialVal));

    // Should update state in-memory even if localStorage fails
    act(() => {
      result.current[1]({ name: 'No Storage' });
    });

    expect(result.current[0]).toEqual({ name: 'No Storage' });
    mockSetItem.mockRestore();
  });
});
