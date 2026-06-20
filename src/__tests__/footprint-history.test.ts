import {
  appendHistoryEntry,
  createHistoryEntry,
  getFootprintTrend,
  MAX_HISTORY_ENTRIES,
} from '@/lib/footprint-history';

const mockInputs = {
  transport: { carKmPerWeek: 10, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
  energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
  food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
  shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
  waste: { wasteKgPerWeek: 0, recyclePercentage: 0 },
};

describe('footprint history utilities', () => {
  test('createHistoryEntry stores inputs and calculations', () => {
    const entry = createHistoryEntry(mockInputs, {
      total: 500,
      breakdown: { transport: 100, energy: 100, food: 100, shopping: 100, waste: 100 },
    });

    expect(entry.inputs).toEqual(mockInputs);
    expect(entry.calculations.total).toBe(500);
    expect(entry.id).toBeDefined();
    expect(entry.date).toBeDefined();
  });

  test('appendHistoryEntry keeps latest entries first and caps history size', () => {
    const baseEntry = createHistoryEntry(mockInputs, {
      total: 100,
      breakdown: { transport: 20, energy: 20, food: 20, shopping: 20, waste: 20 },
    });

    let history = [baseEntry];
    for (let i = 0; i < MAX_HISTORY_ENTRIES + 5; i++) {
      history = appendHistoryEntry(history, createHistoryEntry(mockInputs, {
        total: 100 + i,
        breakdown: { transport: 20, energy: 20, food: 20, shopping: 20, waste: 20 },
      }));
    }

    expect(history).toHaveLength(MAX_HISTORY_ENTRIES);
    expect(history[0].calculations.total).toBeGreaterThan(history[1].calculations.total);
  });

  test('getFootprintTrend compares consecutive entries', () => {
    const current = createHistoryEntry(mockInputs, {
      total: 400,
      breakdown: { transport: 80, energy: 80, food: 80, shopping: 80, waste: 80 },
    });
    const previous = createHistoryEntry(mockInputs, {
      total: 500,
      breakdown: { transport: 100, energy: 100, food: 100, shopping: 100, waste: 100 },
    });

    expect(getFootprintTrend(current, undefined)).toBe('first');
    expect(getFootprintTrend(current, previous)).toBe('improved');
    expect(getFootprintTrend(previous, current)).toBe('worsened');
  });
});
