import type { FootprintHistoryEntry, FootprintTrend } from '@/types/history';
import type { FootprintInput } from '@/validators/footprint.schema';
import type { CalculationResult } from '@/types/footprint';
import { STORAGE_KEYS } from '@/constants/storage-keys';

export const MAX_HISTORY_ENTRIES = 50;

export function loadFootprintHistory(): FootprintHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FootprintHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFootprintHistory(history: FootprintHistoryEntry[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
  } catch {
    // Ignore quota / private browsing errors
  }
}

export function createHistoryEntry(
  inputs: FootprintInput,
  calculations: CalculationResult
): FootprintHistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    date: new Date().toISOString(),
    inputs,
    calculations,
  };
}

export function appendHistoryEntry(
  history: FootprintHistoryEntry[],
  entry: FootprintHistoryEntry
): FootprintHistoryEntry[] {
  return [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
}

export function getFootprintTrend(
  current: FootprintHistoryEntry,
  previous: FootprintHistoryEntry | undefined
): FootprintTrend {
  if (!previous) return 'first';

  const delta = current.calculations.total - previous.calculations.total;
  if (delta === 0) return 'unchanged';
  return delta < 0 ? 'improved' : 'worsened';
}

export function formatHistoryDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
