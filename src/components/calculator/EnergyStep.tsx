'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';

interface StepProps {
  data: FootprintInput['energy'];
  onChange: (data: FootprintInput['energy']) => void;
}

export const EnergyStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FootprintInput['energy'], value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">2. Home Utilities & Energy</h2>
        <p className="text-sm text-slate-400 mt-1">Calculated using regional power grid carbon intensity definitions.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="electricity" className="block text-sm font-medium text-slate-200">Monthly Electricity Consumption (kWh)</label>
          <input
            id="electricity"
            type="number"
            min="0"
            value={data.electricityKwhPerMonth || ''}
            onChange={(e) => handleInputChange('electricityKwhPerMonth', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="naturalGas" className="block text-sm font-medium text-slate-200">Monthly Natural Gas (m³)</label>
          <input
            id="naturalGas"
            type="number"
            min="0"
            value={data.naturalGasM3PerMonth || ''}
            onChange={(e) => handleInputChange('naturalGasM3PerMonth', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="lpg" className="block text-sm font-medium text-slate-200">Monthly LPG Cylinder Use (kg)</label>
          <input
            id="lpg"
            type="number"
            min="0"
            value={data.lpgKgPerMonth || ''}
            onChange={(e) => handleInputChange('lpgKgPerMonth', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};