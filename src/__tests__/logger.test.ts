import { logger } from '@/lib/logger';

describe('logger', () => {
  test('info outputs structured JSON', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('Health check passed', { service: 'carbon-trace' });

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload.level).toBe('info');
    expect(payload.message).toBe('Health check passed');
    expect(payload.context).toEqual({ service: 'carbon-trace' });
    expect(payload.timestamp).toBeDefined();

    spy.mockRestore();
  });

  test('error outputs structured JSON via console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Request failed');

    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('Request failed');

    spy.mockRestore();
  });
});
