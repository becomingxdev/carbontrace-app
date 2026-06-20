import { getFallbackInsights } from '@/lib/fallback-insights';
import { logger } from '@/lib/logger';

describe('fallback insights', () => {
  test('returns deterministic recommendations based on highest category', () => {
    const insights = getFallbackInsights({
      total: 3000,
      breakdown: {
        transport: 1200,
        energy: 800,
        food: 500,
        shopping: 300,
        waste: 200,
      },
    });

    expect(insights.recommendations).toHaveLength(3);
    expect(insights.recommendations[0].action).toContain('public transit');
  });
});

describe('logger warn path', () => {
  test('warn outputs structured JSON', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Retry scheduled', { attempt: 1 });
    expect(JSON.parse(spy.mock.calls[0][0] as string).level).toBe('warn');
    spy.mockRestore();
  });
});
