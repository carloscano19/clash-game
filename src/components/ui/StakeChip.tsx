type StakeChipSize = 'sm' | 'md' | 'lg';
type StakeChipCurrency = 'SSU' | 'ARG' | 'FRA' | 'BRA' | 'POR' | 'ENG' | string;

interface StakeChipProps {
  amount: number | string;
  currency: StakeChipCurrency;
  size?: StakeChipSize;
}

const sizeClasses: Record<StakeChipSize, string> = {
  sm: 'h-6 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-11 px-4 text-base gap-2',
};

const fanTokenColors: Record<string, string> = {
  ARG: '#74ACDF',
  FRA: '#002395',
  BRA: '#009C3B',
  POR: '#006600',
  ENG: '#FFFFFF',
};

export function StakeChip({ amount, currency, size = 'md' }: StakeChipProps) {
  const isSSU = currency === 'SSU';
  const accentColor = isSSU ? 'var(--color-text-primary)' : (fanTokenColors[currency] ?? 'var(--color-cyan-500)');

  return (
    <span
      className={[
        'inline-flex items-center font-mono font-medium rounded-[--radius-pill]',
        'bg-[--color-charcoal-700] border border-[--color-charcoal-500]',
        sizeClasses[size],
      ].join(' ')}
      style={{ borderBottomColor: accentColor }}
    >
      <span style={{ color: accentColor }}>{isSSU ? '⟁' : '$'}</span>
      <span className="text-[--color-text-primary] tabular-nums">{amount}</span>
      <span className="text-[--color-text-secondary]">{currency}</span>
    </span>
  );
}
