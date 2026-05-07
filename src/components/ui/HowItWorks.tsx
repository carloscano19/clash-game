/**
 * HowItWorks — 4-step process explainer for the home page.
 * Visual horizontal flow showing the full Chiliz Clash user journey.
 */

const steps = [
  {
    number: '01',
    icon: '📺',
    title: 'Watch Live',
    description: 'Pick a live World Cup match streaming in real-time.',
    color: 'var(--color-cyan-500)',
  },
  {
    number: '02',
    icon: '❤️',
    title: 'Enter Arena',
    description: 'Risk 1 Life per challenge. Out of lives? Refill instantly with $CHZ or Fan Tokens.',
    color: 'var(--color-chiliz-red)',
  },
  {
    number: '03',
    icon: '⚡',
    title: 'Pick a Challenge',
    description: 'Predict the next match event (e.g., Goal, Corner). Win to keep your life!',
    color: '#f59e0b',
  },
  {
    number: '04',
    icon: '🏆',
    title: 'Win Rewards',
    description: 'Earn +100 pts per correct guess. Top the leaderboard to win real VIP prizes!',
    color: '#22c55e',
  },
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      <p
        className="text-center text-xs uppercase tracking-[0.25em] mb-8"
        style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}
      >
        How It Works
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex flex-col items-center text-center group">
            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className="hidden md:block absolute top-10 left-[calc(50%+2rem)] right-[-50%] h-px"
                style={{ background: 'linear-gradient(to right, var(--color-charcoal-500), transparent)' }}
              />
            )}

            {/* Icon bubble */}
            <div
              className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{
                background: 'var(--color-charcoal-800)',
                border: `2px solid ${step.color}`,
                boxShadow: `0 0 20px ${step.color}33`,
              }}
            >
              <span className="text-3xl">{step.icon}</span>
              {/* Step number badge */}
              <span
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  background: step.color,
                  color: '#000',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {step.number.slice(1)}
              </span>
            </div>

            <h3
              className="mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              {step.title}
            </h3>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-tertiary)', maxWidth: '160px' }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
