export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
}

export class RetryableError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'RetryableError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof RetryableError) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('fetch failed')
    ) {
      return true;
    }
  }

  const statusCode = extractStatusCode(error);
  if (statusCode === 429) return true;
  if (statusCode !== undefined && statusCode >= 500) return true;

  return false;
}

function extractStatusCode(error: unknown): number | undefined {
  if (error instanceof RetryableError && error.statusCode !== undefined) {
    return error.statusCode;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number') return status;
  }

  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const statusCode = (error as { statusCode: unknown }).statusCode;
    if (typeof statusCode === 'number') return statusCode;
  }

  return undefined;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      await sleep(baseDelayMs * Math.pow(2, attempt));
    }
  }

  throw lastError;
}
