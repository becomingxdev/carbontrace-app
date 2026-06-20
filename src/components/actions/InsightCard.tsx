'use client';

import React from 'react';
import type { Recommendation } from '@/types/insights';

interface CardProps {
  item: Recommendation;
  isCommitted: boolean;
  onToggle: () => void;
}

const DIFFICULTY_STYLES: Record<Recommendation['difficulty'], string> = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const InsightCard: React.FC<CardProps> = ({ item, isCommitted, onToggle }) => {
  const actionId = `action-${item.action.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 ${isCommitted ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isCommitted}
            onChange={onToggle}
            id={actionId}
            className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950"
          />
          <div>
            <label htmlFor={actionId} className="text-sm font-medium text-slate-100 block cursor-pointer">
              {item.action}
            </label>
            <div className="flex gap-2 items-center mt-2">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${DIFFICULTY_STYLES[item.difficulty]}`}>
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