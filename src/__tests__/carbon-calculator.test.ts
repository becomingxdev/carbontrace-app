import {
  calculateTotalFootprint as calculateFootprint,
  calculateCommittedSavings,
} from '@/lib/carbon-calculator';

const zeroInput = {
  transport: { carKmPerWeek: 0, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
  energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
  food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
  shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
  waste: { wasteKgPerWeek: 0, recyclePercentage: 0 },
};

describe('calculateFootprint', () => {
  test('returns zero total for all-zero inputs', () => {
    const result = calculateFootprint(zeroInput);
    expect(result.total).toBe(0);
  });

  test('all category breakdowns are zero for zero inputs', () => {
    const result = calculateFootprint(zeroInput);
    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.energy).toBe(0);
    expect(result.breakdown.food).toBe(0);
    expect(result.breakdown.shopping).toBe(0);
    expect(result.breakdown.waste).toBe(0);
  });

  test('car transport calculation is correct', () => {
    const input = { ...zeroInput, transport: { ...zeroInput.transport, carKmPerWeek: 100 } };
    const result = calculateFootprint(input);
    expect(result.breakdown.transport).toBeCloseTo(1092, 0);
  });

  test('electricity calculation uses India grid factor', () => {
    const input = { ...zeroInput, energy: { ...zeroInput.energy, electricityKwhPerMonth: 100 } };
    const result = calculateFootprint(input);
    expect(result.breakdown.energy).toBeCloseTo(984, 0);
  });

  test('beef consumption has highest food emission factor', () => {
    const beefInput = { ...zeroInput, food: { ...zeroInput.food, beefKgPerWeek: 1 } };
    const chickenInput = { ...zeroInput, food: { ...zeroInput.food, chickenKgPerWeek: 1 } };
    expect(calculateFootprint(beefInput).breakdown.food).toBeGreaterThan(
      calculateFootprint(chickenInput).breakdown.food
    );
  });

  test('total equals sum of all category breakdowns', () => {
    const input = {
      ...zeroInput,
      transport: { ...zeroInput.transport, carKmPerWeek: 50 },
      energy: { ...zeroInput.energy, electricityKwhPerMonth: 200 },
      food: { ...zeroInput.food, chickenKgPerWeek: 0.5 },
    };
    const result = calculateFootprint(input);
    const sum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
    expect(result.total).toBeCloseTo(sum, 5);
  });

  test('100% recycling reduces but does not eliminate waste emissions', () => {
    const noRecycle = { ...zeroInput, waste: { wasteKgPerWeek: 10, recyclePercentage: 0 } };
    const fullRecycle = { ...zeroInput, waste: { wasteKgPerWeek: 10, recyclePercentage: 100 } };
    expect(calculateFootprint(fullRecycle).breakdown.waste).toBeGreaterThan(0);
    expect(calculateFootprint(fullRecycle).breakdown.waste).toBeLessThan(
      calculateFootprint(noRecycle).breakdown.waste
    );
  });

  test('typical Indian household is within a reasonable range', () => {
    const typicalInput = {
      transport: { carKmPerWeek: 80, busKmPerWeek: 20, trainKmPerWeek: 10, flightHoursPerYear: 2 },
      energy: { electricityKwhPerMonth: 150, naturalGasM3PerMonth: 5, lpgKgPerMonth: 3 },
      food: { beefKgPerWeek: 0.1, chickenKgPerWeek: 0.5, dairyKgPerWeek: 1, vegetablesKgPerWeek: 2, processedFoodKgPerWeek: 0.5 },
      shopping: { clothesItemsPerMonth: 8, electronicsItemsPerYear: 1 },
      waste: { wasteKgPerWeek: 5, recyclePercentage: 20 },
    };
    const result = calculateFootprint(typicalInput);
    expect(result.total).toBeGreaterThan(500);
    expect(result.total).toBeLessThan(6000);
  });
});

describe('calculateCommittedSavings', () => {
  const recommendations = [
    { action: 'Switch to LED bulbs', co2Saved: 150, difficulty: 'Easy' as const },
    { action: 'Reduce meat consumption', co2Saved: 300, difficulty: 'Medium' as const },
    { action: 'Use public transport', co2Saved: 600, difficulty: 'Hard' as const },
  ];

  test('returns zero for empty committed actions', () => {
    const result = calculateCommittedSavings(recommendations, []);
    expect(result).toBe(0);
  });

  test('sums CO2 savings for valid committed actions', () => {
    const result = calculateCommittedSavings(recommendations, [
      'Switch to LED bulbs',
      'Use public transport',
    ]);
    expect(result).toBe(750);
  });

  test('returns zero for unknown actions', () => {
    const result = calculateCommittedSavings(recommendations, [
      'Unknown action name',
      'Another fake action',
    ]);
    expect(result).toBe(0);
  });

  test('sums CO2 savings for mixed valid and invalid/unknown actions', () => {
    const result = calculateCommittedSavings(recommendations, [
      'Switch to LED bulbs',
      'Unknown action name',
      'Reduce meat consumption',
    ]);
    expect(result).toBe(450);
  });
});