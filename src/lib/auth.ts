import { createClient } from './supabase/server';
import { err, ok, type Result, type AppError } from './result';
import type { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['users']['Row'];

/**
 * Retrieves the currently authenticated user's ID.
 */
export async function getServerUserSession(): Promise<Result<string, AppError>> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return err({
      code: 'unauthorized',
      message: 'Not authenticated',
    });
  }

  return ok(user.id);
}

/**
 * Retrieves the currently authenticated user's profile data.
 */
export async function getServerUserProfile(): Promise<Result<UserProfile, AppError>> {
  const sessionResult = await getServerUserSession();
  if (!sessionResult.ok) {
    return sessionResult;
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionResult.value)
    .single();

  if (error || !profile) {
    return err({
      code: 'internal',
      message: 'User profile not found',
      internalDetail: error,
    });
  }

  return ok(profile);
}
