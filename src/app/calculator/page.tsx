import React from 'react';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';

export default function CalculatorPage() {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto flex-grow flex flex-col justify-center">
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Carbon Footprint Estimation
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Fill out the 5 operational modules below to analyze emissions relative to target environmental benchmarks.
        </p>
      </div>

      <CalculatorShell />
    </div>
  );
}