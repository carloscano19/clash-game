/**
 * Login page — /login (marketing route group)
 * Stub — implemented in Phase 1 (Auth).
 * See srs.md §10, ag_instructions.md §1.5
 */

export default function LoginPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4"
      style={{ backgroundColor: 'var(--color-charcoal-900)' }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-xl"
        style={{
          backgroundColor: 'var(--color-charcoal-800)',
          border: '1px solid var(--color-charcoal-500)',
        }}
      >
        <h1
          className="text-[28px] font-bold mb-2 text-center"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
          }}
        >
          SIGN IN
        </h1>

        <p
          className="text-center mb-8"
          style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}
        >
          Enter the arena.
        </p>

        {/* Placeholder form — wired in Phase 1 */}
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--color-charcoal-700)',
            color: 'var(--color-text-tertiary)',
            fontSize: '13px',
          }}
        >
          Auth flow implemented in Phase 1
        </div>
      </div>
    </div>
  );
}
