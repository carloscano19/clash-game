/**
 * ChallengeSelector — preset challenge card grid for the Duel page.
 * Lets the user select a pre-defined prediction or write a custom one.
 * Design System: §5.3 Challenge Cards
 */
'use client';
import { useState } from 'react';

export interface Challenge {
  id: string;
  icon: string;
  text: string;
  category: 'goal' | 'card' | 'corner' | 'match' | 'custom';
}

interface ChallengeSelectorProps {
  homeTeam: string;
  awayTeam: string;
  onSelect: (challenge: Challenge) => void;
}

export function ChallengeSelector({ homeTeam, awayTeam, onSelect }: ChallengeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const presets: Challenge[] = [
    {
      id: 'goal_home_10',
      icon: '⚽',
      text: `${homeTeam} scores in the next 10 min`,
      category: 'goal',
    },
    {
      id: 'goal_away_10',
      icon: '⚽',
      text: `${awayTeam} scores in the next 10 min`,
      category: 'goal',
    },
    {
      id: 'yellow_5',
      icon: '🟨',
      text: 'Yellow card in the next 5 min',
      category: 'card',
    },
    {
      id: 'corner_5',
      icon: '⛳',
      text: 'Corner kick in the next 5 min',
      category: 'corner',
    },
    {
      id: 'home_wins',
      icon: '🏆',
      text: `${homeTeam} wins the match`,
      category: 'match',
    },
    {
      id: 'both_score',
      icon: '🔥',
      text: 'Both teams score before FT',
      category: 'match',
    },
  ];

  const handleSelect = (challenge: Challenge) => {
    setSelected(challenge.id);
    setShowCustom(false);
    onSelect(challenge);
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) return;
    const custom: Challenge = {
      id: 'custom',
      icon: '✏️',
      text: customText.trim(),
      category: 'custom',
    };
    setSelected('custom');
    onSelect(custom);
  };

  return (
    <div className="space-y-4">
      <div 
        className="flex flex-col mb-4 p-4 rounded-xl border border-chiliz-red/20"
        style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.1) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎯</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            YOU ARE THE PREDICTOR
          </h2>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-chiliz-red)' }}>
          Choose an event you believe WILL happen.
        </p>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-chiliz-red/10 border border-chiliz-red/30">
          <span className="text-sm">❤️</span>
          <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            1 LIFE AT STAKE: <span className="text-chiliz-red">LOST ONLY IF YOU FAIL.</span>
          </p>
        </div>
        <span className="text-[10px] text-[--color-text-tertiary] uppercase tracking-widest mt-2">
          If it happens: YOU WIN POINTS. If it doesn&apos;t: RIVAL WINS.
        </span>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-3">
        {presets.map((challenge, i) => {
          const isSelected = selected === challenge.id;
          return (
            <button
              key={challenge.id}
              onClick={() => handleSelect(challenge)}
              className="relative text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                animationDelay: `${i * 60}ms`,
                background: isSelected
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'var(--color-charcoal-800)',
                border: isSelected
                  ? '1.5px solid var(--color-chiliz-red)'
                  : '1.5px solid var(--color-charcoal-500)',
                boxShadow: isSelected
                  ? '0 0 20px var(--color-chiliz-red-glow), inset 0 0 20px rgba(239,68,68,0.05)'
                  : 'none',
              }}
            >
              {isSelected && (
                <span
                  className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--color-chiliz-red)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                  }}
                >
                  SELECTED
                </span>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{challenge.icon}</span>
                {isSelected && (
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded border border-white/20 animate-pulse"
                    style={{
                      background: 'var(--color-chiliz-red)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    MY PREDICTION
                  </span>
                )}
              </div>
              <p
                className="text-sm leading-snug font-bold"
                style={{
                  color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {challenge.text}
              </p>
              <div className="mt-3 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-tighter opacity-50">
                  {isSelected ? "Predicting this HAPPENS" : "Predict this event"}
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom challenge card */}
        <button
          onClick={() => { setShowCustom(true); setSelected(null); }}
          className="text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] col-span-2"
          style={{
            background: showCustom ? 'rgba(6, 182, 212, 0.08)' : 'var(--color-charcoal-800)',
            border: showCustom
              ? '1.5px solid var(--color-cyan-500)'
              : '1.5px dashed var(--color-charcoal-500)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--color-cyan-500)', fontFamily: 'var(--font-body)' }}
              >
                Custom Challenge
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Write your own prediction
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Custom text input */}
      {showCustom && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`e.g. "${homeTeam} gets a red card"`}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--color-charcoal-800)',
              border: '1.5px solid var(--color-cyan-500)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <button
            onClick={handleCustomSubmit}
            className="px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: customText.trim() ? 'var(--color-cyan-500)' : 'var(--color-charcoal-700)',
              color: customText.trim() ? '#000' : 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            SET
          </button>
        </div>
      )}
    </div>
  );
}
