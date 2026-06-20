'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FootprintInput } from '../validators/footprint.schema';
import { calculateTotalFootprint } from '../lib/carbon-calculator';

// Initialize a clean default state matching our schema shape
const defaultInput: FootprintInput = {
  transport: { carKmPerWeek: 0, busKmPerWeek: 0, trainKmPerWeek: 0, flightHoursPerYear: 0 },
  energy: { electricityKwhPerMonth: 0, naturalGasM3PerMonth: 0, lpgKgPerMonth: 0 },
  food: { beefKgPerWeek: 0, chickenKgPerWeek: 0, dairyKgPerWeek: 0, vegetablesKgPerWeek: 0, processedFoodKgPerWeek: 0 },
  shopping: { clothesItemsPerMonth: 0, electronicsItemsPerYear: 0 },
  waste: { wasteKgPerWeek: 0, recyclePercentage: 0 }
};

interface InsightsResponse {
  recommendations: Array<{
    action: string;
    co2Saved: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
}

interface FootprintContextType {
  inputs: FootprintInput;
  updateCategory: <K extends keyof FootprintInput>(category: K, data: FootprintInput[K]) => void;
  calculations: ReturnType<typeof calculateTotalFootprint>;
  aiInsights: InsightsResponse | null;
  setAiInsights: (insights: InsightsResponse) => void;
  committedActions: string[];
  toggleActionCommit: (actionName: string) => void;
  clearAllData: () => void;
}

const FootprintContext = createContext<FootprintContextType | undefined>(undefined);

export function FootprintProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<FootprintInput>(defaultInput);
  const [aiInsights, setAiInsightsState] = useState<InsightsResponse | null>(null);
  const [committedActions, setCommittedActions] = useState<string[]>([]);

  // Hydrate data from localStorage safely on client mount
  useEffect(() => {
    const savedInputs = localStorage.getItem('carbontrace_inputs');
    const savedInsights = localStorage.getItem('carbontrace_insights');
    const savedActions = localStorage.getItem('carbontrace_committed');

    if (savedInputs) setInputs(JSON.parse(savedInputs));
    if (savedInsights) setAiInsightsState(JSON.parse(savedInsights));
    if (savedActions) setCommittedActions(JSON.parse(savedActions));
  }, []);

  const updateCategory = <K extends keyof FootprintInput>(category: K, data: FootprintInput[K]) => {
    setInputs((prev) => {
      const updated = { ...prev, [category]: data };
      localStorage.setItem('carbontrace_inputs', JSON.stringify(updated));
      return updated;
    });
  };

  const setAiInsights = (insights: InsightsResponse) => {
    setAiInsightsState(insights);
    localStorage.setItem('carbontrace_insights', JSON.stringify(insights));
  };

  const toggleActionCommit = (actionName: string) => {
    setCommittedActions((prev) => {
      const updated = prev.includes(actionName)
        ? prev.filter((a) => a !== actionName)
        : [...prev, actionName];
      localStorage.setItem('carbontrace_committed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllData = () => {
    setInputs(defaultInput);
    setAiInsightsState(null);
    setCommittedActions([]);
    localStorage.removeItem('carbontrace_inputs');
    localStorage.removeItem('carbontrace_insights');
    localStorage.removeItem('carbontrace_committed');
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
