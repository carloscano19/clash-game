/**
 * StepIndicator — shows current step in the Chiliz Clash flow.
 * Used across Lobby and Duel pages to orient the user.
 */

const STEPS = [
  { id: 1, label: 'Watch Match' },
  { id: 2, label: 'Enter Arena' },
  { id: 3, label: 'Find Rival' },
  { id: 4, label: 'Result' },
];

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 w-full max-w-md mx-auto">
      {STEPS.map((step, i) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: isDone
                    ? 'var(--color-chiliz-red)'
                    : isActive
                    ? 'var(--color-chiliz-red)'
                    : 'var(--color-charcoal-700)',
                  border: isActive
                    ? '2px solid var(--color-chiliz-red)'
                    : isDone
                    ? '2px solid var(--color-chiliz-red)'
                    : '2px solid var(--color-charcoal-500)',
                  color: isDone || isActive ? '#fff' : 'var(--color-text-tertiary)',
                  boxShadow: isActive ? '0 0 12px var(--color-chiliz-red-glow)' : 'none',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isDone ? '✓' : step.id}
              </div>
              <span
                className="mt-1 text-[10px] whitespace-nowrap hidden sm:block"
                style={{
                  color: isActive
                    ? 'var(--color-text-primary)'
                    : isDone
                    ? 'var(--color-chiliz-red)'
                    : 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-1 transition-all duration-500"
                style={{
                  background: step.id < currentStep
                    ? 'var(--color-chiliz-red)'
                    : 'var(--color-charcoal-500)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
