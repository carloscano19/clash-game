import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getServerUserProfile } from '@/lib/auth';

/**
 * TopBar — persistent top bar component.
 * Layout: Wordmark | Match Pill | [SSU Balance | Avatar]
 * Height: 60px, background: charcoal-900, bottom border: charcoal-500
 * See design_system.md §2.2
 */
export async function TopBar() {
  const profileResult = await getServerUserProfile();
  const profile = profileResult.ok ? profileResult.value : null;

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

      <div className="flex items-center gap-3">
        <Link href="/leaderboard" className="no-underline group">
          <PointsPill points={profile ? 1250 : undefined} rank={profile ? "#142" : undefined} />
        </Link>
        {profile ? (
          <LivesPill lives={5} />
        ) : (
          <LivesPill />
        )}
        {profile ? (
          <AvatarMenu initial={profile.display_name.charAt(0).toUpperCase()} />
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold text-text-primary hover:text-chiliz-red transition-colors"
          >
            Login
          </Link>
        )}
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

/** Lives pill */
function LivesPill({ lives }: { lives?: number }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        fontFamily: 'var(--font-display)',
        color: lives !== undefined ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: '14px',
        fontWeight: 700,
      }}
      aria-label="Lives remaining"
    >
      <span style={{ fontSize: '12px' }}>❤️</span>
      <span>{lives !== undefined ? `${lives}/5` : '—'}</span>
    </div>
  );
}

/** Points pill */
function PointsPill({ points, rank }: { points?: number; rank?: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${points !== undefined ? 'animate-pulse-glow' : ''}`}
      style={{
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        fontFamily: 'var(--font-display)',
        color: points !== undefined ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: '14px',
        fontWeight: 700,
      }}
      aria-label="Ranking Points"
    >
      <span style={{ fontSize: '13px' }}>🏆</span>
      <span className="group-hover:text-amber-400 transition-colors">
        {points !== undefined ? points.toLocaleString() : 'RANKING'}
      </span>
      {rank && (
        <span className="ml-1 text-[10px] text-amber-400 opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>
          {rank}
        </span>
      )}
    </div>
  );
}

/** Avatar menu */
function AvatarMenu({ initial }: { initial: string }) {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors hover:ring-2 hover:ring-chiliz-red"
      style={{
        backgroundColor: 'var(--color-charcoal-700)',
        border: '1px solid var(--color-charcoal-500)',
        color: 'var(--color-text-primary)',
      }}
      aria-label="Account menu"
      aria-haspopup="true"
      id="avatar-menu-trigger"
    >
      {initial}
    </button>
  );
}
