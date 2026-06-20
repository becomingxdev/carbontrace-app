import { InsightsResponseSchema, RecommendationSchema } from '@/validators/insights.schema';

describe('InsightsResponseSchema', () => {
  test('accepts valid insights payload', () => {
    const payload = {
      recommendations: [
        { action: 'Cycle to work twice weekly', co2Saved: 120, difficulty: 'Easy' },
      ],
    };

    expect(InsightsResponseSchema.safeParse(payload).success).toBe(true);
  });

  test('rejects invalid difficulty values', () => {
    const payload = {
      recommendations: [
        { action: 'Invalid action', co2Saved: 50, difficulty: 'Very Hard' },
      ],
    };

    expect(InsightsResponseSchema.safeParse(payload).success).toBe(false);
  });

  test('rejects empty recommendations array', () => {
    expect(InsightsResponseSchema.safeParse({ recommendations: [] }).success).toBe(false);
  });
});

describe('RecommendationSchema', () => {
  test('rejects negative co2Saved values', () => {
    const result = RecommendationSchema.safeParse({
      action: 'Test',
      co2Saved: -10,
      difficulty: 'Easy',
    });

    expect(result.success).toBe(false);
  });
});
