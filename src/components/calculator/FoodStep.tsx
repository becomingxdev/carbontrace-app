'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { parseNumericInput } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['food'];
  onChange: (data: FootprintInput['food']) => void;
}

// R6: Declared outside the component to prevent recreation on every render pass.
const FOOD_LABEL_MAP: Record<keyof FootprintInput['food'], string> = {
  beefKgPerWeek: 'Beef Consumption (kg/week)',
  chickenKgPerWeek: 'Poultry / Chicken (kg/week)',
  dairyKgPerWeek: 'Dairy Products (kg/week)',
  vegetablesKgPerWeek: 'Vegetables & Grains (kg/week)',
  processedFoodKgPerWeek: 'Packaged / Processed Food (kg/week)',
};

export const FoodStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FootprintInput['food']) => (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">3. Dietary Profiles</h2>
        <p className="text-sm text-slate-400 mt-1">Estimate the approximate weight of grocery types consumed weekly.</p>
      </div>

      <div className="space-y-4">
        {(Object.keys(FOOD_LABEL_MAP) as Array<keyof FootprintInput['food']>).map((field) => (
          <Input
            key={field}
            id={field}
            label={FOOD_LABEL_MAP[field]}
            type="number"
            min="0"
            value={data[field] || ''}
            onChange={(e) => handleChange(field)(e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};