/**
 * Core footprint calculation domain types.
 * Single source of truth — consumed by context, components, and API route.
 */

export interface EmissionBreakdown {
  transport: number;
  energy: number;
  food: number;
  shopping: number;
  waste: number;
}

export interface CalculationResult {
  total: number;
  breakdown: EmissionBreakdown;
}
