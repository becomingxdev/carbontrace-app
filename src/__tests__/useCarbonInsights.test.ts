/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useCarbonInsights } from '@/hooks/useCarbonInsights';

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('useCarbonInsights', () => {
  const mockInputs = {
    transport: { carKmPerWeek: 10, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
    energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
    food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
    shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
    waste: { wasteKgPerWeek: 0, recyclePercentage: 0 },
  };

  const mockSuccessData = {
    recommendations: [{ action: 'Do something', co2Saved: 100, difficulty: 'Easy' }],
  };

  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('does not fetch and returns idle when total footprint is zero', async () => {
    const mockOnSuccess = jest.fn();
    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 0,
        existingInsights: null,
        onSuccess: mockOnSuccess,
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('does not fetch and returns idle if existing insights are present', () => {
    const mockOnSuccess = jest.fn();
    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: mockSuccessData,
        onSuccess: mockOnSuccess,
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('orchestrates successful API calls and loading state transitions', async () => {
    const mockOnSuccess = jest.fn();
    let resolveResponse: (value: unknown) => void = () => {};
    
    const responsePromise = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValue(responsePromise);

    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: null,
        onSuccess: mockOnSuccess,
      })
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolveResponse({
        ok: true,
        json: async () => mockSuccessData,
      });
      await responsePromise;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockOnSuccess).toHaveBeenCalledWith(mockSuccessData);
  });

  test('handles API network/server errors gracefully', async () => {
    const mockOnSuccess = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: null,
        onSuccess: mockOnSuccess,
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      'Could not process reduction recommendations. Verify your API deployment setup.'
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('refreshInsights triggers a new fetch request', async () => {
    const mockOnSuccess = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSuccessData,
    });

    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: mockSuccessData,
        onSuccess: mockOnSuccess,
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => {
      result.current.refreshInsights();
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
