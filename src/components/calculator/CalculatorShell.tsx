'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFootprint } from '@/context/FootprintContext';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TransportStep } from './TransportStep';
import { EnergyStep } from './EnergyStep';
import { FoodStep } from './FoodStep';
import { ShoppingStep } from './ShoppingStep';
import { WasteStep } from './WasteStep';
import type { FootprintInput } from '@/validators/footprint.schema';

type UpdateCategoryFn = <K extends keyof FootprintInput>(
  category: K,
  data: FootprintInput[K]
) => void;

const STEPS = [
  {
    id: 1,
    render: (inputs: FootprintInput, updateCategory: UpdateCategoryFn) => (
      <TransportStep
        data={inputs.transport}
        onChange={(data) => updateCategory('transport', data)}
      />
    ),
  },
  {
    id: 2,
    render: (inputs: FootprintInput, updateCategory: UpdateCategoryFn) => (
      <EnergyStep
        data={inputs.energy}
        onChange={(data) => updateCategory('energy', data)}
      />
    ),
  },
  {
    id: 3,
    render: (inputs: FootprintInput, updateCategory: UpdateCategoryFn) => (
      <FoodStep
        data={inputs.food}
        onChange={(data) => updateCategory('food', data)}
      />
    ),
  },
  {
    id: 4,
    render: (inputs: FootprintInput, updateCategory: UpdateCategoryFn) => (
      <ShoppingStep
        data={inputs.shopping}
        onChange={(data) => updateCategory('shopping', data)}
      />
    ),
  },
  {
    id: 5,
    render: (inputs: FootprintInput, updateCategory: UpdateCategoryFn) => (
      <WasteStep
        data={inputs.waste}
        onChange={(data) => updateCategory('waste', data)}
      />
    ),
  },
] as const;

export const CalculatorShell: React.FC = () => {
  const router = useRouter();
  const { inputs, updateCategory, recordCalculation } = useFootprint();
  const [step, setStep] = useState<number>(1);
  const totalSteps = STEPS.length;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      return;
    }

    recordCalculation();
    router.push('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const currentStep = STEPS[step - 1];

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>STEP {step} OF {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% COMPLETE</span>
        </div>
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>

      <div className="min-h-[300px]">
        {currentStep.render(inputs, updateCategory)}
      </div>

      <div className="flex justify-between items-center border-t border-slate-800 mt-8 pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="px-5"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          className="px-6"
        >
          {step === totalSteps ? 'View My Footprint' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
