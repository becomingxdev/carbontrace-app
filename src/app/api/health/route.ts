import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  const payload = {
    status: 'ok' as const,
    service: 'carbon-trace',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GCP_PROJECT_ID),
  };

  logger.info('Health check requested', { geminiConfigured: payload.geminiConfigured });

  return NextResponse.json(payload);
}
