'use client';

import { PresenceDot } from '@/components/ui/PresenceDot';
import { StakeChip } from '@/components/ui/StakeChip';
import { Button } from '@/components/ui/Button';

type DuelStatus =
  | 'pending_proposal'
  | 'pending_acceptance'
  | 'active'
  | 'arbitrating'
  | 'a_wins'
  | 'b_wins'
  | 'voided';

interface Player {
  id: string;
  username: string;
  avatarUrl?: string;
  points?: number;
  rank?: string;
  isOnline: boolean;
  isCurrentUser: boolean;
}

interface FaceOffCardProps {
  status: DuelStatus;
  playerA: Player;
  playerB?: Player;
  challengeText?: string;
  minute?: number;
  score?: { home: number; away: number };
  homeShortCode?: string;
  awayShortCode?: string;
  onPropose?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onClaim?: () => void;
}

function PlayerSlot({ player, side }: { player: Player; side: 'A' | 'B' }) {
  const initial = player.username[0]?.toUpperCase() ?? '?';
  return (
    <div className={`flex flex-col items-center gap-3 ${side === 'B' ? 'md:items-end text-right' : 'md:items-start text-left'}`}>
      {/* Role Badge */}
      <div 
        className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest mb-1"
        style={{
          background: side === 'A' ? 'var(--color-chiliz-red)' : 'var(--color-charcoal-700)',
          color: side === 'A' ? '#fff' : 'var(--color-text-secondary)',
          border: side === 'B' ? '1px solid var(--color-charcoal-500)' : 'none',
        }}
      >
        {side === 'A' ? '🎯 Predictor' : '🛡️ Counter-Bet'}
      </div>
      {/* Avatar */}
      <div
        className="relative h-24 w-24 md:h-32 md:w-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-[--color-charcoal-500]"
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-charcoal-600), var(--color-charcoal-900))',
          borderColor: player.isCurrentUser ? 'var(--color-cyan-500)' : undefined,
        }}
      >
        {player.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.avatarUrl} alt={player.username} className="h-full w-full object-cover" />
        ) : (
          <span
            className="text-[--color-text-primary]"
            style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 700 }}
          >
            {initial}
          </span>
        )}
        {player.isCurrentUser && (
          <div className="absolute inset-0 rounded-full border border-[--color-cyan-500] opacity-60" style={{ boxShadow: '0 0 12px var(--color-cyan-glow)' }} />
        )}
      </div>

      {/* Username */}
      <div className="flex items-center gap-2">
        <PresenceDot state={player.isOnline ? 'online' : 'offline'} />
        <span
          className="text-[--color-text-primary]"
          style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}
        >
          @{player.username}
          {player.isCurrentUser && (
            <span className="ml-1 text-xs text-[--color-cyan-500]">(you)</span>
          )}
        </span>
      </div>

      {/* Points */}
      <div className="flex flex-col items-center">
        <span
          className="text-[--color-text-primary]"
          style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800 }}
        >
          🏆 {player.points ? player.points.toLocaleString() : '—'}
        </span>
        <span className="text-xs text-[--color-text-tertiary]">
          {player.rank ? `Rank ${player.rank}` : 'Unranked'}
        </span>
      </div>
    </div>
  );
}

function VsGlyph({ status }: { status: DuelStatus }) {
  if (status === 'arbitrating') {
    return (
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-[--color-cyan-500]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '40px',
            fontWeight: 700,
            textShadow: '0 0 20px var(--color-cyan-glow)',
          }}
        >
          🤖
        </span>
        <span className="text-xs text-[--color-cyan-500] uppercase tracking-widest animate-pulse">Resolving</span>
      </div>
    );
  }

  if (status === 'a_wins' || status === 'b_wins') {
    return (
      <span
        className="text-[--color-gold-500]"
        style={{ fontSize: '48px', textShadow: '0 0 20px var(--color-gold-glow)' }}
      >
        🏆
      </span>
    );
  }

  if (status === 'voided') {
    return (
      <span className="text-[--color-text-tertiary] text-4xl">✕</span>
    );
  }

  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '56px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--color-chiliz-red)',
        animation: 'vsFloat 6s ease-in-out infinite',
        textShadow: '0 0 32px var(--color-chiliz-red-glow), 0 0 8px var(--color-chiliz-red-glow)',
      }}
    >
      VS
    </span>
  );
}

export function FaceOffCard({
  status,
  playerA,
  playerB,
  challengeText,
  minute,
  score,
  homeShortCode,
  awayShortCode,
  onPropose,
  onAccept,
  onDecline,
}: FaceOffCardProps) {
  const isCurrentUserA = playerA.isCurrentUser;

  return (
    <div
      className="relative w-full rounded-[--radius-xl] overflow-hidden border border-[--color-charcoal-500]"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, var(--color-charcoal-700) 0%, var(--color-charcoal-900) 70%)',
        boxShadow:
          status === 'arbitrating'
            ? 'var(--glow-cyan)'
            : status === 'a_wins' || status === 'b_wins'
            ? 'var(--glow-gold)'
            : 'var(--elevation-3)',
      }}
    >
      {/* Top scrim — match info */}
      {(minute !== undefined || score) && (
        <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-[--color-charcoal-500] bg-black bg-opacity-30">
          {score && (
            <span
              className="tabular-nums text-[--color-text-primary]"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}
            >
              {homeShortCode} {score.home} — {score.away} {awayShortCode}
            </span>
          )}
          {minute !== undefined && (
            <span
              className="text-[--color-cyan-500]"
              style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}
            >
              {minute}&apos;
            </span>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-6 p-8 md:p-10">
        {/* Player A */}
        <PlayerSlot player={playerA} side="A" />

        {/* VS */}
        <div className="flex flex-col items-center gap-3">
          <VsGlyph status={status} />
          {status === 'voided' && (
            <span className="text-xs text-[--color-text-tertiary] uppercase tracking-widest">Voided</span>
          )}
        </div>

        {/* Player B */}
        {playerB ? (
          <PlayerSlot player={playerB} side="B" />
        ) : (
          <div className="flex flex-col items-center gap-3 w-32">
            <div
              className="h-24 w-24 md:h-32 md:w-32 rounded-full border-2 border-dashed border-[--color-charcoal-500] flex items-center justify-center"
            >
              <span className="text-[--color-text-tertiary] text-3xl animate-pulse">?</span>
            </div>
            <span className="text-[--color-text-tertiary] text-sm">Searching...</span>
          </div>
        )}
      </div>

      {/* Bottom scrim — challenge + CTA */}
      <div
        className="relative z-10 px-6 py-4 border-t border-[--color-charcoal-500] bg-black bg-opacity-40"
      >
        {challengeText && (
          <p className="text-[--color-text-secondary] text-sm mb-3 text-center italic">
            &ldquo;{challengeText}&rdquo;
          </p>
        )}

        {/* CTAs per status */}
        <div className="flex gap-3 justify-center">
          {status === 'pending_proposal' && isCurrentUserA && onPropose && (
            <Button variant="primary" size="lg" onClick={onPropose} className="uppercase tracking-widest">
              Propose Challenge
            </Button>
          )}
          {status === 'pending_proposal' && !isCurrentUserA && (
            <Button variant="secondary" size="lg" disabled>
              ⏳ Waiting for proposal…
            </Button>
          )}
          {status === 'pending_acceptance' && !isCurrentUserA && (
            <>
              <Button variant="primary" size="lg" onClick={onAccept} className="uppercase tracking-widest">
                Accept Duel
              </Button>
              <Button variant="destructive" size="lg" onClick={onDecline} className="uppercase tracking-widest">
                Decline
              </Button>
            </>
          )}
          {status === 'pending_acceptance' && isCurrentUserA && (
            <Button variant="secondary" size="lg" disabled>
              Awaiting opponent…
            </Button>
          )}
          {status === 'active' && (
            <span className="text-[--color-success] text-sm font-semibold uppercase tracking-widest animate-pulse">
              ● Duel Active
            </span>
          )}
          {status === 'arbitrating' && (
            <Button variant="ghost" size="lg" loading disabled>
              Resolving…
            </Button>
          )}
          {status === 'voided' && (
            <Button variant="secondary" size="lg" onClick={() => window.history.back()}>
              Refunded — Find another duel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
