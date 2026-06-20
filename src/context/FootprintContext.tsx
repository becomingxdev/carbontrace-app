'use client';

import React, { createContext, useContext } from 'react';
import { FootprintInput } from '../validators/footprint.schema';
import { calculateTotalFootprint } from '../lib/carbon-calculator';
import type { InsightsResponse } from '../types/insights';
import type { CalculationResult } from '../types/footprint';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/storage-keys';

// Initialize a clean default state matching our schema shape
const defaultInput: FootprintInput = {
  transport: { carKmPerWeek: 0, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
  energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
  food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
  shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
  waste: { wasteKgPerWeek: 0, recyclePercentage: 0 }
};

interface FootprintContextType {
  inputs: FootprintInput;
  updateCategory: <K extends keyof FootprintInput>(category: K, data: FootprintInput[K]) => void;
  calculations: CalculationResult;
  aiInsights: InsightsResponse | null;
  setAiInsights: (insights: InsightsResponse) => void;
  committedActions: string[];
  toggleActionCommit: (actionName: string) => void;
  clearAllData: () => void;
}

const FootprintContext = createContext<FootprintContextType | undefined>(undefined);

export function FootprintProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useLocalStorage<FootprintInput>(STORAGE_KEYS.inputs, defaultInput);
  const [aiInsights, setAiInsightsStored] = useLocalStorage<InsightsResponse | null>(STORAGE_KEYS.insights, null);
  const [committedActions, setCommittedActionsStored] = useLocalStorage<string[]>(STORAGE_KEYS.committed, []);

  const updateCategory = <K extends keyof FootprintInput>(category: K, data: FootprintInput[K]) => {
    setInputs({ ...inputs, [category]: data });
  };

  const setAiInsights = (insights: InsightsResponse) => {
    setAiInsightsStored(insights);
  };

  const toggleActionCommit = (actionName: string) => {
    const updated = committedActions.includes(actionName)
      ? committedActions.filter((a) => a !== actionName)
      : [...committedActions, actionName];
    setCommittedActionsStored(updated);
  };

  const clearAllData = () => {
    setInputs(null);
    setAiInsightsStored(null);
    setCommittedActionsStored(null);
  };

  // Derive calculations instantly whenever inputs mutate
  const calculations = calculateTotalFootprint(inputs);

  return (
    <FootprintContext.Provider value={{
      inputs,
      updateCategory,
      calculations,
      aiInsights,
      setAiInsights,
      committedActions,
      toggleActionCommit,
      clearAllData
    }}>
      {children}
    </FootprintContext.Provider>
  );
}

export function useFootprint() {
  const context = useContext(FootprintContext);
  if (!context) {
    throw new Error('useFootprint must be used within a FootprintProvider');
  }
  return context;
}
