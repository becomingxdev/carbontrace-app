/**
 * @jest-environment jsdom
 */

import { calculateGoalProgress, saveCarbonGoal, loadCarbonGoal } from '@/lib/carbon-goal';

describe('carbon goal utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('calculateGoalProgress returns gap and progress metrics', () => {
    const progress = calculateGoalProgress(2500, {
      targetKg: 2000,
      targetDate: '2026-12-31',
    });

    expect(progress.gapRemainingKg).toBe(500);
    expect(progress.targetKg).toBe(2000);
    expect(progress.progressPercent).toBeLessThan(100);
  });

  test('calculateGoalProgress shows 100% when target is met', () => {
    const progress = calculateGoalProgress(1800, {
      targetKg: 2000,
      targetDate: '2026-12-31',
    });

    expect(progress.gapRemainingKg).toBe(0);
    expect(progress.progressPercent).toBe(100);
  });

  test('persists and loads goals from localStorage', () => {
    const goal = { targetKg: 2000, targetDate: '2026-12-31' };
    saveCarbonGoal(goal);

    expect(loadCarbonGoal()).toEqual(goal);
  });
});
