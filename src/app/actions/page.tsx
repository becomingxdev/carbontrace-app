'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFootprint } from '@/context/FootprintContext';
import { Button } from '@/components/ui/Button';
import { InsightCard } from '@/components/actions/InsightCard';
import { ActionTracker } from '@/components/actions/ActionTracker';

export default function ActionsPage() {
  const { inputs, calculations, aiInsights, setAiInsights, committedActions, toggleActionCommit } = useFootprint();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no data exists, do not fire an empty request configuration
    if (calculations.total === 0 || aiInsights) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve server insights response.');
        }

        const data = await res.json();
        setAiInsights(data);
      } catch (err) {
        console.error(err);
        setError('Could not process reduction recommendations. Verify your API deployment setup.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [calculations.total, inputs, aiInsights, setAiInsights]);

  // Compute live cumulative offset savings
  const totalOffsetSaved = aiInsights?.recommendations
    .filter((item) => committedActions.includes(item.action))
    .reduce((sum, item) => sum + item.co2Saved, 0) || 0;

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto flex-grow w-full space-y-8">
      {/* Page Header Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Personalized Reduction Plan</h1>
          <p className="text-sm text-slate-400 mt-1">Take simple actions to offset your highest-impact categories.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {calculations.total === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-400">Please complete the configuration quiz to enable insights tracking models.</p>
        </div>
      ) : loading ? (
        /* Async Loading Screen Skeleton Block */
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-4">Generating target mitigation models...</h3>
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-900/60 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-950/30 text-rose-300 rounded-xl border border-rose-900/50 text-sm">
          {error}
        </div>
      ) : (
        /* Main Reactive Insights Column Engine */
        <div className="space-y-6">
          <ActionTracker committedCount={committedActions.length} totalSaved={totalOffsetSaved} />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tailored Mitigations Recommendations</h3>
            {aiInsights?.recommendations.map((item) => (
              <InsightCard
                key={item.action}
                item={item}
                isCommitted={committedActions.includes(item.action)}
                onToggle={() => toggleActionCommit(item.action)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}