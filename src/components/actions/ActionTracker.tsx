'use client';

import React from 'react';

interface ActionTrackerProps {
  committedCount: number;
  totalSaved: number;
}

export const ActionTracker: React.FC<ActionTrackerProps> = ({ committedCount, totalSaved }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-950/20 border border-emerald-500/20 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Mitigation Plan Summary</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span className="text-xs text-slate-400 block">Actions Committed</span>
          <span className="text-2xl font-bold text-white mt-1 block">{committedCount}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Projected Carbon Offset</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">-{totalSaved.toLocaleString()} kg</span>
        </div>
      </div>
    </div>
  );
};
