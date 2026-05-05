/**
 * Duel page — /duel/[duelId]
 * Stub page — implemented in Phase 4 (Duel State Machine).
 * See srs.md §5, design_system.md §4.5
 */

interface DuelPageProps {
  params: Promise<{ duelId: string }>;
}

export default async function DuelPage({ params }: DuelPageProps) {
  const { duelId } = await params;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4"
      style={{ backgroundColor: 'var(--color-charcoal-900)' }}
    >
      <div
        className="text-center p-8 rounded-xl max-w-sm w-full"
        style={{
          backgroundColor: 'var(--color-charcoal-800)',
          border: '1px solid var(--color-charcoal-500)',
        }}
      >
        <h1
          className="text-[32px] font-semibold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          FACE-OFF
        </h1>
        <p
          className="text-sm mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
        >
          Duel: {duelId}
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Implemented in Phase 4 — Duel State Machine
        </p>
      </div>
    </div>
  );
}
