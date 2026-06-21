import type { CarbonGoal } from '@/types/history';
import { STORAGE_KEYS } from '@/constants/storage-keys';

export interface GoalProgress {
  currentKg: number;
  targetKg: number;
  targetDate: string;
  progressPercent: number;
  gapRemainingKg: number;
  isOnTrack: boolean;
}

export function loadCarbonGoal(): CarbonGoal | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.goal);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CarbonGoal;
    if (typeof parsed.targetKg !== 'number' || typeof parsed.targetDate !== 'string') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCarbonGoal(goal: CarbonGoal | null): void {
  if (typeof window === 'undefined') return;

  try {
    if (goal === null) {
      localStorage.removeItem(STORAGE_KEYS.goal);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.goal, JSON.stringify(goal));
  } catch {
    // Ignore storage errors
  }
}

export function calculateGoalProgress(currentKg: number, goal: CarbonGoal): GoalProgress {
  const targetKg = Math.max(0, goal.targetKg);
  const gapRemainingKg = Math.max(0, currentKg - targetKg);
  const isOnTrack = currentKg <= targetKg;

  return {
    currentKg,
    targetKg,
    targetDate: goal.targetDate,
    progressPercent: currentKg <= targetKg ? 100 : Math.max(0, 100 - Math.round((gapRemainingKg / currentKg) * 100)),
    gapRemainingKg,
    isOnTrack,
  };
}
