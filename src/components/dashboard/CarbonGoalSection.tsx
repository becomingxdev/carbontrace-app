'use client';

import React, { useState } from 'react';
import type { CarbonGoal } from '@/types/history';
import { calculateGoalProgress } from '@/lib/carbon-goal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CarbonGoalSectionProps {
  currentKg: number;
  goal: CarbonGoal | null;
  onSaveGoal: (goal: CarbonGoal | null) => void;
}

export const CarbonGoalSection: React.FC<CarbonGoalSectionProps> = ({
  currentKg,
  goal,
  onSaveGoal,
}) => {
  const [targetKg, setTargetKg] = useState(goal?.targetKg?.toString() ?? '');
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? '');

  const progress = goal ? calculateGoalProgress(currentKg, goal) : null;

  const handleSave = () => {
    const parsedTarget = parseFloat(targetKg);
    if (!targetDate || Number.isNaN(parsedTarget) || parsedTarget <= 0) return;

    onSaveGoal({
      targetKg: parsedTarget,
      targetDate,
    });
  };

  return (
    <section aria-labelledby="goal-heading" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
      <h2 id="goal-heading" className="text-sm font-medium text-slate-400 tracking-wider uppercase">
        Carbon Reduction Goal
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="goal-target"
          label="Target Footprint (kg CO2e / yr)"
          type="number"
          min="0"
          value={targetKg}
          onChange={(e) => setTargetKg(e.target.value)}
          helperText="Set your desired annual footprint target."
          helperId="goal-target-help"
        />
        <Input
          id="goal-date"
          label="Target Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          helperText="Choose when you want to reach this target."
          helperId="goal-date-help"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSave}>Save Goal</Button>
        {goal && (
          <Button variant="outline" onClick={() => onSaveGoal(null)}>Clear Goal</Button>
        )}
      </div>

      {progress && (
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress toward target</span>
            <span className="font-semibold text-emerald-400">{progress.progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress.progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progress.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Carbon goal progress"
            />
          </div>
          <p className="text-xs text-slate-400">
            Gap remaining: <strong className="text-slate-200">{progress.gapRemainingKg.toLocaleString()} kg CO2e</strong>
            {' '}by {new Date(progress.targetDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </section>
  );
};
