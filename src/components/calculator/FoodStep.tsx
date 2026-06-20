'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';

interface StepProps {
  data: FootprintInput['food'];
  onChange: (data: FootprintInput['food']) => void;
}

export const FoodStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FootprintInput['food'], value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">3. Dietary Profiles</h2>
        <p className="text-sm text-slate-400 mt-1">Estimate the approximate weight of grocery types consumed weekly.</p>
      </div>

      <div className="space-y-4">
        {Object.keys(data).map((field) => {
          const typedField = field as keyof FootprintInput['food'];
          const labelMapping: Record<keyof FootprintInput['food'], string> = {
            beefKgPerWeek: 'Beef Consumption (kg/week)',
            chickenKgPerWeek: 'Poultry / Chicken (kg/week)',
            dairyKgPerWeek: 'Dairy Products (kg/week)',
            vegetablesKgPerWeek: 'Vegetables & Grains (kg/week)',
            processedFoodKgPerWeek: 'Packaged / Processed Food (kg/week)',
          };

          return (
            <div key={typedField}>
              <label htmlFor={typedField} className="block text-sm font-medium text-slate-200">
                {labelMapping[typedField]}
              </label>
              <input
                id={typedField}
                type="number"
                min="0"
                value={data[typedField] || ''}
                onChange={(e) => handleInputChange(typedField, e.target.value)}
                className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};