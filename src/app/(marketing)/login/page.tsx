'use client';

import { useState } from 'react';
import { signInWithMagicLink } from '@/features/auth/server/login';

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    setErrorMessage('');
    
    const result = await signInWithMagicLink(formData);
    
    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error.message);
      return;
    }

    setStatus('success');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-900 p-4">
      <div className="max-w-md w-full bg-charcoal-800 border border-charcoal-500 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold text-text-primary tracking-wide">
            WELCOME TO CHILIZ CLASH
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your email to sign in via Magic Link.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-charcoal-700 border border-cyan-500/30 rounded-lg p-6 text-center">
            <p className="text-text-primary">
              Magic link sent! Check your email to sign in.
            </p>
            <p className="text-sm text-text-secondary mt-2">
              (If you are running locally, check the Supabase Inbucket at http://localhost:54324/m/ )
            </p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-500 rounded-lg text-text-primary placeholder:text-charcoal-500 focus:outline-none focus:ring-1 focus:ring-chiliz-red focus:border-chiliz-red transition-colors"
                disabled={status === 'loading'}
              />
            </div>
            
            {status === 'error' && (
              <p className="text-warning text-sm font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-chiliz-red text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
