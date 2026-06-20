'use client';

import React from 'react';
import { FootprintInput } from '@/validators/footprint.schema';

interface StepProps {
  data: FootprintInput['transport'];
  onChange: (data: FootprintInput['transport']) => void;
}

export const TransportStep: React.FC<StepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FootprintInput['transport'], value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">1. Transportation Methods</h2>
        <p className="text-sm text-slate-400 mt-1">Estimate your transit activity to identify commuting impacts.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="carKm" className="block text-sm font-medium text-slate-200">Weekly Car Travel (km)</label>
          <input
            id="carKm"
            type="number"
            min="0"
            value={data.carKmPerWeek || ''}
            onChange={(e) => handleInputChange('carKmPerWeek', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="busKm" className="block text-sm font-medium text-slate-200">Weekly Bus Travel (km)</label>
          <input
            id="busKm"
            type="number"
            min="0"
            value={data.busKmPerWeek || ''}
            onChange={(e) => handleInputChange('busKmPerWeek', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="trainKm" className="block text-sm font-medium text-slate-200">Weekly Train Travel (km)</label>
          <input
            id="trainKm"
            type="number"
            min="0"
            value={data.trainKmPerWeek || ''}
            onChange={(e) => handleInputChange('trainKmPerWeek', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="flights" className="block text-sm font-medium text-slate-200">Annual Flight Hours</label>
          <input
            id="flights"
            type="number"
            min="0"
            value={data.flightHoursPerYear || ''}
            onChange={(e) => handleInputChange('flightHoursPerYear', e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};