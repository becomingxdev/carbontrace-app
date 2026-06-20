'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';

interface StepProps {
  data: FootprintInput['waste'];
  onChange: (data: FootprintInput['waste']) => void;
}

export const WasteStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FootprintInput['waste'], value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">5. Municipal Solid Waste</h2>
        <p className="text-sm text-slate-400 mt-1">Disposal volume vs active redirection metrics.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="wasteMass" className="block text-sm font-medium text-slate-200">Total Household Waste Generated (kg/week)</label>
          <input
            id="wasteMass"
            type="number"
            min="0"
            value={data.wasteKgPerWeek || ''}
            onChange={(e) => handleInputChange('wasteKgPerWeek', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="recycleRate" className="block text-sm font-medium text-slate-200">Recycling Allocation Efficiency (%)</label>
          <input
            id="recycleRate"
            type="number"
            min="0"
            max="100"
            value={data.recyclePercentage || ''}
            onChange={(e) => handleInputChange('recyclePercentage', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};