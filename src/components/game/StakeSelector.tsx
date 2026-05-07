'use client';

import { useState } from 'react';
import { StakeChip } from '@/components/ui/StakeChip';
import { Button } from '@/components/ui/Button';

interface StakeSelectorProps {
  userSsuBalance: number;
  onSelect: (amount: number, currency: string) => void;
  loading?: boolean;
}

const SSU_PRESETS = [10, 25, 50, 100, 250];
const TOKEN_PRESETS = [0.5, 1, 2, 5];

type Tab = 'SSU' | 'TOKEN';

export function StakeSelector({ userSsuBalance, onSelect, loading = false }: StakeSelectorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('SSU');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<string>('ARG');

  const presets = activeTab === 'SSU' ? SSU_PRESETS : TOKEN_PRESETS;
  const currency = activeTab === 'SSU' ? 'SSU' : selectedToken;

  const handleConfirm = () => {
    if (selectedAmount === null) return;
    onSelect(selectedAmount, currency);
  };

  return (
    <div className="w-full max-w-lg">
      <h2
        className="text-[--color-text-primary] mb-4"
        style={{ fontFamily: 'var(--font-body)', fontSize: '22px', fontWeight: 700 }}
      >
        Choose your stake
      </h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-[--radius-md] bg-[--color-charcoal-800] border border-[--color-charcoal-500] w-fit">
        {(['SSU', 'TOKEN'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedAmount(null); }}
            className={[
              'px-4 py-1.5 rounded-[--radius-sm] text-sm font-semibold transition-all',
              activeTab === tab
                ? 'bg-[--color-charcoal-600] text-[--color-text-primary]'
                : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary]',
            ].join(' ')}
          >
            {tab === 'SSU' ? '⟁ SSU' : '🏅 Fan Token'}
          </button>
        ))}
      </div>

      {/* Token picker (only for TOKEN tab) */}
      {activeTab === 'TOKEN' && (
        <div className="flex gap-2 mb-4">
          {['ARG', 'FRA', 'BRA', 'POR'].map((tok) => (
            <button
              key={tok}
              onClick={() => setSelectedToken(tok)}
              className={[
                'px-3 py-1 rounded-[--radius-sm] text-sm border transition-all',
                selectedToken === tok
                  ? 'border-[--color-cyan-500] text-[--color-cyan-500]'
                  : 'border-[--color-charcoal-500] text-[--color-text-secondary] hover:border-[--color-charcoal-400]',
              ].join(' ')}
            >
              ${tok}
            </button>
          ))}
        </div>
      )}

      {/* Amount presets */}
      <div className="flex flex-wrap gap-3 mb-2">
        {presets.map((amount) => {
          const insufficient = activeTab === 'SSU' && amount > userSsuBalance;
          return (
            <button
              key={amount}
              onClick={() => !insufficient && setSelectedAmount(amount)}
              disabled={insufficient}
              className={[
                'transition-all duration-[--dur-fast] rounded-[--radius-md]',
                insufficient ? 'opacity-30 cursor-not-allowed' : '',
                selectedAmount === amount
                  ? 'ring-2 ring-[--color-chiliz-red] scale-105'
                  : 'hover:scale-105',
              ].join(' ')}
            >
              <StakeChip amount={amount} currency={currency} size="lg" />
            </button>
          );
        })}
      </div>

      {activeTab === 'SSU' && (
        <p className="text-[--color-text-tertiary] text-xs mb-5">
          Your balance: <span className="font-mono text-[--color-text-secondary]">⟁ {userSsuBalance} SSU</span>
        </p>
      )}

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        className="w-full mt-4 uppercase tracking-widest"
        disabled={selectedAmount === null}
        loading={loading}
        onClick={handleConfirm}
      >
        ⚡ FIND OPPONENT
        {selectedAmount !== null && (
          <span className="ml-2 opacity-70 text-sm normal-case">
            · {selectedAmount} {currency}
          </span>
        )}
      </Button>
    </div>
  );
}
