import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { FootprintSchema } from '@/validators/footprint.schema';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';

// Initialize Vertex AI using your GCP configuration
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID || '',
  location: process.env.GCP_LOCATION || 'us-central1'
});

export async function POST(req: NextRequest) {
  try {
    // 1. Validate input payload
    const body = await req.json();
    const validationResult = FootprintSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid footprint input parameters provided.' },
        { status: 400 }
      );
    }

    const userData = validationResult.data;
    const calculations = calculateTotalFootprint(userData);

    // 2. Build system context injection prompt
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

    // 3. Get the generative model instance via Vertex AI
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Enterprise stable version identifier on Vertex
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    // 4. Request generation content stream
    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
    });

    const responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Vertex AI model returned an empty generation stream.');
    }

    // 5. Return structured response directly to client layer
    const structuredData = JSON.parse(responseText);
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('GCP Vertex AI Error:', error);
    return NextResponse.json(
      { error: 'Internal system engine processing failure on Google Cloud Platform.' },
      { status: 500 }
    );
  }
}