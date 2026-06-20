'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';
import type { FootprintInput } from '@/validators/footprint.schema';

/**
 * Lightweight hook for pages that only need to know if a footprint exists,
 * without mounting the full FootprintProvider tree.
 */
export function useHasExistingFootprint(): boolean {
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.inputs);
      if (!raw) {
        setHasExistingData(false);
        return;
      }

      const inputs = JSON.parse(raw) as FootprintInput;
      const calculations = calculateTotalFootprint(inputs);
      setHasExistingData(calculations.total > 0);
    } catch {
      setHasExistingData(false);
    }
  }, []);

  return hasExistingData;
}
