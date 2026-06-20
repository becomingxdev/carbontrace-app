'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { parseNumericInput } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['shopping'];
  onChange: (data: FootprintInput['shopping']) => void;
}

export const ShoppingStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FootprintInput['shopping']) => (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">4. Consumption &amp; Goods</h2>
        <p className="text-sm text-slate-400 mt-1">Track newly purchased items and upstream supply chains.</p>
      </div>

      <div className="space-y-4">
        <Input
          id="clothes"
          label="New Clothing Items (per month)"
          type="number"
          min="0"
          value={data.clothesItemsPerMonth || ''}
          onChange={(e) => handleChange('clothesItemsPerMonth')(e.target.value)}
        />
        <Input
          id="electronics"
          label="Electronics/Gadgets Purchased (per year)"
          type="number"
          min="0"
          value={data.electronicsItemsPerYear || ''}
          onChange={(e) => handleChange('electronicsItemsPerYear')(e.target.value)}
        />
      </div>
    </div>
  );
};