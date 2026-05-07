/**
 * MatchBanner — 240px hero banner per Design System §5.1.
 * Shows match teams, score (if live), and minute.
 */
interface MatchBannerProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  status: 'scheduled' | 'live' | 'half_time' | 'finished' | 'voided';
  kickoffAt: string;
}

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷',
  FRA: '🇫🇷',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  USA: '🇺🇸',
  BRA: '🇧🇷',
  POR: '🇵🇹',
};

export function MatchBanner({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  minute,
  status,
  kickoffAt,
}: MatchBannerProps) {
  const isLive = status === 'live' || status === 'half_time';
  const kickoff = new Date(kickoffAt);
  const kickoffFormatted = kickoff.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  });

  return (
    <div
      className="relative w-full h-60 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 30% 50%, #1a0505 0%, var(--color-charcoal-900) 60%), radial-gradient(ellipse at 70% 50%, #051015 0%, var(--color-charcoal-900) 60%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--color-charcoal-500) 39px, var(--color-charcoal-500) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, var(--color-charcoal-500) 39px, var(--color-charcoal-500) 40px)',
        }}
      />

      {/* Status pill */}
      <div className="mb-4 z-10">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[--color-chiliz-red] bg-opacity-20 border border-[--color-chiliz-red] text-[--color-chiliz-red] text-xs font-semibold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-[--color-chiliz-red] animate-pulse" />
            {status === 'half_time' ? 'Half Time' : `Live · ${minute ?? 0}'`}
          </span>
        ) : status === 'finished' ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[--color-charcoal-700] border border-[--color-charcoal-500] text-[--color-text-secondary] text-xs uppercase tracking-widest">
            Full Time
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[--color-charcoal-700] border border-[--color-charcoal-500] text-[--color-text-tertiary] text-xs uppercase tracking-widest">
            {kickoffFormatted} CET
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center gap-6 z-10">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 w-32">
          <span className="text-4xl">{teamFlags[homeTeam] ?? '🏳️'}</span>
          <span
            className="font-display text-display-md font-semibold text-[--color-text-primary] tracking-widest"
            style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.08em' }}
          >
            {homeTeam}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          {isLive || status === 'finished' ? (
            <span
              className="tabular-nums text-[--color-text-primary]"
              style={{ fontFamily: 'var(--font-display)', fontSize: '56px', lineHeight: 1, fontWeight: 700 }}
            >
              {homeScore ?? 0}
              <span className="text-[--color-charcoal-500] mx-2">–</span>
              {awayScore ?? 0}
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--color-chiliz-red)',
                animation: 'vsFloat 6s ease-in-out infinite',
                textShadow: '0 0 40px var(--color-chiliz-red-glow), 0 0 10px var(--color-chiliz-red-glow)',
              }}
            >
              VS
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 w-32">
          <span className="text-4xl">{teamFlags[awayTeam] ?? '🏳️'}</span>
          <span
            className="font-display text-display-md font-semibold text-[--color-text-primary] tracking-widest"
            style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.08em' }}
          >
            {awayTeam}
          </span>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-20"
        style={{ background: 'var(--overlay-scrim)' }}
      />
    </div>
  );
}
