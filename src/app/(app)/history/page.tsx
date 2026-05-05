/**
 * History page — /history
 * Stub page — wired in Phase 1 smoke test.
 * See srs.md, design_system.md §2.3
 */

export default function HistoryPage() {
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
          HISTORY
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Your duel history will appear here.
          <br />
          Sign in to view your record.
        </p>
      </div>
    </div>
  );
}
