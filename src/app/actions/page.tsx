'use client';

import React from 'react';
import Link from 'next/link';
import { FootprintProviderWrapper } from '@/components/providers/FootprintProviderWrapper';
import { useFootprint } from '@/context/FootprintContext';
import { Button } from '@/components/ui/Button';
import { InsightCard } from '@/components/actions/InsightCard';
import { ActionTracker } from '@/components/actions/ActionTracker';
import { useCarbonInsights } from '@/hooks/useCarbonInsights';
import { calculateCommittedSavings } from '@/lib/carbon-calculator';

function ActionsContent() {
  const {
    inputs,
    calculations,
    aiInsights,
    setAiInsights,
    clearAiInsights,
    committedActions,
    toggleActionCommit,
  } = useFootprint();

  const { loading, error, refreshInsights } = useCarbonInsights({
    inputs,
    totalFootprint: calculations.total,
    existingInsights: aiInsights,
    onSuccess: setAiInsights,
  });

  const totalOffsetSaved = aiInsights
    ? calculateCommittedSavings(aiInsights.recommendations, committedActions)
    : 0;

  const handleRefreshInsights = () => {
    clearAiInsights();
    refreshInsights();
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto flex-grow w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Personalized Reduction Plan</h1>
          <p className="text-sm text-slate-400 mt-1">Take simple actions to offset your highest-impact categories.</p>
        </div>
        <div className="flex gap-3">
          {calculations.total > 0 && !loading && (
            <Button variant="secondary" onClick={handleRefreshInsights}>
              Generate Fresh Insights
            </Button>
          )}
          <Link href="/dashboard" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {calculations.total === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-400">Please complete the configuration quiz to enable insights tracking models.</p>
        </div>
      ) : loading ? (
        <div className="space-y-4 animate-pulse" aria-hidden="true">
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-4">Generating target mitigation models...</h2>
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-900/60 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-950/30 text-rose-300 rounded-xl border border-rose-900/50 text-sm">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <ActionTracker committedCount={committedActions.length} totalSaved={totalOffsetSaved} />

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tailored Mitigations Recommendations</h2>
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

export default function ActionsPage() {
  return (
    <FootprintProviderWrapper>
      <ActionsContent />
    </FootprintProviderWrapper>
  );
}
