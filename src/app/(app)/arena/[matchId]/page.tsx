'use client';

/**
 * Arena page — Player Waiting Room.
 * Users see who is available in the lobby for this match,
 * can challenge someone directly, or wait to be challenged.
 *
 * Flow: Lobby (choose stake) → Arena (waiting room) → Duel (challenge picker)
 * Step 3 in the 4-step flow.
 */

import { useState, useEffect } from 'react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { IncomingChallengeModal } from '@/components/ui/IncomingChallengeModal';
import { use } from 'react';

interface ArenaPageProps {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{
    home?: string;
    away?: string;
  }>;
}

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷', FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', USA: '🇺🇸', BRA: '🇧🇷', POR: '🇵🇹',
};

// Mock players available in this arena — in production these come from Supabase Realtime
const MOCK_PLAYERS = [
  { id: 'p1', username: 'messi_fan_99',    points: 2150, rank: '#12', lives: 3, waitSince: 18 },
  { id: 'p2', username: 'zizou_legend',    points: 1840, rank: '#45', lives: 5, waitSince: 42 },
  { id: 'p3', username: 'mbappé_2026',     points: 3100, rank: '#3',  lives: 2, waitSince: 7  },
  { id: 'p4', username: 'wc_gambler',      points: 920,  rank: '#210',lives: 1, waitSince: 61 },
  { id: 'p5', username: 'tango_dreams',    points: 1500, rank: '#89', lives: 4, waitSince: 3  },
];

// The mock challenger that will send an incoming challenge after 6 seconds
const MOCK_CHALLENGER = {
  id: 'p3',
  username: 'mbappé_2026',
  points: 3100,
  rank: '#3',
};

export default function ArenaPage({ params, searchParams }: ArenaPageProps) {
  const { matchId } = use(params);
  const sp = use(searchParams);
  const homeTeam = sp.home ?? 'ARG';
  const awayTeam = sp.away ?? 'FRA';

  // Mock user stats
  const userPoints = 1250;
  const userRank = '#142';

  const [elapsed, setElapsed] = useState(0);
  const [showIncoming, setShowIncoming] = useState(false);
  const [challengedBy, setChallengedBy] = useState<typeof MOCK_CHALLENGER | null>(null);

  // Tick the "waiting for" timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate incoming challenge after 6 seconds (demo)
  useEffect(() => {
    const t = setTimeout(() => {
      setChallengedBy(MOCK_CHALLENGER);
      setShowIncoming(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const goToDuel = (opponentId: string, opponentName: string) => {
    const duelId = `duel_${matchId}_${Date.now()}`;
    window.location.href = `/duel/${duelId}?home=${homeTeam}&away=${awayTeam}&opponent=${opponentName}`;
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--color-charcoal-900)' }}
    >
      {/* Stadium BG */}
      <div
        className="fixed inset-0 bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: "url('/stadium-bg.png')",
          filter: 'blur(5px) brightness(0.18)',
          transform: 'scale(1.1)',
          zIndex: 0,
        }}
      />

      {/* Incoming Challenge Modal */}
      {showIncoming && challengedBy && (
        <IncomingChallengeModal
          challenger={challengedBy}
          challengeText="Corner kick in the next 5 min"
          matchHomeTeam={homeTeam}
          matchAwayTeam={awayTeam}
          onAccept={() => {
            setShowIncoming(false);
            goToDuel(challengedBy.id, challengedBy.username);
          }}
          onDecline={() => {
            setShowIncoming(false);
            setChallengedBy(null);
          }}
        />
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Match context bar */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid var(--color-charcoal-600)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.06em',
            }}
          >
            {teamFlags[homeTeam]} {homeTeam}{' '}
            <span style={{ color: 'var(--color-charcoal-500)' }}>vs</span>{' '}
            {awayTeam} {teamFlags[awayTeam]}
          </div>
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-chiliz-red)' }}
          >
            ● LIVE
          </span>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={3} />

        {/* ── YOUR STATUS CARD ── */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(15,15,15,0.9) 100%)',
            border: '1.5px solid rgba(239,68,68,0.4)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px rgba(239,68,68,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="relative h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'var(--color-charcoal-700)',
                border: '2px solid var(--color-cyan-500)',
                boxShadow: '0 0 16px rgba(6,182,212,0.3)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                }}
              >
                C
              </span>
              {/* Green available dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2"
                style={{
                  background: '#22c55e',
                  borderColor: 'var(--color-charcoal-900)',
                  boxShadow: '0 0 8px rgba(34,197,94,0.8)',
                  animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  @carlos_fan
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.4)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  AVAILABLE
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Waiting {elapsed}s
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Ranking
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--color-chiliz-red)',
                  textShadow: '0 0 16px var(--color-chiliz-red-glow)',
                }}
              >
                🏆 {userPoints.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Global Rank {userRank}
              </p>
            </div>
          </div>
        </div>

        {/* ── ACTIVE PLAYERS LIST ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                letterSpacing: '0.2em',
                color: 'var(--color-text-tertiary)',
                fontWeight: 700,
              }}
            >
              PLAYERS IN ARENA
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(239,68,68,0.12)',
                color: 'var(--color-chiliz-red)',
                border: '1px solid rgba(239,68,68,0.3)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {MOCK_PLAYERS.length} online
            </span>
          </div>

          <div className="space-y-2">
            {MOCK_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200"
                style={{
                  background: 'rgba(10,10,10,0.7)',
                  border: '1.5px solid var(--color-charcoal-600)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Avatar + presence */}
                <div className="relative h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'var(--color-charcoal-700)',
                    border: '1.5px solid var(--color-charcoal-500)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {(player.username[0] ?? '?').toUpperCase()}
                  </span>
                  {/* Online dot */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[1.5px]"
                    style={{
                      background: '#22c55e',
                      borderColor: 'var(--color-charcoal-900)',
                      boxShadow: '0 0 6px rgba(34,197,94,0.7)',
                    }}
                  />
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    @{player.username}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    Waiting {player.waitSince}s · <span style={{ color: 'var(--color-chiliz-red)' }}>❤️ {player.lives}</span>
                  </p>
                </div>

                {/* Points */}
                <div className="text-right mr-4">
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    🏆 {player.points.toLocaleString()}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    Rank {player.rank}
                  </p>
                </div>

                {/* Challenge CTA */}
                <button
                  onClick={() => goToDuel(player.id, player.username)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                  style={{
                    background: 'var(--color-chiliz-red)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.1em',
                    boxShadow: '0 0 16px var(--color-chiliz-red-glow)',
                  }}
                >
                  ⚡ CHALLENGE
                </button>
                {/* Always-visible indicator for no-hover devices */}
                <div
                  className="flex-shrink-0 sm:hidden px-4 py-2 rounded-xl font-bold text-xs"
                  style={{
                    background: 'var(--color-charcoal-700)',
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-display)',
                  }}
                  onClick={() => goToDuel(player.id, player.username)}
                >
                  VS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <p
          className="text-center text-xs py-4"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Hover a player and click{' '}
          <span style={{ color: 'var(--color-chiliz-red)', fontWeight: 700 }}>⚡ CHALLENGE</span>{' '}
          to send them a duel request — or wait to be challenged.
        </p>
      </div>
    </div>
  );
}
