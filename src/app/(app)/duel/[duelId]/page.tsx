'use client';

import { use, useState, useEffect } from 'react';
import { ChallengeSelector } from '@/components/game/ChallengeSelector';
import { FaceOffCard } from '@/components/game/FaceOffCard';
import { StepIndicator } from '@/components/ui/StepIndicator';
import type { Challenge } from '@/components/game/ChallengeSelector';

interface DuelPageProps {
  params: Promise<{ duelId: string }>;
  searchParams: Promise<{ home?: string; away?: string; opponent?: string }>;
}

// Duel demo phases
type DuelPhase = 'select_challenge' | 'waiting_rival' | 'active' | 'resolved';

const DEMO_DUEL_BASE = {
  playerA: {
    id: 'user_a',
    username: 'carlos_fan',
    isOnline: true,
    isCurrentUser: true,
  },
  playerB: {
    id: 'user_b',
    username: 'rival_arg',
    isOnline: true,
    isCurrentUser: false,
  },
};

export default function DuelPage({ params, searchParams }: DuelPageProps) {
  const { duelId } = use(params);
  const sp = use(searchParams);
  const homeTeam = sp.home ?? 'ARG';
  const awayTeam = sp.away ?? 'FRA';
  const opponentName = sp.opponent ?? 'rival_arg';

  const [phase, setPhase] = useState<DuelPhase>('select_challenge');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [minute, setMinute] = useState(67);
  const [score, setScore] = useState({ home: 1, away: 1 });
  const [winner, setWinner] = useState<'a' | 'b' | null>(null);

  // Auto-run demo: rival accepts after 3s, match resolves after 10s
  useEffect(() => {
    if (phase !== 'waiting_rival') return;
    const rivalTimer = setTimeout(() => setPhase('active'), 3000);
    return () => clearTimeout(rivalTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'active') return;
    // Tick the match minute
    const ticker = setInterval(() => setMinute((m) => m + 1), 1500);
    // Resolve after 10s with player A winning
    const resolver = setTimeout(() => {
      setWinner('a');
      setScore((s) => ({ ...s, home: s.home + 1 }));
      setPhase('resolved');
    }, 10000);
    return () => { clearInterval(ticker); clearTimeout(resolver); };
  }, [phase]);

  const handlePropose = () => {
    if (!selectedChallenge) return;
    setPhase('waiting_rival');
  };

  const faceOffStatus = (() => {
    if (phase === 'waiting_rival') return 'pending_acceptance' as const;
    if (phase === 'active') return 'active' as const;
    if (phase === 'resolved') return winner === 'a' ? 'a_wins' as const : 'b_wins' as const;
    return 'pending_proposal' as const;
  })();

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--color-charcoal-900)' }}
    >
      {/* Stadium background — blurred behind the content */}
      <div
        className="fixed inset-0 bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: "url('/stadium-bg.png')",
          filter: 'blur(6px) brightness(0.15)',
          transform: 'scale(1.1)',
          zIndex: 0,
        }}
      />
      {/* Subtle green field tint at center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,100,0,0.05) 0%, transparent 60%)',
          zIndex: 1,
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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--color-text-primary)', letterSpacing: '0.06em' }}>
            {homeTeam} <span style={{ color: 'var(--color-charcoal-500)' }}>·</span>{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{score.home}–{score.away}</span>{' '}
            <span style={{ color: 'var(--color-charcoal-500)' }}>·</span> {awayTeam}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-chiliz-red)' }}>
            {minute}&apos;{' '}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[--color-chiliz-red] animate-pulse ml-1" />
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={phase === 'resolved' ? 4 : 3} />

        {/* ── PHASE A: CHALLENGE SELECTION ── */}
        {phase === 'select_challenge' && (
          <div
            className="rounded-2xl border p-6 space-y-6"
            style={{
              background: 'rgba(15,15,15,0.85)',
              border: '1.5px solid var(--color-charcoal-600)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <ChallengeSelector
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              onSelect={setSelectedChallenge}
            />
            {selectedChallenge && (
              <div className="p-4 rounded-xl border border-dashed border-chiliz-red/40 bg-chiliz-red/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-chiliz-red font-black">Ready to Challenge</p>
                  <p className="text-sm font-bold text-text-primary">&ldquo;{selectedChallenge.text}&rdquo;</p>
                </div>
                <div className="text-2xl animate-bounce">👇</div>
              </div>
            )}

            <button
              onClick={handlePropose}
              disabled={!selectedChallenge}
              className="w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                background: selectedChallenge ? 'var(--color-chiliz-red)' : 'var(--color-charcoal-700)',
                color: selectedChallenge ? '#fff' : 'var(--color-text-tertiary)',
                boxShadow: selectedChallenge ? '0 0 40px var(--color-chiliz-red-glow)' : 'none',
                cursor: selectedChallenge ? 'pointer' : 'not-allowed',
                border: selectedChallenge ? '2px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              }}
            >
              {selectedChallenge ? '🔥 SEND CHALLENGE NOW' : 'SELECT A PREDICTION'}
            </button>
          </div>
        )}

        {/* ── PHASES B, C, D: FACEOFFCARD ── */}
        {phase !== 'select_challenge' && (
          <FaceOffCard
            status={faceOffStatus}
            playerA={{ ...DEMO_DUEL_BASE.playerA, points: 1250, rank: '#142' }}
            playerB={{ ...DEMO_DUEL_BASE.playerB, username: opponentName, points: 2100, rank: '#30' }}
            score={score}
            homeShortCode={homeTeam}
            awayShortCode={awayTeam}
            minute={minute}
            challengeText={selectedChallenge?.text ?? ''}
            onPropose={handlePropose}
            onAccept={() => {}}
            onDecline={() => {}}
          />
        )}

        {/* ── PHASE B: Waiting for rival banner ── */}
        {phase === 'waiting_rival' && (
          <div
            className="rounded-2xl border p-6 text-center space-y-3"
            style={{
              background: 'rgba(15,15,15,0.85)',
              border: '1.5px solid var(--color-charcoal-600)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-[--color-chiliz-red] border-t-transparent animate-spin" />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-text-primary)', letterSpacing: '0.06em' }}>
                Waiting for @rival_arg...
              </p>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Your challenge is being sent to your opponent. They have 30 seconds to accept.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-chiliz-red)' }}
            >
              <span className="font-mono">&ldquo;{selectedChallenge?.text}&rdquo;</span>
            </div>
          </div>
        )}

        {/* ── PHASE C: Active duel events ── */}
        {phase === 'active' && (
          <div
            className="rounded-2xl border p-5"
            style={{
              background: 'rgba(15,15,15,0.85)',
              border: '1.5px solid rgba(239,68,68,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[--color-chiliz-red] animate-pulse" />
              <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-chiliz-red)' }}>
                Duel Active — awaiting event
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Challenge: <strong style={{ color: 'var(--color-text-primary)' }}>&ldquo;{selectedChallenge?.text}&rdquo;</strong>
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              The AI referee is watching the match in real-time and will resolve when the event occurs or time expires.
            </p>
          </div>
        )}

        {/* ── PHASE D: WIN SCREEN ── */}
        {phase === 'resolved' && (
          <div
            className="rounded-2xl border p-8 text-center space-y-4"
            style={{
              background: winner === 'a' 
                ? 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(15,15,15,0.9) 100%)'
                : 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(15,15,15,0.9) 100%)',
              border: winner === 'a'
                ? '1.5px solid rgba(34,197,94,0.4)'
                : '1.5px solid rgba(239,68,68,0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: winner === 'a'
                ? '0 0 60px rgba(34,197,94,0.15)'
                : '0 0 60px rgba(239,68,68,0.15)',
            }}
          >
            <div className="text-6xl">{winner === 'a' ? '🏆' : '💔'}</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                fontWeight: 900,
                color: winner === 'a' ? '#22c55e' : 'var(--color-chiliz-red)',
                letterSpacing: '-0.01em',
                textShadow: winner === 'a' 
                  ? '0 0 30px rgba(34,197,94,0.5)'
                  : '0 0 30px rgba(239,68,68,0.5)',
              }}
            >
              {winner === 'a' ? 'YOU WIN!' : 'YOU LOST!'}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                color: 'var(--color-text-primary)',
              }}
            >
              {winner === 'a' ? '+100 POINTS' : '-1 LIFE'}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {winner === 'a' 
                ? 'Your prediction was correct! These points have been added to your daily and weekly ranking.'
                : 'Your prediction was incorrect. Better luck next time! Your life has been deducted.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  letterSpacing: '0.08em',
                  background: 'var(--color-chiliz-red)',
                  color: '#fff',
                  boxShadow: '0 0 20px var(--color-chiliz-red-glow)',
                }}
              >
                ⚡ PLAY AGAIN
              </button>
              <button
                onClick={() => window.location.href = '/leaderboard'}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  letterSpacing: '0.08em',
                  background: 'var(--color-charcoal-700)',
                  color: '#f59e0b',
                  border: '1.5px solid rgba(245, 158, 11, 0.4)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)',
                }}
              >
                🏆 VIEW RANKINGS
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  letterSpacing: '0.08em',
                  background: 'var(--color-charcoal-700)',
                  color: 'var(--color-text-secondary)',
                  border: '1.5px solid var(--color-charcoal-500)',
                }}
              >
                ← Home
              </button>
            </div>
          </div>
        )}

        {/* Duel ID footer */}
        <p
          className="text-center"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-charcoal-500)' }}
        >
          #{duelId.slice(0, 16)}
        </p>
      </div>
    </div>
  );
}
