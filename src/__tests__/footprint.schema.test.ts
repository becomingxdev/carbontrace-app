import { FootprintSchema } from '@/validators/footprint.schema';

describe('FootprintSchema', () => {
  const validPayload = {
    transport: { carKmPerWeek: 100, busKmPerWeek: 50, trainKmPerWeek: 20, flightHoursPerYear: 5 },
    energy: { electricityKwhPerMonth: 200, naturalGasM3PerMonth: 10, lpgKgPerMonth: 5 },
    food: { beefKgPerWeek: 1, chickenKgPerWeek: 2, dairyKgPerWeek: 3, vegetablesKgPerWeek: 4, processedFoodKgPerWeek: 1 },
    shopping: { clothesItemsPerMonth: 2, electronicsItemsPerYear: 1 },
    waste: { wasteKgPerWeek: 10, recyclePercentage: 30 },
  };

  test('passes validation for a correct, complete payload', () => {
    const result = FootprintSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  test('fails validation if any input value is negative', () => {
    const invalidPayload = {
      ...validPayload,
      transport: { ...validPayload.transport, carKmPerWeek: -10 },
    };
    const result = FootprintSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  test('fails validation if recyclePercentage is less than 0', () => {
    const invalidPayload = {
      ...validPayload,
      waste: { ...validPayload.waste, recyclePercentage: -1 },
    };
    const result = FootprintSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  test('fails validation if recyclePercentage is greater than 100', () => {
    const invalidPayload = {
      ...validPayload,
      waste: { ...validPayload.waste, recyclePercentage: 101 },
    };
    const result = FootprintSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  test('fails validation if any required section or field is missing', () => {
    const { transport, ...incompletePayload } = validPayload;
    const result = FootprintSchema.safeParse(incompletePayload);
    expect(result.success).toBe(false);
  });
});
