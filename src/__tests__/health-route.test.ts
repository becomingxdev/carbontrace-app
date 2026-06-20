import { GET } from '@/app/api/health/route';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      status: 200,
      json: async () => data,
    })),
  },
}));

describe('GET /api/health', () => {
  test('returns ok status payload', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.status).toBe('ok');
    expect(data.service).toBe('carbon-trace');
    expect(typeof data.timestamp).toBe('string');
    expect(typeof data.geminiConfigured).toBe('boolean');
  });
});
