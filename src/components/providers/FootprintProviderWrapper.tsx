'use client';

import { FootprintProvider } from '@/context/FootprintContext';

export function FootprintProviderWrapper({ children }: { children: React.ReactNode }) {
  return <FootprintProvider>{children}</FootprintProvider>;
}
