/**
 * Home page — marketing landing.
 * Placeholder until Phase 3 (Lobby) is implemented.
 */

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] text-center px-4"
      style={{ backgroundColor: 'var(--color-charcoal-900)' }}
    >
      <div className="flex flex-col items-center gap-6 max-w-lg">
        {/* Hero wordmark */}
        <h1
          className="text-[56px] font-bold leading-[60px] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          CHILIZ{' '}
          <span style={{ color: 'var(--color-chiliz-red)' }}>CLASH</span>
        </h1>

        <p
          className="text-[17px] leading-[26px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Real-time 1v1 fan duels tied to live match events.
          <br />
          Stake. Predict. Clash.
        </p>

        {/* Status badge */}
        <div
          className="px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase"
          style={{
            backgroundColor: 'var(--color-charcoal-800)',
            border: '1px solid var(--color-charcoal-500)',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
          }}
        >
          Phase 0 — Environment Setup ✓
        </div>
      </div>
    </div>
  );
}
