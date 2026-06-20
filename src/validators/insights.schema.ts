import { z } from 'zod';

export const RecommendationSchema = z.object({
  action: z.string().min(1),
  co2Saved: z.number().min(0),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export const InsightsResponseSchema = z.object({
  recommendations: z.array(RecommendationSchema).min(1).max(10),
});

export type ValidatedRecommendation = z.infer<typeof RecommendationSchema>;
export type ValidatedInsightsResponse = z.infer<typeof InsightsResponseSchema>;
