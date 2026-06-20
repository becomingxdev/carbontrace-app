import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FootprintSchema } from '@/validators/footprint.schema';
import { InsightsResponseSchema } from '@/validators/insights.schema';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';
import { parseAIResponse } from '@/lib/parse-ai-response';
import { getFallbackInsights } from '@/lib/fallback-insights';
import { withRetry, RetryableError } from '@/lib/retry';
import { logger } from '@/lib/logger';
import type { InsightsResponse } from '@/types/insights';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }

  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

let _ai: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID || '',
      location: process.env.GCP_LOCATION || 'us-central1',
    });
  }
  return _ai;
}

function validateInsightsPayload(payload: unknown, calculations: ReturnType<typeof calculateTotalFootprint>): InsightsResponse {
  const validationResult = InsightsResponseSchema.safeParse(payload);

  if (validationResult.success) {
    return validationResult.data;
  }

  logger.error('AI insights validation failed', {
    issues: validationResult.error.issues,
  });

  return getFallbackInsights(calculations);
}

async function generateInsights(systemPrompt: string): Promise<string> {
  return withRetry(async () => {
    try {
      const response = await getAIClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new RetryableError('Gemini returned an empty response.', 500);
      }

      return responseText;
    } catch (error) {
      if (isRetryableStatus(error)) {
        throw new RetryableError(
          error instanceof Error ? error.message : 'Retryable Gemini API error',
          extractStatus(error)
        );
      }
      throw error;
    }
  }, { maxRetries: 3, baseDelayMs: 1000 });
}

function isRetryableStatus(error: unknown): boolean {
  const status = extractStatus(error);
  return status === 429 || (status !== undefined && status >= 500);
}

function extractStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error && typeof (error as { status: unknown }).status === 'number') {
      return (error as { status: number }).status;
    }
    if ('statusCode' in error && typeof (error as { statusCode: unknown }).statusCode === 'number') {
      return (error as { statusCode: number }).statusCode;
    }
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body: unknown = await req.json();
    const validationResult = FootprintSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid footprint input parameters provided.' },
        { status: 400 }
      );
    }

    const userData = validationResult.data;
    const calculations = calculateTotalFootprint(userData);

    const systemPrompt = `You are an elite carbon footprint reduction advisor.
The user's annual carbon footprint is calculated at ${calculations.total} kg CO2e, broken down categorically as:
- Transport: ${calculations.breakdown.transport} kg CO2e
- Home Energy: ${calculations.breakdown.energy} kg CO2e
- Food & Diet: ${calculations.breakdown.food} kg CO2e
- Shopping: ${calculations.breakdown.shopping} kg CO2e
- Waste: ${calculations.breakdown.waste} kg CO2e

Context Benchmarks: India annual average is 1,900 kg. Global annual average is 4,800 kg. The Paris Target goal is 2,000 kg.

Respond with exactly 5 highly specific, tailored, actionable recommendations targeting their highest impact category segments. For each action item, estimate the kg CO2e saved per year and set difficulty strictly to 'Easy', 'Medium', or 'Hard'.

You must return your response inside a valid JSON object matching this structure exactly:
{
  "recommendations": [
    { "action": "Clear detailed description here", "co2Saved": 420, "difficulty": "Easy" }
  ]
}`;

    const responseText = await generateInsights(systemPrompt);
    const parsedPayload = parseAIResponse(responseText);
    const structuredData = validateInsightsPayload(parsedPayload, calculations);

    return NextResponse.json(structuredData);
  } catch (error) {
    logger.error('Gemini API Error', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal system engine processing failure.' },
      { status: 500 }
    );
  }
}
