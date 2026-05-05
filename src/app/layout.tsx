/**
 * Root layout — app shell.
 * Imports design tokens and wraps all pages with the top bar.
 * See design_system.md §2.2
 */

import type { Metadata } from 'next';
// Font imports — JS module style is required in Next.js (not @import in CSS with Tailwind 4)
import '@fontsource-variable/inter';
import '@fontsource/rajdhani/400.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/rajdhani/700.css';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import { TopBar } from '@/components/ui/TopBar';

export const metadata: Metadata = {
  title: 'Chiliz Clash — Live 1v1 Duels',
  description:
    'Real-time 1v1 fan duels tied to live World Cup match events. Stake SSU or Fan Tokens. Let the AI arbitrate.',
  keywords: ['chiliz', 'fan tokens', 'world cup', 'live duels', 'football'],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Persistent top bar — 60px, charcoal-900, bottom border charcoal-500 */}
        <TopBar />

        {/* Full-bleed content area */}
        <main className="min-h-screen pt-[60px]">
          {children}
        </main>
      </body>
    </html>
  );
}
