import { POST } from '@/app/api/insights/route';
import { NextRequest, NextResponse } from 'next/server';

const mockGenerateContent = jest.fn();

// Mock GoogleGenAI SDK
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent,
        },
      };
    }),
  };
});

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn(),
    NextResponse: {
      json: jest.fn((data, init) => {
        return {
          status: init?.status ?? 200,
          json: async () => data,
        };
      }),
    },
  };
});

describe('POST /api/insights', () => {
  const validInputs = {
    transport: { carKmPerWeek: 100, busKmPerWeek: 50, trainKmPerWeek: 20, flightHoursPerYear: 5 },
    energy: { electricityKwhPerMonth: 200, naturalGasM3PerMonth: 10, lpgKgPerMonth: 5 },
    food: { beefKgPerWeek: 1, chickenKgPerWeek: 2, dairyKgPerWeek: 3, vegetablesKgPerWeek: 4, processedFoodKgPerWeek: 1 },
    shopping: { clothesItemsPerMonth: 2, electronicsItemsPerYear: 1 },
    waste: { wasteKgPerWeek: 10, recyclePercentage: 30 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createMockRequest = (body: any, ip = '127.0.0.1') => {
    return {
      headers: {
        get: (key: string) => {
          if (key === 'x-forwarded-for') return ip;
          return null;
        },
      },
      json: async () => body,
    } as unknown as NextRequest;
  };

  test('successfully retrieves and parses insights from Gemini', async () => {
    const mockGeminiResponse = {
      recommendations: [
        { action: 'Install solar panels', co2Saved: 800, difficulty: 'Hard' },
        { action: 'Eat vegetarian twice a week', co2Saved: 200, difficulty: 'Easy' },
      ],
    };

    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(mockGeminiResponse),
    });

    const req = createMockRequest(validInputs, 'ip-success-1');
    const response = (await POST(req)) as any;

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockGeminiResponse);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  test('returns fallback recommendations when AI payload fails validation', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        recommendations: [{ action: 'Bad action', co2Saved: -5, difficulty: 'Very Hard' }],
      }),
    });

    const req = createMockRequest(validInputs, 'ip-invalid-ai');
    const response = (await POST(req)) as any;

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.recommendations.length).toBeGreaterThan(0);
    expect(data.recommendations[0].difficulty).toMatch(/Easy|Medium|Hard/);
  });

  test('correctly parses markdown-wrapped JSON response from Gemini', async () => {
    const mockGeminiResponse = {
      recommendations: [
        { action: 'Compost organic waste', co2Saved: 100, difficulty: 'Easy' },
      ],
    };

    // Simulate standard Markdown code fences returned by models
    const rawMarkdown = `\`\`\`json\n${JSON.stringify(mockGeminiResponse)}\n\`\`\``;

    mockGenerateContent.mockResolvedValueOnce({
      text: rawMarkdown,
    });

    const req = createMockRequest(validInputs, 'ip-markdown-2');
    const response = (await POST(req)) as any;

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockGeminiResponse);
  });

  test('returns 400 status on schema validation failure', async () => {
    const invalidInputs = {
      ...validInputs,
      waste: { wasteKgPerWeek: 10, recyclePercentage: 150 }, // Invalid percentage
    };

    const req = createMockRequest(invalidInputs, 'ip-validation-3');
    const response = (await POST(req)) as any;

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Invalid footprint input parameters provided.');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns 429 status when rate limit is exceeded', async () => {
    const ip = '1.2.3.4';
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        recommendations: [{ action: 'Use LED bulbs', co2Saved: 50, difficulty: 'Easy' }],
      }),
    });

    for (let i = 0; i < 10; i++) {
      const req = createMockRequest(validInputs, ip);
      const res = (await POST(req)) as any;
      expect(res.status).toBe(200);
    }

    // The 11th request from the same IP should be blocked
    const blockedReq = createMockRequest(validInputs, ip);
    const blockedRes = (await POST(blockedReq)) as any;

    expect(blockedRes.status).toBe(429);
    const blockedData = await blockedRes.json();
    expect(blockedData.error).toBe('Too many requests');
  });

  test('returns 500 status when the GoogleGenAI SDK fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('SDK Connection Timeout'));

    const req = createMockRequest(validInputs, 'ip-failure-5');
    const responsePromise = POST(req);
    await jest.runAllTimersAsync();
    const response = (await responsePromise) as any;

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal system engine processing failure.');
  });

  test('returns 500 status when Gemini returns an empty response text', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '',
    });

    const req = createMockRequest(validInputs, 'ip-empty-text');
    const responsePromise = POST(req);
    await jest.runAllTimersAsync();
    const response = (await responsePromise) as any;

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal system engine processing failure.');
  });

  test('sweeps expired entries from rate limiter map after window expires', async () => {
    const ip = 'ip-expired-cleanup';
    const dateSpy = jest.spyOn(Date, 'now');
    
    // First request at time = 1000
    dateSpy.mockReturnValue(1000);
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        recommendations: [{ action: 'Use LED bulbs', co2Saved: 50, difficulty: 'Easy' }],
      }),
    });
    let req = createMockRequest(validInputs, ip);
    let res = (await POST(req)) as any;
    expect(res.status).toBe(200);

    dateSpy.mockReturnValue(62000);
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        recommendations: [{ action: 'Use LED bulbs', co2Saved: 50, difficulty: 'Easy' }],
      }),
    });
    // This request triggers the sweep check which deletes the expired entry
    req = createMockRequest(validInputs, 'another-ip-to-trigger-sweep');
    res = (await POST(req)) as any;
    expect(res.status).toBe(200);

    dateSpy.mockRestore();
  });
});
