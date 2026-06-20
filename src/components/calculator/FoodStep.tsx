'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { createFieldChangeHandler } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['food'];
  onChange: (data: FootprintInput['food']) => void;
}

const FOOD_LABEL_MAP: Record<keyof FootprintInput['food'], string> = {
  beefKgPerWeek: 'Beef Consumption (kg/week)',
  chickenKgPerWeek: 'Poultry / Chicken (kg/week)',
  dairyKgPerWeek: 'Dairy Products (kg/week)',
  vegetablesKgPerWeek: 'Vegetables & Grains (kg/week)',
  processedFoodKgPerWeek: 'Packaged / Processed Food (kg/week)',
};

const FOOD_HELP_MAP: Record<keyof FootprintInput['food'], string> = {
  beefKgPerWeek: 'Estimate weekly beef consumption in kilograms.',
  chickenKgPerWeek: 'Include all poultry products consumed weekly.',
  dairyKgPerWeek: 'Milk, cheese, yogurt, and other dairy items.',
  vegetablesKgPerWeek: 'Fresh produce, grains, and plant-based foods.',
  processedFoodKgPerWeek: 'Packaged snacks, ready meals, and processed items.',
};

export const FoodStep: React.FC<StepProps> = ({ data, onChange }) => {
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
            onChange={(e) => createFieldChangeHandler(field, data, onChange)(e.target.value)}
            helperText={FOOD_HELP_MAP[field]}
            helperId={`${field}-help`}
          />
        ))}
      </div>
    </div>
  );
};
