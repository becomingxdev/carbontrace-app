'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { FootprintInput } from '../validators/footprint.schema';
import { calculateTotalFootprint } from '../lib/carbon-calculator';
import type { InsightsResponse } from '../types/insights';
import type { CalculationResult } from '../types/footprint';
import type { CarbonGoal, FootprintHistoryEntry } from '../types/history';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/storage-keys';
import {
  appendHistoryEntry,
  createHistoryEntry,
  loadFootprintHistory,
} from '../lib/footprint-history';

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
  clearAiInsights: () => void;
  committedActions: string[];
  toggleActionCommit: (actionName: string) => void;
  history: FootprintHistoryEntry[];
  recordCalculation: () => void;
  carbonGoal: CarbonGoal | null;
  setCarbonGoal: (goal: CarbonGoal | null) => void;
  clearAllData: () => void;
}

const FootprintContext = createContext<FootprintContextType | undefined>(undefined);

export function FootprintProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useLocalStorage<FootprintInput>(STORAGE_KEYS.inputs, defaultInput);
  const [aiInsights, setAiInsightsStored] = useLocalStorage<InsightsResponse | null>(STORAGE_KEYS.insights, null);
  const [committedActions, setCommittedActionsStored] = useLocalStorage<string[]>(STORAGE_KEYS.committed, []);
  const [history, setHistoryStored] = useLocalStorage<FootprintHistoryEntry[]>(STORAGE_KEYS.history, []);
  const [carbonGoal, setCarbonGoalStored] = useLocalStorage<CarbonGoal | null>(STORAGE_KEYS.goal, null);

  const updateCategory = useCallback(<K extends keyof FootprintInput>(category: K, data: FootprintInput[K]) => {
    setInputs(prev => ({
      ...prev,
      [category]: data,
    }));
  }, [setInputs]);

  const setAiInsights = useCallback((insights: InsightsResponse) => {
    setAiInsightsStored(insights);
  }, [setAiInsightsStored]);

  const clearAiInsights = useCallback(() => {
    setAiInsightsStored(null);
  }, [setAiInsightsStored]);

  const toggleActionCommit = useCallback((actionName: string) => {
    const updated = committedActions.includes(actionName)
      ? committedActions.filter((a) => a !== actionName)
      : [...committedActions, actionName];
    setCommittedActionsStored(updated);
  }, [committedActions, setCommittedActionsStored]);

  const setCarbonGoal = useCallback((goal: CarbonGoal | null) => {
    setCarbonGoalStored(goal);
  }, [setCarbonGoalStored]);

  const recordCalculation = useCallback(() => {
    const calculations = calculateTotalFootprint(inputs);
    if (calculations.total <= 0) return;

    const entry = createHistoryEntry(inputs, calculations);
    const existingHistory = history.length > 0 ? history : loadFootprintHistory();
    const updatedHistory = appendHistoryEntry(existingHistory, entry);
    setHistoryStored(updatedHistory);
  }, [history, inputs, setHistoryStored]);

  const clearAllData = useCallback(() => {
    setInputs(null);
    setAiInsightsStored(null);
    setCommittedActionsStored(null);
    setHistoryStored(null);
    setCarbonGoalStored(null);
  }, [setInputs, setAiInsightsStored, setCommittedActionsStored, setHistoryStored, setCarbonGoalStored]);

  const calculations = useMemo(() => calculateTotalFootprint(inputs), [inputs]);

  const contextValue = useMemo(() => ({
    inputs,
    updateCategory,
    calculations,
    aiInsights,
    setAiInsights,
    clearAiInsights,
    committedActions,
    toggleActionCommit,
    history,
    recordCalculation,
    carbonGoal,
    setCarbonGoal,
    clearAllData
  }), [
    inputs,
    updateCategory,
    calculations,
    aiInsights,
    setAiInsights,
    clearAiInsights,
    committedActions,
    toggleActionCommit,
    history,
    recordCalculation,
    carbonGoal,
    setCarbonGoal,
    clearAllData
  ]);

  return (
    <FootprintContext.Provider value={contextValue}>
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
