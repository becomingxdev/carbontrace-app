'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DonutProps {
  breakdown: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
    waste: number;
  };
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

export const CategoryDonutChart: React.FC<DonutProps> = ({ breakdown }) => {
  // Memoize transformation to prevent unnecessary recalculations on state triggers
  const chartData = useMemo(() => {
    return [
      { name: 'Transport', value: breakdown.transport },
      { name: 'Energy', value: breakdown.energy },
      { name: 'Diet/Food', value: breakdown.food },
      { name: 'Shopping', value: breakdown.shopping },
      { name: 'Waste Management', value: breakdown.waste },
    ].filter(item => item.value > 0);
  }, [breakdown]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md h-[350px] flex flex-col">
      <h3 className="text-sm font-medium text-slate-400 tracking-wider uppercase mb-4">Emissions Breakdown</h3>
      <div className="flex-grow w-full h-full relative min-h-[220px]">
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">No calculation data registered.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};