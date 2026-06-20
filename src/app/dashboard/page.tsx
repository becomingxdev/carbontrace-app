'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFootprint } from '@/context/FootprintContext';
import { Button } from '@/components/ui/Button';
import { CarbonScoreCard } from '@/components/dashboard/CarbonScoreCard';
import { CategoryDonutChart } from '@/components/dashboard/CategoryDonutChart';
import { ComparisonBarChart } from '@/components/dashboard/ComparisonBarChart';

export default function DashboardPage() {
  const router = useRouter();
  const { calculations } = useFootprint();

  const hasCalculated = calculations.total > 0;

  const handleFetchInsights = () => {
    router.push('/actions');
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto flex-grow w-full space-y-8">
      {/* Dashboard Top Header Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Carbon Footprint Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time metric visualization and global target alignment models.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/calculator">
            <Button variant="outline">Recalculate</Button>
          </Link>
          <Button 
            variant="primary" 
            onClick={handleFetchInsights}
            disabled={!hasCalculated}
          >
            Get Personalized AI Insights
          </Button>
        </div>
      </div>

      {!hasCalculated ? (
        /* Empty State Blueprint Fallback */
        <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl max-w-xl mx-auto space-y-4">
          <div className="text-3xl">🌱</div>
          <h2 className="text-xl font-bold text-slate-200">No Footprint Logged</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Please run through our 5-step interactive questionnaire layout to generate localized calculation profiles.
          </p>
          <Link href="/calculator" className="inline-block mt-2">
            <Button variant="primary">Start Form Wizard</Button>
          </Link>
        </div>
      ) : (
        /* Main Reactive Visualization Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column One: Key Score Metrics */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <CarbonScoreCard total={calculations.total} />
          </div>

          {/* Column Two & Three: Analytical Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            <CategoryDonutChart breakdown={calculations.breakdown} />
            <ComparisonBarChart total={calculations.total} />
          </div>
        </div>
      )}
    </div>
  );
}