'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { parseNumericInput } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['transport'];
  onChange: (data: FootprintInput['transport']) => void;
}

export const TransportStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FootprintInput['transport']) => (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">1. Transportation Methods</h2>
        <p className="text-sm text-slate-400 mt-1">Estimate your transit activity to identify commuting impacts.</p>
      </div>

      <div className="space-y-4">
        <Input
          id="carKm"
          label="Weekly Car Travel (km)"
          type="number"
          min="0"
          value={data.carKmPerWeek || ''}
          onChange={(e) => handleChange('carKmPerWeek')(e.target.value)}
        />
        <Input
          id="busKm"
          label="Weekly Bus Travel (km)"
          type="number"
          min="0"
          value={data.busKmPerWeek || ''}
          onChange={(e) => handleChange('busKmPerWeek')(e.target.value)}
        />
        <Input
          id="trainKm"
          label="Weekly Train Travel (km)"
          type="number"
          min="0"
          value={data.trainKmPerWeek || ''}
          onChange={(e) => handleChange('trainKmPerWeek')(e.target.value)}
        />
        <Input
          id="flights"
          label="Annual Flight Hours"
          type="number"
          min="0"
          value={data.flightHoursPerYear || ''}
          onChange={(e) => handleChange('flightHoursPerYear')(e.target.value)}
        />
      </div>
    </div>
  );
};