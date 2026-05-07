'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { err, ok, type Result, type AppError } from '@/lib/result';

const SignInInput = z.object({
  email: z.string().email(),
});

/**
 * Server action to initiate a magic link sign-in.
 */
export async function signInWithMagicLink(
  formData: FormData
): Promise<Result<void, AppError>> {
  const email = formData.get('email');

  const parsed = SignInInput.safeParse({ email });
  if (!parsed.success) {
    return err({
      code: 'invalid_input',
      message: 'Please provide a valid email address.',
    });
  }

  const supabase = await createClient();

  // In Next.js App Router, we construct the redirect URL dynamically 
  // or use an environment variable depending on deployment.
  const origin = process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000';

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return err({
      code: 'internal',
      message: 'Failed to send login link. Please try again.',
      internalDetail: error,
    });
  }

  return ok(undefined);
}
