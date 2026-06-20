'use client';

import React from 'react';
import { BENCHMARKS } from '@/lib/constants';

interface ScoreCardProps {
  total: number;
}

export const CarbonScoreCard: React.FC<ScoreCardProps> = ({ total }) => {
  const diffIndia = Math.round(((total - BENCHMARKS.indiaAverage) / BENCHMARKS.indiaAverage) * 100);
  const isAboveIndia = total > BENCHMARKS.indiaAverage;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-md">
      <div>
        <h3 className="text-sm font-medium text-slate-400 tracking-wider uppercase">Your Annual Footprint</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-5xl font-extrabold text-white tracking-tight">{total.toLocaleString()}</span>
          <span className="text-sm font-medium text-slate-400 ml-2">kg CO2e / yr</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">India Average:</span>
          <span className="font-semibold text-slate-200">{BENCHMARKS.indiaAverage} kg</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Global Average:</span>
          <span className="font-semibold text-slate-200">{BENCHMARKS.globalAverage} kg</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Paris Agreement Target:</span>
          <span className="font-semibold text-emerald-400">{BENCHMARKS.parisTarget} kg</span>
        </div>

        <div className={`mt-4 p-3 rounded-lg text-xs font-medium ${isAboveIndia ? 'bg-rose-950/40 text-rose-300 border border-rose-900/50' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50'}`}>
          {isAboveIndia ? (
            <span>Your footprint is {diffIndia}% higher than the average citizen in India.</span>
          ) : (
            <span>Incredible! Your carbon footprint sits below the national benchmark average.</span>
          )}
        </div>
      </div>
    </div>
  );
};