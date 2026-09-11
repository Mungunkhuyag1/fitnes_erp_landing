'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

/**
 * ⚠ Dashboard-ынхаас ЯЛГААТАЙ: `AuthProvider` БАЙХГҮЙ. Landing нь
 * нэвтрэлтгүй тул токен хадгалах, сэргээх логик хэрэггүй.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
