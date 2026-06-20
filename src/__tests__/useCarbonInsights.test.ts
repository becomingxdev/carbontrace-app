/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useCarbonInsights } from '@/hooks/useCarbonInsights';

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
    // Setup a clean spy/mock for fetch
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
    let resolveResponse: (value: any) => void = () => {};
    
    // Create a controllable promise to capture loading state midway
    const responsePromise = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValue(responsePromise);

    const { result, rerender } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: null,
        onSuccess: mockOnSuccess,
      })
    );

    // Assert fetch was called and loading state goes true
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Resolve the API call
    await act(async () => {
      resolveResponse({
        ok: true,
        json: async () => mockSuccessData,
      });
      // Wait for all microtasks to settle
      await responsePromise;
    });

    // Check post-resolve state
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

    // Prevent console.error clutter in test runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useCarbonInsights({
        inputs: mockInputs,
        totalFootprint: 500,
        existingInsights: null,
        onSuccess: mockOnSuccess,
      })
    );

    // Wait for async fetch to finish and set state
    await act(async () => {
      await Promise.resolve(); // flush microtasks
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      'Could not process reduction recommendations. Verify your API deployment setup.'
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
