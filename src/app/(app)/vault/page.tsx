'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function VaultPage() {
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [isStaking, setIsStaking] = useState(false);
  const tokenBalance = 120; // Simulated wallet balance

  // Calculate regen time based on staked amount
  // Base: 60 mins. Staking 100 ARG reduces it to 15 mins.
  // Formula: 60 - (amount * 0.45), min 15.
  const regenMinutes = Math.max(15, Math.floor(60 - (stakedAmount * 0.45)));

  const handleStake = async () => {
    if (stakedAmount <= 0) return;
    setIsStaking(true);
    // Simulate transaction delay
    await new Promise(r => setTimeout(r, 2000));
    setIsStaking(false);
    alert(`Successfully staked ${stakedAmount} $ARG! Your life regeneration rate is now 1 per ${regenMinutes} mins.`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: 'var(--color-charcoal-900)' }}>
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block p-4 rounded-full mb-4" style={{ background: 'rgba(34,197,94,0.1)', boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}>
            <span className="text-4xl">🏦</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--color-text-primary)' }}>
            CLASH VAULT
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Stake your Fan Tokens to accelerate Life Regeneration and gain VIP perks.
          </p>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--color-charcoal-800)', border: '1px solid var(--color-charcoal-600)' }}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs uppercase tracking-widest text-[--color-text-tertiary]">Available Balance</span>
            <span className="font-mono text-green-400">{tokenBalance} $ARG</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-[--color-text-primary]">Stake Amount</label>
                <span className="text-lg font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  {stakedAmount} $ARG
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={tokenBalance} 
                step="10"
                value={stakedAmount}
                onChange={(e) => setStakedAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'var(--color-charcoal-600)', accentColor: '#22c55e' }}
              />
            </div>

            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div>
                <p className="text-xs uppercase tracking-widest text-green-500 mb-1">Life Regen Rate</p>
                <p className="text-xl font-black text-[--color-text-primary]" style={{ fontFamily: 'var(--font-display)' }}>
                  1 ❤️ / {regenMinutes}m
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-[--color-text-tertiary] mb-1">Base Rate</p>
                <p className="text-sm line-through text-[--color-text-tertiary] font-mono">1 ❤️ / 60m</p>
              </div>
            </div>

            <Button 
              onClick={handleStake}
              disabled={stakedAmount <= 0 || isStaking}
              className="w-full py-4 text-lg"
              style={{
                background: stakedAmount > 0 ? '#22c55e' : 'var(--color-charcoal-700)',
                color: stakedAmount > 0 ? '#000' : 'var(--color-text-tertiary)',
                boxShadow: stakedAmount > 0 && !isStaking ? '0 0 20px rgba(34,197,94,0.4)' : 'none',
              }}
            >
              {isStaking ? 'STAKING...' : 'LOCK & STAKE'}
            </Button>
          </div>
        </div>

        {/* Protocol Stats */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: 'var(--color-charcoal-800)', border: '1px solid var(--color-charcoal-600)' }}>
             <p className="text-[10px] uppercase tracking-widest text-[--color-text-tertiary] mb-1">Total Value Locked</p>
             <p className="font-mono text-sm text-[--color-text-primary]">42,500 $ARG</p>
          </div>
          <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: 'var(--color-charcoal-800)', border: '1px solid var(--color-charcoal-600)' }}>
             <p className="text-[10px] uppercase tracking-widest text-[--color-text-tertiary] mb-1">Global Boosts</p>
             <p className="font-mono text-sm text-[--color-text-primary]">1,204 Active</p>
          </div>
        </div>

      </div>
    </div>
  );
}
