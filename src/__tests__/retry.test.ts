import { withRetry, RetryableError, isRetryableError } from '@/lib/retry';

describe('retry utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('isRetryableError identifies retryable status codes', () => {
    expect(isRetryableError(new RetryableError('rate limited', 429))).toBe(true);
    expect(isRetryableError(new RetryableError('server error', 503))).toBe(true);
    expect(isRetryableError(new Error('validation failed'))).toBe(false);
  });

  test('withRetry retries retryable errors up to maxRetries', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new RetryableError('temporary', 503))
      .mockRejectedValueOnce(new RetryableError('temporary', 503))
      .mockResolvedValueOnce('success');

    const promise = withRetry(operation, { maxRetries: 3, baseDelayMs: 100 });

    await jest.runAllTimersAsync();
    await expect(promise).resolves.toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  test('withRetry does not retry non-retryable errors', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('bad request'));

    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 100 })).rejects.toThrow('bad request');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  test('isRetryableError detects network-like failures', () => {
    expect(isRetryableError(new Error('network failure'))).toBe(true);
    expect(isRetryableError({ status: 502 })).toBe(true);
    expect(isRetryableError({ statusCode: 503 })).toBe(true);
  });
});
