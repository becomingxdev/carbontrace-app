/**
 * AI insights domain types.
 * Shared between the API route, FootprintContext, and action UI components.
 */

export interface Recommendation {
  action: string;
  co2Saved: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InsightsResponse {
  recommendations: Recommendation[];
}
