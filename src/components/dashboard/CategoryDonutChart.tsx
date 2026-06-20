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

function buildAccessibilitySummary(
  chartData: Array<{ name: string; value: number }>,
  total: number
): string {
  if (chartData.length === 0 || total === 0) {
    return 'No emissions breakdown data available.';
  }

  const top = [...chartData].sort((a, b) => b.value - a.value)[0];
  const percent = Math.round((top.value / total) * 100);
  return `${top.name} contributes ${percent}% of emissions.`;
}

export const CategoryDonutChart: React.FC<DonutProps> = ({ breakdown }) => {
  const chartData = useMemo(() => {
    return [
      { name: 'Transport', value: breakdown.transport },
      { name: 'Energy', value: breakdown.energy },
      { name: 'Diet/Food', value: breakdown.food },
      { name: 'Shopping', value: breakdown.shopping },
      { name: 'Waste Management', value: breakdown.waste },
    ].filter(item => item.value > 0);
  }, [breakdown]);

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const accessibilitySummary = buildAccessibilitySummary(chartData, total);
  const chartTitle = 'Emissions breakdown by category';
  const chartDescription = accessibilitySummary;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md h-[350px] flex flex-col">
      <h2 className="text-sm font-medium text-slate-400 tracking-wider uppercase mb-4">Emissions Breakdown</h2>
      <p className="sr-only">{accessibilitySummary}</p>
      <div
        className="flex-grow w-full h-full relative min-h-[220px]"
        role="img"
        aria-label={accessibilitySummary}
      >
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">No calculation data registered.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart aria-hidden="true">
              <title>{chartTitle}</title>
              <desc>{chartDescription}</desc>
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
