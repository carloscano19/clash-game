'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GatePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo password: clash2026
    if (password === 'clash2026') {
      document.cookie = 'clash_access=granted; path=/; max-age=86400';
      window.location.href = '/';
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'var(--color-chiliz-red)' }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-charcoal-800 border border-charcoal-600 mb-4 shadow-2xl">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 
            className="text-white text-3xl font-black tracking-tighter mb-2"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
          >
            SOCIOS CLASH
          </h1>
          <p className="text-charcoal-400 text-sm uppercase tracking-widest font-bold">
            Private MVP Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Code"
              className={`w-full bg-charcoal-800 border-2 rounded-xl py-4 px-5 text-white text-center font-bold tracking-[0.3em] transition-all duration-300 outline-none ${
                error ? 'border-chiliz-red animate-shake' : 'border-charcoal-600 focus:border-chiliz-red'
              }`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-chiliz-red text-[10px] uppercase font-bold tracking-widest">
                Incorrect access code
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-chiliz-red text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Enter Arena
          </button>
        </form>

        <p className="text-charcoal-500 text-[9px] text-center mt-12 uppercase tracking-[0.3em]">
          World Cup 2026 Prototype
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
