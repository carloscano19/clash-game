'use client';

import { Button } from '@/components/ui/Button';

const LEADERBOARD_DATA = [
  { rank: 1, username: 'mbappé_2026', points: 3100, lives: 2, trend: 'up' },
  { rank: 2, username: 'messi_fan_99', points: 2150, lives: 3, trend: 'same' },
  { rank: 3, username: 'zizou_legend', points: 1840, lives: 5, trend: 'down' },
  { rank: 4, username: 'tango_dreams', points: 1500, lives: 4, trend: 'up' },
  { rank: 5, username: 'carlos_fan', points: 1250, lives: 5, trend: 'up', isUser: true },
  { rank: 6, username: 'wc_gambler', points: 920, lives: 1, trend: 'down' },
  { rank: 7, username: 'fanatic_ronaldo', points: 850, lives: 0, trend: 'same' },
  { rank: 8, username: 'neymar_jr_10', points: 720, lives: 2, trend: 'up' },
];

const REWARDS = [
  { title: 'Daily Winner', prize: '500 CHZ + 50 ARG Token', description: 'Awarded to the player with the most points every 24h.' },
  { title: 'Weekly Champion', prize: 'VIP Match Ticket + 2000 CHZ', description: 'Awarded to the top player of the week.' },
  { title: 'Tournament Legend', prize: 'Exclusive NFT + 10,000 CHZ', description: 'The ultimate prize for the tournament winner.' },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--color-charcoal-900)' }}>
      {/* Stadium Background Blur */}
      <div
        className="fixed inset-0 bg-center bg-cover pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/stadium-bg.png')",
          filter: 'blur(20px)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '48px',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
            }}
          >
            GLOBAL RANKINGS
          </h1>
          <p className="text-[--color-text-tertiary] text-lg max-w-xl mx-auto">
            Compete with fans worldwide, climb the ladder, and claim exclusive World Cup rewards.
          </p>
        </div>

        {/* Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REWARDS.map((reward) => (
            <div
              key={reward.title}
              className="p-6 rounded-2xl border text-center space-y-3 transition-transform hover:scale-105"
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                borderColor: 'rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-3xl">🎁</div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-[--color-text-primary]">
                {reward.title}
              </h3>
              <p className="text-xl font-black text-[--color-chiliz-red]" style={{ fontFamily: 'var(--font-display)' }}>
                {reward.prize}
              </p>
              <p className="text-xs text-[--color-text-tertiary] leading-relaxed">
                {reward.description}
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            background: 'rgba(15, 15, 15, 0.8)',
            borderColor: 'var(--color-charcoal-600)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-[--color-text-tertiary]">Rank</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-[--color-text-tertiary]">Player</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-[--color-text-tertiary]">Points</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-[--color-text-tertiary] text-center">Lives</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-[--color-text-tertiary] text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-charcoal-700]">
              {LEADERBOARD_DATA.map((row) => (
                <tr
                  key={row.username}
                  className={`transition-colors hover:bg-white/[0.02] ${row.isUser ? 'bg-[--color-chiliz-red]/10' : ''}`}
                >
                  <td className="px-6 py-5">
                    <span
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        row.rank === 1 ? 'bg-amber-400 text-black' :
                        row.rank === 2 ? 'bg-slate-300 text-black' :
                        row.rank === 3 ? 'bg-orange-400 text-black' :
                        'bg-[--color-charcoal-700] text-[--color-text-secondary]'
                      }`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[--color-charcoal-700] border border-[--color-charcoal-500] flex items-center justify-center font-bold text-[--color-text-primary]">
                        {row.username[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-[--color-text-primary]">@{row.username}</span>
                      {row.isUser && (
                        <span className="text-[10px] bg-[--color-cyan-500]/20 text-[--color-cyan-500] px-2 py-0.5 rounded-full font-bold">YOU</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-black text-lg text-[--color-text-primary]" style={{ fontFamily: 'var(--font-display)' }}>
                      🏆 {row.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-bold text-[--color-chiliz-red]" style={{ fontFamily: 'var(--font-display)' }}>
                      ❤️ {row.lives}/5
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={row.trend === 'up' ? 'text-green-500' : row.trend === 'down' ? 'text-red-500' : 'text-slate-500'}>
                      {row.trend === 'up' ? '▲' : row.trend === 'down' ? '▼' : '▬'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center pt-6">
          <Button
            size="lg"
            className="px-12 py-6 rounded-2xl font-black text-xl tracking-widest uppercase hover:scale-105 transition-transform"
            style={{
              background: 'var(--color-chiliz-red)',
              boxShadow: '0 0 40px var(--color-chiliz-red-glow)',
            }}
            onClick={() => window.location.href = '/'}
          >
            Play More & Rank Up
          </Button>
        </div>
      </div>
    </div>
  );
}
