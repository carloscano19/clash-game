'use server';

import { getServerUserProfile, type UserProfile } from '@/lib/auth';
import type { Result, AppError } from '@/lib/result';

/**
 * Smoke test action to get the current user's profile.
 */
export async function getMyProfile(): Promise<Result<UserProfile, AppError>> {
  return getServerUserProfile();
}
