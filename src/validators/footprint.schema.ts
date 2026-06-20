import { z } from 'zod';

export const FootprintSchema = z.object({
  transport: z.object({
    carKmPerWeek: z.number().min(0),
    busKmPerWeek: z.number().min(0),
    trainKmPerWeek: z.number().min(0),
    flightHoursPerYear: z.number().min(0),
  }),
  energy: z.object({
    electricityKwhPerMonth: z.number().min(0),
    naturalGasM3PerMonth: z.number().min(0),
    lpgKgPerMonth: z.number().min(0),
  }),
  food: z.object({
    beefKgPerWeek: z.number().min(0),
    chickenKgPerWeek: z.number().min(0),
    dairyKgPerWeek: z.number().min(0),
    vegetablesKgPerWeek: z.number().min(0),
    processedFoodKgPerWeek: z.number().min(0),
  }),
  shopping: z.object({
    clothesItemsPerMonth: z.number().min(0),
    electronicsItemsPerYear: z.number().min(0),
  }),
  waste: z.object({
    wasteKgPerWeek: z.number().min(0),
    recyclePercentage: z.number().min(0).max(100),
  }),
});

// Infer the pure TypeScript type from our Zod validation source of truth
export type FootprintInput = z.infer<typeof FootprintSchema>;