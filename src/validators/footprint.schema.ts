import { z } from 'zod'; // Note: Ensure you run `npm i zod` if not done already, or we can use z from 'zod'

import { z as zodValidate } from 'zod';

export const FootprintSchema = zodValidate.object({
  transport: zodValidate.object({
    carKmPerWeek: zodValidate.number().min(0),
    busKmPerWeek: zodValidate.number().min(0),
    trainKmPerWeek: zodValidate.number().min(0),
    flightHoursPerYear: zodValidate.number().min(0),
  }),
  energy: zodValidate.object({
    electricityKwhPerMonth: zodValidate.number().min(0),
    naturalGasM3PerMonth: zodValidate.number().min(0),
    lpgKgPerMonth: zodValidate.number().min(0),
  }),
  food: zodValidate.object({
    beefKgPerWeek: zodValidate.number().min(0),
    chickenKgPerWeek: zodValidate.number().min(0),
    dairyKgPerWeek: zodValidate.number().min(0),
    vegetablesKgPerWeek: zodValidate.number().min(0),
    processedFoodKgPerWeek: zodValidate.number().min(0),
  }),
  shopping: zodValidate.object({
    clothesItemsPerMonth: zodValidate.number().min(0),
    electronicsItemsPerYear: zodValidate.number().min(0),
  }),
  waste: zodValidate.object({
    wasteKgPerWeek: zodValidate.number().min(0),
    recyclePercentage: zodValidate.number().min(0).max(100),
  }),
});

// Infer the pure TypeScript type from our Zod validation source of truth
export type FootprintInput = zodValidate.infer<typeof FootprintSchema>;