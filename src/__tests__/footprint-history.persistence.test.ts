/**
 * @jest-environment jsdom
 */

import {
  loadFootprintHistory,
  saveFootprintHistory,
  formatHistoryDate,
} from '@/lib/footprint-history';
import { STORAGE_KEYS } from '@/constants/storage-keys';

describe('footprint history persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loadFootprintHistory returns empty array when storage is missing', () => {
    expect(loadFootprintHistory()).toEqual([]);
  });

  test('saveFootprintHistory and loadFootprintHistory round-trip entries', () => {
    const entry = {
      id: '1',
      date: '2026-06-20T00:00:00.000Z',
      inputs: {
        transport: { carKmPerWeek: 0, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
        energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
        food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
        shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
        waste: { wasteKgPerWeek: 0, recyclePercentage: 0 },
      },
      calculations: {
        total: 100,
        breakdown: { transport: 20, energy: 20, food: 20, shopping: 20, waste: 20 },
      },
    };

    saveFootprintHistory([entry]);
    expect(localStorage.getItem(STORAGE_KEYS.history)).toBeTruthy();
    expect(loadFootprintHistory()).toEqual([entry]);
  });

  test('formatHistoryDate renders a readable label', () => {
    const formatted = formatHistoryDate('2026-06-20T12:00:00.000Z');
    expect(formatted).toContain('2026');
  });
});
