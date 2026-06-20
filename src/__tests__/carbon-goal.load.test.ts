/**
 * @jest-environment jsdom
 */

import { loadCarbonGoal } from '@/lib/carbon-goal';
import { STORAGE_KEYS } from '@/constants/storage-keys';

describe('carbon goal load edge cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns null for invalid stored payload', () => {
    localStorage.setItem(STORAGE_KEYS.goal, JSON.stringify({ targetKg: 'bad', targetDate: 123 }));
    expect(loadCarbonGoal()).toBeNull();
  });

  test('returns null when JSON parsing fails', () => {
    localStorage.setItem(STORAGE_KEYS.goal, '{invalid');
    expect(loadCarbonGoal()).toBeNull();
  });
});
