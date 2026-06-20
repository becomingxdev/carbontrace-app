import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FootprintSchema } from '@/validators/footprint.schema';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';

// Instantiate the Google Gen AI client using our secure server variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate the incoming footprint configuration payload using Zod
    const body = await req.json();
    const validationResult = FootprintSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid footprint input parameters provided.' },
        { status: 400 }
      );
    }

    const userData = validationResult.data;
    
    // 2. Generate pure contextual mathematical values for our prompt injection layer
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

    // 3. Call the Gemini model using the official SDK configuration syntax
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        // Enforce structural JSON parsing at the model architecture layer
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini model returned an empty generation stream.');
    }

    // 4. Return the structured recommendations directly to the front-end client layer
    const structuredData = JSON.parse(responseText);
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('API Error: Encountered failure in insights processing:', error);
    
    // Safety Fallback: Return a clean, user-friendly error layout while noting rate limits
    return NextResponse.json(
      { error: 'Internal system engine processing timeout. Rate limits or key configurations may be checked.' },
      { status: 500 }
    );
  }
}