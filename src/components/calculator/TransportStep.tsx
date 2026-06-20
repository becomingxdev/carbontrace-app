'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';
import { Input } from '@/components/ui/Input';
import { createFieldChangeHandler } from '@/lib/input-utils';

interface StepProps {
  data: FootprintInput['transport'];
  onChange: (data: FootprintInput['transport']) => void;
}

export const TransportStep: React.FC<StepProps> = ({ data, onChange }) => {
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
          onChange={(e) => createFieldChangeHandler('carKmPerWeek', data, onChange)(e.target.value)}
          helperText="Include all personal car trips per week."
          helperId="transport-car-help"
        />
        <Input
          id="busKm"
          label="Weekly Bus Travel (km)"
          type="number"
          min="0"
          value={data.busKmPerWeek || ''}
          onChange={(e) => createFieldChangeHandler('busKmPerWeek', data, onChange)(e.target.value)}
          helperText="Estimate total bus distance traveled weekly."
          helperId="transport-bus-help"
        />
        <Input
          id="trainKm"
          label="Weekly Train Travel (km)"
          type="number"
          min="0"
          value={data.trainKmPerWeek || ''}
          onChange={(e) => createFieldChangeHandler('trainKmPerWeek', data, onChange)(e.target.value)}
          helperText="Include commuter and long-distance rail travel."
          helperId="transport-train-help"
        />
        <Input
          id="flights"
          label="Annual Flight Hours"
          type="number"
          min="0"
          value={data.flightHoursPerYear || ''}
          onChange={(e) => createFieldChangeHandler('flightHoursPerYear', data, onChange)(e.target.value)}
          helperText="Total hours spent in the air each year."
          helperId="transport-flight-help"
        />
      </div>
    </div>
  );
};
