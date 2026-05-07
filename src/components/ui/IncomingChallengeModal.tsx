'use client';

/**
 * IncomingChallengeModal — full-screen overlay that slides in when
 * another player sends you a duel challenge.
 * Accept → goes to Duel page. Decline → returns to Arena.
 */

import { useEffect, useState } from 'react';

interface Challenger {
  id: string;
  username: string;
  stake?: number; // Optional so we don't break old code
  tokenLabel?: string;
  points?: number;
  rank?: string;
}

interface IncomingChallengeModalProps {
  challenger: Challenger;
  challengeText: string;
  matchHomeTeam: string;
  matchAwayTeam: string;
  onAccept: () => void;
  onDecline: () => void;
}

const ACCEPT_TIMEOUT_SECONDS = 30;

export function IncomingChallengeModal({
  challenger,
  challengeText,
  matchHomeTeam,
  matchAwayTeam,
  onAccept,
  onDecline,
}: IncomingChallengeModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(ACCEPT_TIMEOUT_SECONDS);
  const [visible, setVisible] = useState(false);

  // Slide in after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { onDecline(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onDecline]);

  const progress = (secondsLeft / ACCEPT_TIMEOUT_SECONDS) * 100;

  return (
    <>
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          opacity: visible ? 1 : 0,
        }}
        onClick={onDecline}
      />

      {/* Modal panel — slides up from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div
          className="mx-auto max-w-lg rounded-t-3xl p-7 space-y-5"
          style={{
            background: 'linear-gradient(to bottom, rgba(20,5,5,0.98), rgba(10,10,10,0.98))',
            border: '1.5px solid rgba(239,68,68,0.5)',
            borderBottom: 'none',
            boxShadow: '0 -20px 80px rgba(239,68,68,0.2)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">⚡</span>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 900,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.04em',
                }}
              >
                INCOMING CHALLENGE!
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {matchHomeTeam} vs {matchAwayTeam}
              </p>
            </div>
          </div>

          {/* Challenger card */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            {/* Avatar */}
            <div
              className="relative h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'var(--color-charcoal-700)',
                border: '2px solid var(--color-chiliz-red)',
                boxShadow: '0 0 16px var(--color-chiliz-red-glow)',
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
                {(challenger.username[0] ?? '?').toUpperCase()}
              </span>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2"
                style={{
                  background: '#22c55e',
                  borderColor: '#0a0a0a',
                  boxShadow: '0 0 8px rgba(34,197,94,0.8)',
                }}
              />
            </div>

            <div className="flex-1">
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                @{challenger.username}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                wants to duel you!
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Ranking
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--color-chiliz-red)',
                  textShadow: '0 0 16px var(--color-chiliz-red-glow)',
                }}
              >
                🏆 {challenger.points ? challenger.points.toLocaleString() : '—'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Rank {challenger.rank ?? 'Unranked'}
              </p>
            </div>
          </div>

          {/* Challenge summary */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--color-charcoal-600)',
            }}
          >
            <p className="text-xs uppercase tracking-widest text-[--color-text-tertiary]">
              The Prediction (proposed by rival)
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              &ldquo;{challengeText}&rdquo;
            </p>
            <div 
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
            >
              🛡️ <strong>If you accept:</strong> You win if this <strong>doesn&apos;t</strong> happen. 1 Life is lost <strong>ONLY</strong> if the prediction is correct.
            </div>
          </div>

          {/* Countdown bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Auto-decline in
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: secondsLeft <= 10 ? 'var(--color-chiliz-red)' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                }}
              >
                {secondsLeft}s
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: 'var(--color-charcoal-700)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: secondsLeft <= 10
                    ? 'var(--color-chiliz-red)'
                    : 'linear-gradient(to right, var(--color-cyan-500), var(--color-chiliz-red))',
                  boxShadow: '0 0 8px var(--color-chiliz-red-glow)',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onDecline}
              className="py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                letterSpacing: '0.1em',
                background: 'var(--color-charcoal-700)',
                color: 'var(--color-text-secondary)',
                border: '1.5px solid var(--color-charcoal-500)',
              }}
            >
              ✕ DECLINE
            </button>
            <button
              onClick={onAccept}
              className="py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                letterSpacing: '0.1em',
                background: 'var(--color-chiliz-red)',
                color: '#fff',
                boxShadow: '0 0 24px var(--color-chiliz-red-glow)',
              }}
            >
              ⚡ ACCEPT DUEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
