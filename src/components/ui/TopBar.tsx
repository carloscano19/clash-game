'use client';

/**
 * TopBar — persistent top bar component.
 * Layout: Wordmark | Match Pill | [SSU Balance | Avatar]
 * Height: 60px, background: charcoal-900, bottom border: charcoal-500
 * See design_system.md §2.2
 */

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-4 md:px-6"
      style={{
        backgroundColor: 'var(--color-charcoal-900)',
        borderBottom: '1px solid var(--color-charcoal-500)',
      }}
      role="banner"
    >
      {/* Left: Wordmark */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
          aria-label="Chiliz Clash — Home"
        >
          <Zap
            size={20}
            style={{ color: 'var(--color-chiliz-red)' }}
            aria-hidden="true"
          />
          <span
            className="text-[18px] font-semibold tracking-wide select-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            CHILIZ CLASH
          </span>
        </Link>

        {/* INTERNAL environment pill — shown in non-prod */}
        <InternalEnvPill />
      </div>

      {/* Center: Match pill (placeholder — wired in Phase 3) */}
      <div className="hidden md:flex items-center">
        <MatchPill />
      </div>

      {/* Right: Balance + Avatar */}
      <div className="flex items-center gap-3">
        <BalancePill />
        <AvatarMenu />
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (stubs — wired in later phases)
// ---------------------------------------------------------------------------

/** Shown in non-prod environments per coding_standards.md §3.6 */
function InternalEnvPill() {
  const env = process.env['NEXT_PUBLIC_SOCIOS_ENV'];
  if (!env || env === 'prod') return null;

  return (
    <span
      className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full"
      style={{
        backgroundColor: 'var(--color-charcoal-700)',
        color: 'var(--color-warning)',
        border: '1px solid var(--color-warning)',
        letterSpacing: '0.1em',
      }}
    >
      INTERNAL · {env.toUpperCase()}
    </span>
  );
}

/** Match score pill — placeholder until live data is wired (Phase 7) */
function MatchPill() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
      style={{
        backgroundColor: 'var(--color-charcoal-800)',
        border: '1px solid var(--color-charcoal-500)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
      }}
    >
      <span>No match selected</span>
    </div>
  );
}

/** SSU balance pill — placeholder until auth is wired (Phase 1) */
function BalancePill() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-1 rounded-full"
      style={{
        backgroundColor: 'var(--color-charcoal-800)',
        border: '1px solid var(--color-charcoal-500)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
      }}
      aria-label="SSU balance"
    >
      <span style={{ color: 'var(--color-text-tertiary)' }}>⟁</span>
      <span>—</span>
    </div>
  );
}

/** Avatar menu — placeholder until auth is wired (Phase 1) */
function AvatarMenu() {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
      style={{
        backgroundColor: 'var(--color-charcoal-700)',
        border: '1px solid var(--color-charcoal-500)',
        color: 'var(--color-text-secondary)',
      }}
      aria-label="Account menu"
      aria-haspopup="true"
      id="avatar-menu-trigger"
    >
      ?
    </button>
  );
}
