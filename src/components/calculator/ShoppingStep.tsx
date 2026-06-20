'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { createFieldChangeHandler } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['shopping'];
  onChange: (data: FootprintInput['shopping']) => void;
}

export const ShoppingStep: React.FC<StepProps> = ({ data, onChange }) => {
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
          onChange={(e) => createFieldChangeHandler('clothesItemsPerMonth', data, onChange)(e.target.value)}
          helperText="Count newly purchased clothing items each month."
          helperId="shopping-clothes-help"
        />
        <Input
          id="electronics"
          label="Electronics/Gadgets Purchased (per year)"
          type="number"
          min="0"
          value={data.electronicsItemsPerYear || ''}
          onChange={(e) => createFieldChangeHandler('electronicsItemsPerYear', data, onChange)(e.target.value)}
          helperText="Include phones, laptops, and other new devices."
          helperId="shopping-electronics-help"
        />
      </div>
    </div>
  );
};
