'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { BENCHMARKS } from '@/lib/constants';

interface BarProps {
  total: number;
}

export const ComparisonBarChart: React.FC<BarProps> = ({ total }) => {
  const chartData = useMemo(() => {
    return [
      { name: 'You', amount: total, isUser: true },
      { name: 'India Avg', amount: BENCHMARKS.indiaAverage, isUser: false },
      { name: 'Paris Target', amount: BENCHMARKS.parisTarget, isUser: false },
      { name: 'Global Avg', amount: BENCHMARKS.globalAverage, isUser: false },
    ];
  }, [total]);

  const accessibilitySummary = useMemo(() => {
    const diffFromParis = total - BENCHMARKS.parisTarget;
    if (diffFromParis <= 0) {
      return `Your footprint of ${total.toLocaleString()} kg CO2e is at or below the Paris target of ${BENCHMARKS.parisTarget.toLocaleString()} kg.`;
    }
    return `Your footprint of ${total.toLocaleString()} kg CO2e is ${diffFromParis.toLocaleString()} kg above the Paris target of ${BENCHMARKS.parisTarget.toLocaleString()} kg.`;
  }, [total]);

  const chartTitle = 'Benchmark comparison chart';
  const chartDescription = accessibilitySummary;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md h-[350px] flex flex-col">
      <h2 className="text-sm font-medium text-slate-400 tracking-wider uppercase mb-4">Benchmark Comparison</h2>
      <p className="sr-only">{accessibilitySummary}</p>
      <div
        className="flex-grow w-full h-full relative min-h-[220px]"
        role="img"
        aria-label={accessibilitySummary}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} aria-hidden="true">
            <title>{chartTitle}</title>
            <desc>{chartDescription}</desc>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}
              itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} name="kg CO2e">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isUser ? '#10b981' : entry.name === 'Paris Target' ? '#059669' : '#334155'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
