/**
 * Lobby page — /lobby/[matchId]
 * Stub page — implemented in Phase 3 (Matchmaking).
 * See srs.md §4, design_system.md §5.1
 */

interface LobbyPageProps {
  params: Promise<{ matchId: string }>;
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const { matchId } = await params;

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
          LOBBY
        </h1>
        <p
          className="text-sm mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
        >
          Match: {matchId}
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Implemented in Phase 3 — Matchmaking
        </p>
      </div>
    </div>
  );
}
