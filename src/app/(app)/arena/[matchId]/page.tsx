'use client';

/**
 * Arena page — Player Waiting Room.
 * Uses Blind Matchmaking to prevent collusion.
 *
 * Flow: Lobby (choose stake) → Arena (waiting room) → Duel (challenge picker)
 * Step 3 in the 4-step flow.
 */

import { useState, useEffect, use } from 'react';
import { StepIndicator } from '@/components/ui/StepIndicator';

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

const MOCK_OPPONENTS = [
  { id: 'p1', username: 'messi_fan_99' },
  { id: 'p2', username: 'zizou_legend' },
  { id: 'p3', username: 'mbappé_2026' },
  { id: 'p4', username: 'wc_gambler' },
];

export default function ArenaPage({ params, searchParams }: ArenaPageProps) {
  const { matchId } = use(params);
  const sp = use(searchParams);
  const homeTeam = sp.home ?? 'ARG';
  const awayTeam = sp.away ?? 'FRA';

  // Mock user stats
  const userPoints = 1250;
  const userRank = '#142';

  const [elapsed, setElapsed] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [onlinePlayers] = useState(Math.floor(Math.random() * 50) + 120); // e.g. 154

  // Tick the "waiting for" timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const goToDuel = (opponentId: string, opponentName: string) => {
    const duelId = `duel_${matchId}_${Date.now()}`;
    window.location.href = `/duel/${duelId}?home=${homeTeam}&away=${awayTeam}&opponent=${opponentName}`;
  };

  const handleFindMatch = () => {
    setIsSearching(true);
    // Simulate finding an opponent after 2.5 seconds
    setTimeout(() => {
      const opponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)]!;
      goToDuel(opponent.id, opponent.username);
    }, 2500);
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

        {/* ── AUTOMATIC MATCHMAKING ── */}
        <div 
          className="rounded-2xl p-8 flex flex-col items-center justify-center text-center mt-8"
          style={{
            background: 'rgba(10,10,10,0.7)',
            border: '1.5px solid var(--color-charcoal-600)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="mb-6">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              ARENA MATCHMAKING
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              {onlinePlayers} players currently waiting
            </p>
          </div>

          <button
            onClick={handleFindMatch}
            disabled={isSearching}
            className="w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              background: isSearching ? 'var(--color-charcoal-700)' : 'var(--color-chiliz-red)',
              color: isSearching ? 'var(--color-text-tertiary)' : '#fff',
              boxShadow: isSearching ? 'none' : '0 0 40px var(--color-chiliz-red-glow)',
              transform: isSearching ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {isSearching ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                SEARCHING OPPONENT...
              </span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">⚔️</span> FIND MATCH
              </span>
            )}
            
            {/* Hover shine effect */}
            {!isSearching && (
              <div 
                className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            )}
          </button>

          <p className="text-xs mt-6 max-w-sm" style={{ color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
            The system will automatically pair you with an opponent of similar rank to ensure fair play.
          </p>
        </div>
      </div>
    </div>
  );
}
