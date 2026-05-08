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

  // Mock states
  const lives = 5;
  const tokenBalance = 120; // Simulated $ARG balance

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

  const handleEnterArena = async (isVip: boolean = false) => {
    if (lives <= 0) return;
    if (isVip && tokenBalance < 50) return;
    setIsMatching(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = `/arena/${matchId}?home=${match?.homeTeam.shortCode ?? 'HOME'}&away=${match?.awayTeam.shortCode ?? 'AWAY'}${isVip ? '&vip=true' : ''}`;
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

        {/* ── ENTER ARENA (DUAL MODE) ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              CHOOSE ARENA
            </h2>
            <div className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-charcoal-700)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              💰 {tokenBalance} $ARG
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PUBLIC ARENA */}
            <div
              className="rounded-2xl p-6 flex flex-col text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.05) 0%, var(--color-charcoal-800) 100%)',
                border: '1px solid var(--color-charcoal-600)',
              }}
            >
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>PUBLIC ARENA</h3>
              <p className="text-xs mb-6" style={{ color: 'var(--color-text-tertiary)' }}>Standard Rewards (1x)</p>
              
              <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="text-3xl mb-2">❤️</div>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Entry Cost</p>
                <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>1 LIFE</p>
              </div>

              <button
                onClick={() => handleEnterArena(false)}
                disabled={lives <= 0 || isMatching}
                className="w-full mt-4 py-3 rounded-xl font-bold uppercase tracking-widest transition-colors"
                style={{
                  background: 'var(--color-charcoal-700)',
                  color: lives > 0 ? '#fff' : 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                }}
              >
                ENTER PUBLIC
              </button>
            </div>

            {/* VIP ARENA */}
            <div
              className="rounded-2xl p-6 flex flex-col text-center relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(15,15,15,0.95) 100%)',
                border: '1.5px solid rgba(245,158,11,0.4)',
                boxShadow: '0 0 40px rgba(245,158,11,0.1)',
              }}
            >
              <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)' }}>
                PREMIUM
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#f59e0b', textShadow: '0 0 10px rgba(245,158,11,0.3)' }}>VIP FAN ARENA</h3>
              <p className="text-xs mb-6" style={{ color: 'var(--color-text-secondary)' }}>Earn <strong className="text-amber-400">5x Points</strong> + Exclusive Rewards</p>
              
              <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">❤️</span>
                  <span className="text-xl" style={{ color: 'var(--color-charcoal-500)' }}>+</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-black text-black">
                    ARG
                  </div>
                </div>
                <p className="text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Entry Requirement</p>
                <p className="text-lg font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>1 LIFE & HOLD 50 $ARG</p>
              </div>

              <button
                onClick={() => handleEnterArena(true)}
                disabled={lives <= 0 || tokenBalance < 50 || isMatching}
                className="w-full mt-4 py-3 rounded-xl font-bold uppercase tracking-widest transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  color: '#000',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  boxShadow: '0 0 20px rgba(245,158,11,0.4)',
                }}
              >
                {isMatching ? 'ENTERING...' : '⚡ ENTER VIP ARENA'}
              </button>
            </div>
          </div>
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
