import { EMISSION_FACTORS } from './constants';
import { FootprintInput } from '../validators/footprint.schema';

/**
 * Calculates annual carbon footprint in kg CO2e based on user inputs.
 * All calculations scale weekly/monthly metrics to annual estimates (52 weeks or 12 months).
 */

export function calculateTransportEmissions(data: FootprintInput['transport']): number {
  const carAnnual = data.carKmPerWeek * 52 * EMISSION_FACTORS.transport.carPerKm;
  const busAnnual = data.busKmPerWeek * 52 * EMISSION_FACTORS.transport.busPerKm;
  const trainAnnual = data.trainKmPerWeek * 52 * EMISSION_FACTORS.transport.trainPerKm;
  const flightAnnual = data.flightHoursPerYear * 800 * EMISSION_FACTORS.transport.flightPerKm; // Assumes ~800 km per flight hour average

  return carAnnual + busAnnual + trainAnnual + flightAnnual;
}

export function calculateEnergyEmissions(data: FootprintInput['energy']): number {
  const electricityAnnual = data.electricityKwhPerMonth * 12 * EMISSION_FACTORS.energy.electricityIndia;
  const gasAnnual = data.naturalGasM3PerMonth * 12 * EMISSION_FACTORS.energy.naturalGas;
  const lpgAnnual = data.lpgKgPerMonth * 12 * EMISSION_FACTORS.energy.lpg;

  return electricityAnnual + gasAnnual + lpgAnnual;
}

export function calculateFoodEmissions(data: FootprintInput['food']): number {
  const beefAnnual = data.beefKgPerWeek * 52 * EMISSION_FACTORS.food.beef;
  const chickenAnnual = data.chickenKgPerWeek * 52 * EMISSION_FACTORS.food.chicken;
  const dairyAnnual = data.dairyKgPerWeek * 52 * EMISSION_FACTORS.food.dairy;
  const vegAnnual = data.vegetablesKgPerWeek * 52 * EMISSION_FACTORS.food.vegetables;
  const processedAnnual = data.processedFoodKgPerWeek * 52 * EMISSION_FACTORS.food.processedFood;

  return beefAnnual + chickenAnnual + dairyAnnual + vegAnnual + processedAnnual;
}

export function calculateShoppingEmissions(data: FootprintInput['shopping']): number {
  const clothesAnnual = data.clothesItemsPerMonth * 12 * 14.5; // ~14.5 kg CO2e per clothing item item baseline
  const electronicsAnnual = data.electronicsItemsPerYear * 65.0; // ~65.0 kg CO2e per average electronic device item baseline

  return clothesAnnual + electronicsAnnual;
}

export function calculateWasteEmissions(data: FootprintInput['waste']): number {
  const rawWasteAnnual = data.wasteKgPerWeek * 52 * 0.52; // ~0.52 kg CO2e per kg of mixed waste baseline
  // Recycling mitigates up to 40% of standard disposal emissions depending on percentage efficiency
  const reductionFactor = 1 - (data.recyclePercentage / 100) * 0.4; 

  return rawWasteAnnual * reductionFactor;
}

/**
 * Main calculation engine aggregate function
 */
export function calculateTotalFootprint(data: FootprintInput) {
  const transport = calculateTransportEmissions(data.transport);
  const energy = calculateEnergyEmissions(data.energy);
  const food = calculateFoodEmissions(data.food);
  const shopping = calculateShoppingEmissions(data.shopping);
  const waste = calculateWasteEmissions(data.waste);

  const total = transport + energy + food + shopping + waste;

  return {
    total: Math.round(total),
    breakdown: {
      transport: Math.round(transport),
      energy: Math.round(energy),
      food: Math.round(food),
      shopping: Math.round(shopping),
      waste: Math.round(waste),
    },
  };
}