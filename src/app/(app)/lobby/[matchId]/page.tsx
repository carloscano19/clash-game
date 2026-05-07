'use client';

import { useState, useEffect, use } from 'react';
import { MatchBanner } from '@/components/game/MatchBanner';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import type { Match, MatchEvent } from '@/types/football';

const TOKEN = process.env['NEXT_PUBLIC_MOCK_TOKEN'] ?? 'dev-mock-token-local';

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷', FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', USA: '🇺🇸', BRA: '🇧🇷', POR: '🇵🇹',
};

const SSU_AMOUNTS = [10, 25, 50, 100, 250];
const FAN_AMOUNTS = [5, 10, 25, 50, 100];

interface LobbyPageProps {
  params: Promise<{ matchId: string }>;
}

export default function LobbyPage({ params }: LobbyPageProps) {
  const { matchId } = use(params);
  const [match, setMatch] = useState<Match | null>(null);
  const [recentEvents, setRecentEvents] = useState<MatchEvent[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Mock lives state
  const lives = 5;

  // Fetch match
  useEffect(() => {
    fetch(`/api/mock-football/matches/${matchId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data) => { if (data) setMatch(data.match as Match); })
      .catch(() => setNotFound(true));
  }, [matchId]);

  // SSE events
  useEffect(() => {
    if (!matchId) return;
    const es = new EventSource(`/api/mock-football/matches/${matchId}/stream?token=${TOKEN}`);
    es.onmessage = (ev) => {
      try {
        const event: MatchEvent = JSON.parse(ev.data as string);
        setMatch((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, currentMinute: event.minute };
          if (event.type === 'goal' || event.type === 'penalty_scored') {
            if (event.team === 'home') updated.score = { ...updated.score, home: updated.score.home + 1 };
            if (event.team === 'away') updated.score = { ...updated.score, away: updated.score.away + 1 };
          }
          return updated;
        });
        setRecentEvents((prev) => [event, ...prev].slice(0, 5));
      } catch { /* ignore */ }
    };
    return () => es.close();
  }, [matchId]);

  const handleEnterArena = async () => {
    if (lives <= 0) return;
    setIsMatching(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = `/arena/${matchId}?home=${match?.homeTeam.shortCode ?? 'HOME'}&away=${match?.awayTeam.shortCode ?? 'AWAY'}`;
  };

  const eventIcons: Record<string, string> = {
    goal: '⚽', yellow_card: '🟨', red_card: '🟥', corner: '⛳',
    shot_on_target: '🎯', substitution: '🔄', penalty_scored: '⚽',
    half_time: '⏸️', full_time: '🏁', kickoff: '▶️', second_half_start: '▶️',
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--color-charcoal-900)' }}>
        <span className="text-5xl">🏟️</span>
        <h1 className="text-[--color-text-secondary]" style={{ fontFamily: 'var(--font-body)', fontSize: '22px', fontWeight: 700 }}>Match not found</h1>
        <Button variant="secondary" onClick={() => window.location.href = '/'}>← Back to Home</Button>
      </div>
    );
  }

  const homeCode = match?.homeTeam.shortCode ?? '?';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-charcoal-900)' }}>
      {/* Match Banner with stadium bg */}
      <div className="relative">
        {/* Stadium BG behind banner */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('/stadium-bg.png')",
            filter: 'blur(2px) brightness(0.2)',
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, var(--color-charcoal-900) 100%)' }} />
        <div className="relative z-10">
          {match ? (
            <MatchBanner
              homeTeam={match.homeTeam.shortCode}
              awayTeam={match.awayTeam.shortCode}
              homeScore={match.score.home}
              awayScore={match.score.away}
              minute={Math.floor(match.currentMinute)}
              status={match.status}
              kickoffAt={match.kickoffAt}
            />
          ) : (
            <div className="h-60 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-[--color-cyan-500] border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Step indicator */}
        <StepIndicator currentStep={2} />

        {/* ── ENTER ARENA ── */}
        <div
          className="rounded-2xl p-6 space-y-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, var(--color-charcoal-800) 100%)',
            border: '1.5px solid var(--color-charcoal-600)',
            boxShadow: 'var(--elevation-2)',
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              ARENA ENTRY
            </h2>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Step 2 of 4
            </div>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className="h-20 w-20 flex items-center justify-center rounded-full mb-4"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '2px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 30px rgba(239,68,68,0.2)',
              }}
            >
              <span className="text-4xl animate-pulse">❤️</span>
            </div>
            <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>
              Cost to enter
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
              }}
            >
              1 LIFE
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              You have {lives} lives remaining today.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleEnterArena}
            disabled={lives <= 0 || isMatching}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              letterSpacing: '0.12em',
              background: lives > 0 && !isMatching
                ? 'var(--color-chiliz-red)'
                : 'var(--color-charcoal-700)',
              color: lives > 0 && !isMatching ? '#fff' : 'var(--color-text-tertiary)',
              boxShadow: lives > 0 && !isMatching ? '0 0 30px var(--color-chiliz-red-glow)' : 'none',
              cursor: lives > 0 && !isMatching ? 'pointer' : 'not-allowed',
            }}
          >
            {isMatching ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Entering...
              </span>
            ) : lives > 0 ? (
              '⚡ ENTER ARENA'
            ) : (
              'OUT OF LIVES — GET MORE'
            )}
          </button>
        </div>

        {/* Live Events Feed */}
        {recentEvents.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
              Live Match Events
            </h3>
            <div className="rounded-2xl border divide-y overflow-hidden" style={{ border: '1.5px solid var(--color-charcoal-600)', borderColor: 'var(--color-charcoal-600)', background: 'var(--color-charcoal-800)' }}>
              {recentEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span>{eventIcons[ev.type] ?? '•'}</span>
                  <span className="font-mono text-xs w-8 flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                    {Math.floor(ev.minute)}&apos;
                  </span>
                  <span className="capitalize" style={{ color: 'var(--color-text-secondary)' }}>{ev.type.replace(/_/g, ' ')}</span>
                  {ev.team && (
                    <span className={`ml-auto text-xs uppercase tracking-widest ${ev.team === 'home' ? 'text-[--color-cyan-500]' : 'text-[--color-text-tertiary]'}`}>
                      {ev.team === 'home' ? match?.homeTeam.shortCode : match?.awayTeam.shortCode}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {recentEvents.length === 0 && match?.status === 'scheduled' && (
          <div className="text-center py-8 rounded-2xl border" style={{ border: '1.5px solid var(--color-charcoal-600)', background: 'var(--color-charcoal-800)' }}>
            <span className="text-3xl block mb-2">⏱️</span>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Match hasn&apos;t started yet — events will stream in at kickoff.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
