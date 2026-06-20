'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { parseNumericInput } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['waste'];
  onChange: (data: FootprintInput['waste']) => void;
}

export const WasteStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FootprintInput['waste']) => (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">5. Municipal Solid Waste</h2>
        <p className="text-sm text-slate-400 mt-1">Disposal volume vs active redirection metrics.</p>
      </div>

      <div className="space-y-4">
        <Input
          id="wasteMass"
          label="Total Household Waste Generated (kg/week)"
          type="number"
          min="0"
          value={data.wasteKgPerWeek || ''}
          onChange={(e) => handleChange('wasteKgPerWeek')(e.target.value)}
        />
        <Input
          id="recycleRate"
          label="Recycling Allocation Efficiency (%)"
          type="number"
          min="0"
          max="100"
          value={data.recyclePercentage || ''}
          onChange={(e) => handleChange('recyclePercentage')(e.target.value)}
        />
      </div>
    </div>
  );
};