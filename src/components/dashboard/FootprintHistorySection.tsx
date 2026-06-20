'use client';

import React from 'react';
import type { FootprintHistoryEntry } from '@/types/history';
import {
  formatHistoryDate,
  getFootprintTrend,
} from '@/lib/footprint-history';

interface FootprintHistorySectionProps {
  history: FootprintHistoryEntry[];
}

const TREND_LABELS = {
  improved: { label: 'Improved', className: 'text-emerald-400', symbol: '↓' },
  worsened: { label: 'Worsened', className: 'text-rose-400', symbol: '↑' },
  unchanged: { label: 'Unchanged', className: 'text-slate-400', symbol: '→' },
  first: { label: 'First entry', className: 'text-slate-400', symbol: '•' },
} as const;

export const FootprintHistorySection: React.FC<FootprintHistorySectionProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="history-heading" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
      <h2 id="history-heading" className="text-sm font-medium text-slate-400 tracking-wider uppercase mb-4">
        Footprint History
      </h2>
      <ul className="space-y-3">
        {history.slice(0, 10).map((entry, index) => {
          const previous = history[index + 1];
          const trend = getFootprintTrend(entry, previous);
          const trendMeta = TREND_LABELS[trend];
          const delta = previous
            ? entry.calculations.total - previous.calculations.total
            : 0;

          return (
            <li
              key={entry.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-slate-800 rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">{formatHistoryDate(entry.date)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total: <span className="text-slate-200 font-semibold">{entry.calculations.total.toLocaleString()} kg CO2e</span>
                </p>
              </div>
              <div className={`text-xs font-semibold ${trendMeta.className}`}>
                <span aria-hidden="true">{trendMeta.symbol} </span>
                {trendMeta.label}
                {previous && delta !== 0 && (
                  <span className="ml-1">
                    ({delta > 0 ? '+' : ''}{delta.toLocaleString()} kg)
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
