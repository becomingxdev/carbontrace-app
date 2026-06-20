import { parseAIResponse } from '@/lib/parse-ai-response';

describe('parseAIResponse', () => {
  const validPayload = {
    recommendations: [
      { action: 'Use public transit', co2Saved: 200, difficulty: 'Easy' },
    ],
  };

  test('parses plain JSON responses', () => {
    const result = parseAIResponse(JSON.stringify(validPayload));
    expect(result).toEqual(validPayload);
  });

  test('parses markdown json fenced responses', () => {
    const raw = `\`\`\`json\n${JSON.stringify(validPayload)}\n\`\`\``;
    expect(parseAIResponse(raw)).toEqual(validPayload);
  });

  test('parses markdown fenced responses without json label', () => {
    const raw = `\`\`\`\n${JSON.stringify(validPayload)}\n\`\`\``;
    expect(parseAIResponse(raw)).toEqual(validPayload);
  });

  test('extracts JSON surrounded by extra text', () => {
    const raw = `Here are your recommendations:\n${JSON.stringify(validPayload)}\nThanks!`;
    expect(parseAIResponse(raw)).toEqual(validPayload);
  });

  test('throws on empty response', () => {
    expect(() => parseAIResponse('')).toThrow('Empty AI response');
    expect(() => parseAIResponse('   ')).toThrow('Empty AI response');
  });

  test('throws on malformed response', () => {
    expect(() => parseAIResponse('not json at all')).toThrow('Malformed AI response');
  });
});
