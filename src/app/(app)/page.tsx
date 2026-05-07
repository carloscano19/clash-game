/**
 * Home page — Live Match Lobby.
 * Lists all active & upcoming World Cup matches.
 * Server Component — fetches matches from mock API.
 */
import { MatchCard } from '@/components/game/MatchCard';
import { HowItWorks } from '@/components/ui/HowItWorks';
import { simulatorRegistry } from '@/features/live-data/simulator';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const matches = simulatorRegistry.getAllMatches();

  const teamToShortCode: Record<string, string> = {
    ARG: 'ARG', FRA: 'FRA', ENG: 'ENG', USA: 'USA', BRA: 'BRA', POR: 'POR',
  };
  // Map fixture match IDs → display team codes
  const displayMatches = matches.map((m) => ({
    id: m.id,
    homeTeam: m.homeTeam.shortCode,
    awayTeam: m.awayTeam.shortCode,
    status: m.status,
    kickoffAt: m.kickoffAt,
    homeScore: m.score.home,
    awayScore: m.score.away,
  }));

  const liveMatches = displayMatches.filter((m) => m.status === 'live' || m.status === 'half_time');
  const upcomingMatches = displayMatches.filter((m) => m.status === 'scheduled');
  const pastMatches = displayMatches.filter((m) => m.status === 'finished');

  void teamToShortCode; // suppress unused warning

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-charcoal-900)' }}>
      {/* Hero heading */}
      <div className="relative overflow-hidden px-4 pt-12 pb-8 text-center">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--color-chiliz-red)' }}
        />
        <p
          className="uppercase tracking-[0.2em] text-[--color-text-tertiary] text-xs mb-3"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          FIFA World Cup 2026
        </p>
        <h1
          className="text-[--color-text-primary] mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          CHOOSE YOUR BATTLE
        </h1>
        <p className="text-[--color-text-secondary] text-base max-w-sm mx-auto">
          Predict the next event, challenge rivals, and climb the leaderboard!
        </p>
      </div>

      {/* How It Works Explainer */}
      <HowItWorks />

      {/* Match sections */}
      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-10">

        {/* Live now */}
        {liveMatches.length > 0 && (
          <section>
            <h2
              className="flex items-center gap-2 mb-4 text-[--color-chiliz-red] text-sm uppercase tracking-widest font-semibold"
            >
              <span className="h-2 w-2 rounded-full bg-[--color-chiliz-red] animate-pulse" />
              Live Now
            </h2>
            <div className="space-y-3">
              {liveMatches.map((m) => (
                <MatchCard key={m.id} {...m} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcomingMatches.length > 0 && (
          <section>
            <h2
              className="mb-4 text-[--color-text-tertiary] text-sm uppercase tracking-widest font-semibold"
            >
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcomingMatches.map((m) => (
                <MatchCard key={m.id} {...m} />
              ))}
            </div>
          </section>
        )}

        {/* No matches fallback */}
        {displayMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">⚽</span>
            <h3
              className="text-[--color-text-secondary] mb-2"
              style={{ fontFamily: 'var(--font-body)', fontSize: '22px', fontWeight: 700 }}
            >
              No matches available
            </h3>
            <p className="text-[--color-text-tertiary] text-sm">
              Check back closer to kickoff, or run the seed script to populate test data.
            </p>
            <code className="mt-4 text-xs text-[--color-cyan-500] bg-[--color-charcoal-800] px-4 py-2 rounded">
              npx tsx scripts/seed-matches.ts
            </code>
          </div>
        )}

        {/* Past */}
        {pastMatches.length > 0 && (
          <section>
            <h2 className="mb-4 text-[--color-text-tertiary] text-sm uppercase tracking-widest font-semibold">
              Recently Finished
            </h2>
            <div className="space-y-3">
              {pastMatches.map((m) => (
                <MatchCard key={m.id} {...m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
