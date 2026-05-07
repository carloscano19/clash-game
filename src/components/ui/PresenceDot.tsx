type PresenceState = 'online' | 'connecting' | 'offline' | 'disconnected';

interface PresenceDotProps {
  state: PresenceState;
  showLabel?: boolean;
}

const stateConfig: Record<PresenceState, { color: string; pulse: boolean; label: string }> = {
  online:       { color: 'var(--color-success)',     pulse: true,  label: 'Online' },
  connecting:   { color: 'var(--color-cyan-500)',    pulse: true,  label: 'Connecting...' },
  offline:      { color: 'var(--color-text-tertiary)', pulse: false, label: 'Offline' },
  disconnected: { color: 'var(--color-warning)',     pulse: false, label: 'Disconnected' },
};

export function PresenceDot({ state, showLabel = false }: PresenceDotProps) {
  const config = stateConfig[state];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: config.color }}
      >
        {config.pulse && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: config.color }}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-xs text-[--color-text-secondary]">{config.label}</span>
      )}
    </span>
  );
}
