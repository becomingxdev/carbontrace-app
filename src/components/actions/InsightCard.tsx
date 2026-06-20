'use client';

import React from 'react';

interface Recommendation {
  action: string;
  co2Saved: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CardProps {
  item: Recommendation;
  isCommitted: boolean;
  onToggle: () => void;
}

export const InsightCard: React.FC<CardProps> = ({ item, isCommitted, onToggle }) => {
  const diffColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 ${isCommitted ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isCommitted}
            onChange={onToggle}
            id={`action-${item.action.replace(/\s+/g, '-').toLowerCase()}`}
            className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950"
          />
          <div>
            <label htmlFor={`action-${item.action.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-slate-100 block cursor-pointer">
              {item.action}
            </label>
            <div className="flex gap-2 items-center mt-2">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${diffColors[item.difficulty]}`}>
                {item.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Saves <strong className="text-emerald-400">-{item.co2Saved} kg</strong> CO2e / yr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};