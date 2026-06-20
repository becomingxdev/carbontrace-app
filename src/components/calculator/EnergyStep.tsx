'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { parseNumericInput } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['energy'];
  onChange: (data: FootprintInput['energy']) => void;
}

export const EnergyStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FootprintInput['energy']) => (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">2. Home Utilities &amp; Energy</h2>
        <p className="text-sm text-slate-400 mt-1">Calculated using regional power grid carbon intensity definitions.</p>
      </div>

      <div className="space-y-4">
        <Input
          id="electricity"
          label="Monthly Electricity Consumption (kWh)"
          type="number"
          min="0"
          value={data.electricityKwhPerMonth || ''}
          onChange={(e) => handleChange('electricityKwhPerMonth')(e.target.value)}
        />
        <Input
          id="naturalGas"
          label="Monthly Natural Gas (m³)"
          type="number"
          min="0"
          value={data.naturalGasM3PerMonth || ''}
          onChange={(e) => handleChange('naturalGasM3PerMonth')(e.target.value)}
        />
        <Input
          id="lpg"
          label="Monthly LPG Cylinder Use (kg)"
          type="number"
          min="0"
          value={data.lpgKgPerMonth || ''}
          onChange={(e) => handleChange('lpgKgPerMonth')(e.target.value)}
        />
      </div>
    </div>
  );
};