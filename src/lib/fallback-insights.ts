import type { InsightsResponse } from '@/types/insights';
import type { CalculationResult } from '@/types/footprint';

/**
 * Deterministic fallback recommendations used when AI output fails validation.
 */
export function getFallbackInsights(calculations: CalculationResult): InsightsResponse {
  const { breakdown } = calculations;
  const categories = [
    { name: 'transport', value: breakdown.transport, action: 'Replace one weekly car trip with public transit or cycling' },
    { name: 'energy', value: breakdown.energy, action: 'Switch to LED lighting and unplug idle electronics to reduce home energy use' },
    { name: 'food', value: breakdown.food, action: 'Adopt two plant-based meals per week to lower dietary emissions' },
    { name: 'shopping', value: breakdown.shopping, action: 'Buy fewer new clothing items and extend the life of existing garments' },
    { name: 'waste', value: breakdown.waste, action: 'Increase recycling and composting to divert waste from landfills' },
  ];

  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const topCategory = sorted[0];

  const estimatedSaving = Math.max(50, Math.round(topCategory.value * 0.1));

  return {
    recommendations: [
      {
        action: topCategory.action,
        co2Saved: estimatedSaving,
        difficulty: 'Easy',
      },
      {
        action: 'Track your footprint monthly and set a reduction target',
        co2Saved: Math.round(calculations.total * 0.05),
        difficulty: 'Easy',
      },
      {
        action: 'Use energy-efficient appliances and reduce standby power consumption',
        co2Saved: Math.max(30, Math.round(breakdown.energy * 0.08)),
        difficulty: 'Medium',
      },
    ],
  };
}
