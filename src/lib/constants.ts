// Emission factors sourced from IPCC AR6, CEA 2023, and FAO.
// All values represent kg CO2e per unit specified.
export const EMISSION_FACTORS = {
  transport: {
    carPerKm: 0.21,        // kg CO2e/km (petrol, IPCC AR6)
    busPerKm: 0.089,       // kg CO2e/passenger-km (IPCC AR6)
    trainPerKm: 0.041,     // kg CO2e/passenger-km (IPCC AR6)
    flightPerKm: 0.255,    // kg CO2e/passenger-km (Economy, RF included)
  },
  energy: {
    electricityIndia: 0.82, // kg CO2e/kWh (CEA Annual Report 2023)
    naturalGas: 2.0,        // kg CO2e/m³
    lpg: 2.98,              // kg CO2e/kg
  },
  food: {
    beef: 27.0,             // kg CO2e/kg food (FAO)
    chicken: 6.9,           // kg CO2e/kg food (FAO)
    dairy: 3.2,             // kg CO2e/kg food (FAO)
    vegetables: 0.4,        // kg CO2e/kg food (FAO)
    processedFood: 7.6,     // kg CO2e/kg food
  },
} as const;

export const BENCHMARKS = {
  indiaAverage: 1900,  // kg CO2e/year
  globalAverage: 4800, // kg CO2e/year
  parisTarget: 2000,   // kg CO2e/year
};

export const clothingPerItem = 14.5;       // kg CO2e/item (industry estimate)
export const electronicsPerItem = 65.0;    // kg CO2e/item (industry estimate)
export const wastePerKg = 0.52;            // kg CO2e/kg mixed waste
export const flightKmPerHour = 800;        // assumed avg ground speed for distance estimation
export const recyclingMitigationRate = 0.4; // max fraction of waste emissions mitigated by recycling