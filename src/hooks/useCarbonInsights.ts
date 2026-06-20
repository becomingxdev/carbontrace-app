'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { FootprintInput } from '@/validators/footprint.schema';
import type { InsightsResponse } from '@/types/insights';
import { logger } from '@/lib/logger';

interface UseCarbonInsightsOptions {
  inputs: FootprintInput;
  totalFootprint: number;
  existingInsights: InsightsResponse | null;
  onSuccess: (insights: InsightsResponse) => void;
}

interface UseCarbonInsightsResult {
  loading: boolean;
  error: string | null;
  refreshInsights: () => void;
}

export function useCarbonInsights({
  inputs,
  totalFootprint,
  existingInsights,
  onSuccess,
}: UseCarbonInsightsOptions): UseCarbonInsightsResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshRequested, setRefreshRequested] = useState(false);
  const hasFetchedRef = useRef(false);

  const refreshInsights = useCallback(() => {
    hasFetchedRef.current = false;
    setRefreshRequested(true);
  }, []);

  useEffect(() => {
    if (totalFootprint === 0) return;

    const shouldFetch = refreshRequested || (!existingInsights && !hasFetchedRef.current);
    if (!shouldFetch) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      setRefreshRequested(false);

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
        hasFetchedRef.current = true;
        onSuccess(data);
      } catch (err) {
        logger.error('Failed to fetch carbon insights', {
          message: err instanceof Error ? err.message : 'Unknown error',
        });
        setError(
          'Could not process reduction recommendations. Verify your API deployment setup.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFootprint, existingInsights, refreshRequested]);

  return { loading, error, refreshInsights };
}
