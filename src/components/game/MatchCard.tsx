import Link from 'next/link';

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  status: 'scheduled' | 'live' | 'half_time' | 'finished' | 'voided';
  kickoffAt: string;
  homeScore?: number;
  awayScore?: number;
}

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷', FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', USA: '🇺🇸', BRA: '🇧🇷', POR: '🇵🇹',
};

export function MatchCard({ id, homeTeam, awayTeam, status, kickoffAt, homeScore, awayScore }: MatchCardProps) {
  const isLive = status === 'live' || status === 'half_time';
  const kickoff = new Date(kickoffAt).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid',
  });

  return (
    <Link
      href={`/lobby/${id}`}
      className="group block rounded-[--radius-lg] border border-[--color-charcoal-500] bg-[--color-charcoal-800] overflow-hidden transition-all duration-[--dur-base] hover:border-[--color-charcoal-400] hover:bg-[--color-charcoal-700]"
      style={{
        boxShadow: isLive ? 'var(--glow-red)' : 'var(--elevation-2)',
      }}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="h-0.5 w-full bg-[--color-chiliz-red]" style={{ boxShadow: '0 0 8px var(--color-chiliz-red-glow)' }} />
      )}

      <div className="p-5">
        {/* Status */}
        <div className="flex justify-between items-center mb-4">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[--color-chiliz-red] uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-chiliz-red] animate-pulse" />
              {status === 'half_time' ? 'Half Time' : 'Live'}
            </span>
          ) : status === 'finished' ? (
            <span className="text-xs text-[--color-text-tertiary] uppercase tracking-widest">Full Time</span>
          ) : (
            <span className="text-xs text-[--color-text-tertiary] uppercase tracking-widest">{kickoff} CET</span>
          )}
          <span className="text-xs text-[--color-text-tertiary] uppercase tracking-widest">World Cup 2026</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{teamFlags[homeTeam] ?? '🏳️'}</span>
            <span
              className="text-[--color-text-primary] font-semibold tracking-wider"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}
            >
              {homeTeam}
            </span>
          </div>

          {isLive || status === 'finished' ? (
            <span
              className="tabular-nums text-[--color-text-primary] px-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700 }}
            >
              {homeScore ?? 0} <span className="text-[--color-charcoal-500]">–</span> {awayScore ?? 0}
            </span>
          ) : (
            <span
              className="text-[--color-chiliz-red] px-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}
            >
              VS
            </span>
          )}

          <div className="flex items-center gap-3 flex-row-reverse">
            <span className="text-2xl">{teamFlags[awayTeam] ?? '🏳️'}</span>
            <span
              className="text-[--color-text-primary] font-semibold tracking-wider"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}
            >
              {awayTeam}
            </span>
          </div>
        </div>

        {/* CTA hint */}
        <div className="mt-4 pt-4 border-t border-[--color-charcoal-500] flex items-center justify-between">
          <span className="text-xs text-[--color-text-tertiary]">
            {isLive ? 'Duel active now' : 'Opens at kickoff'}
          </span>
          <span className="text-xs text-[--color-cyan-500] group-hover:text-[--color-cyan-400] transition-colors">
            Enter Lobby →
          </span>
        </div>
      </div>
    </Link>
  );
}
