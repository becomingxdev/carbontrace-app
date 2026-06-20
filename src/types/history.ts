import type { FootprintInput } from '@/validators/footprint.schema';
import type { CalculationResult } from '@/types/footprint';

export interface FootprintHistoryEntry {
  id: string;
  date: string;
  inputs: FootprintInput;
  calculations: CalculationResult;
}

export interface CarbonGoal {
  targetKg: number;
  targetDate: string;
}

export type FootprintTrend = 'improved' | 'worsened' | 'unchanged' | 'first';
