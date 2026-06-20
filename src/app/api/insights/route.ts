import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FootprintSchema } from '@/validators/footprint.schema';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';
import type { InsightsResponse } from '@/types/insights';

// ---------------------------------------------------------------------------
// Rate limiting — in-memory, per-IP, 10 req/min
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Checks whether the given IP is within the allowed request window.
 * Also purges stale entries from the Map to prevent unbounded memory growth.
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // R8: Sweep expired entries to prevent indefinite Map growth
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }

  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true; // within limit
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // exceeded
  }

  entry.count += 1;
  return true;
}

// ---------------------------------------------------------------------------
// Gemini 2.5 Flash via Google Gen AI SDK (Vertex AI backend)
// Lazy-initialized inside the handler so Next.js build does not attempt
// credential validation during static page collection.
// On Cloud Run, ADC authenticates via the attached service account.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Safe JSON extraction — strips markdown fences if present
// ---------------------------------------------------------------------------
function parseAIResponse(raw: string): InsightsResponse {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const cleaned = fenceMatch ? fenceMatch[1].trim() : raw.trim();
  return JSON.parse(cleaned) as InsightsResponse;
}

// ---------------------------------------------------------------------------
// POST /api/insights
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // 2. Validate input payload with Zod
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

    // 3. Context-injection prompt — user's exact numbers, not generic advice
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

    // 4. Call Gemini 2.5 Flash
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
      throw new Error('Gemini returned an empty response.');
    }

    // 5. Safe JSON parse with typed return (R9)
    const structuredData: InsightsResponse = parseAIResponse(responseText);
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Internal system engine processing failure.' },
      { status: 500 }
    );
  }
}