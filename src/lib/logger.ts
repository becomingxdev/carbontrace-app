type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function writeLog(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
  };

  const serialized = JSON.stringify(payload);

  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => writeLog('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => writeLog('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => writeLog('error', message, context),
};
