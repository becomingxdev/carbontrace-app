'use client';

import React from 'react';
import Link from 'next/link';
import { useFootprint } from '@/context/FootprintContext';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const { calculations } = useFootprint();
  const hasExistingData = calculations.total > 0;

  return (
    <div className="flex-grow flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Background radial glow effects for advanced visual aesthetics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        {/* Subtle top badge layout */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-inner">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Real-time Context Carbon Mitigation Engine
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Trace, Analyze, and Reduce Your{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Carbon Footprint
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto font-normal">
            An advanced evaluation platform combining verified environmental models with live GCP Gemini AI mitigation insights.
          </p>
        </div>

        {/* Core Direct Entry Action Layout Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/calculator">
            <Button variant="primary" size="lg" className="w-48 sm:w-auto font-semibold shadow-lg shadow-emerald-900/20">
              {hasExistingData ? 'Run New Calculation' : 'Start Carbon Audit'}
            </Button>
          </Link>

          {hasExistingData && (
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-48 sm:w-auto font-semibold">
                View My Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* 3-Tier Value Proposition Pillars Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-900 mt-12 max-w-2xl mx-auto">
          <div className="text-center p-2 space-y-1">
            <div className="text-xl text-emerald-400 font-bold">100% Secure</div>
            <p className="text-xs text-slate-500">Calculations run completely state-free and persist purely locally inside your browser.</p>
          </div>
          <div className="text-center p-2 space-y-1">
            <div className="text-xl text-teal-400 font-bold">IPCC Aligned</div>
            <p className="text-xs text-slate-500">Emission factors are mathematically weighted utilizing national and AR6 baseline models.</p>
          </div>
          <div className="text-center p-2 space-y-1">
            <div className="text-xl text-cyan-400 font-bold">Gemini Smart</div>
            <p className="text-xs text-slate-500">Retrieves real-time context action metrics explicitly structured by Google's flagship LLM model.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 