'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';

interface StepProps {
  data: FootprintInput['shopping'];
  onChange: (data: FootprintInput['shopping']) => void;
}

export const ShoppingStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FootprintInput['shopping'], value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">4. Consumption & Goods</h2>
        <p className="text-sm text-slate-400 mt-1">Track newly purchased items and upstream supply chains.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="clothes" className="block text-sm font-medium text-slate-200">New Clothing Items (per month)</label>
          <input
            id="clothes"
            type="number"
            min="0"
            value={data.clothesItemsPerMonth || ''}
            onChange={(e) => handleInputChange('clothesItemsPerMonth', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="electronics" className="block text-sm font-medium text-slate-200">Electronics/Gadgets Purchased (per year)</label>
          <input
            id="electronics"
            type="number"
            min="0"
            value={data.electronicsItemsPerYear || ''}
            onChange={(e) => handleInputChange('electronicsItemsPerYear', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};