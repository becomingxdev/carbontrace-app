'use client';

import { useEffect, useState } from 'react';
import type { FootprintInput } from '@/validators/footprint.schema';
import type { InsightsResponse } from '@/types/insights';

interface UseCarbonInsightsOptions {
  inputs: FootprintInput;
  totalFootprint: number;
  existingInsights: InsightsResponse | null;
  onSuccess: (insights: InsightsResponse) => void;
}

interface UseCarbonInsightsResult {
  loading: boolean;
  error: string | null;
}

/**
 * Handles fetching personalised AI reduction recommendations.
 *
 * Responsibilities:
 *  - Fires the POST /api/insights request when `totalFootprint > 0` and no cached
 *    insights exist yet.
 *  - Manages loading and error UI states.
 *  - Delegates the cached-insights state write back to the caller via `onSuccess`.
 *
 * The consuming page component is therefore responsible only for rendering.
 */
export function useCarbonInsights({
  inputs,
  totalFootprint,
  existingInsights,
  onSuccess,
}: UseCarbonInsightsOptions): UseCarbonInsightsResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Do not fire if there is no data or if we already have cached results
    if (totalFootprint === 0 || existingInsights) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve server insights response.');
        }

        const data: InsightsResponse = await res.json();
        onSuccess(data);
      } catch (err) {
        console.error(err);
        setError(
          'Could not process reduction recommendations. Verify your API deployment setup.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFootprint, existingInsights]);

  return { loading, error };
}
