/**
 * Typed Result type for server actions and domain operations.
 * We do NOT throw across server-action boundaries — we return discriminated unions.
 * See coding_standards.md §1.5
 */

export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export interface AppError {
  code: AppErrorCode;
  /** Safe for end users */
  message: string;
  /** Logged but never shipped to client */
  internalDetail?: unknown;
}

export type AppErrorCode =
  | 'unauthorized'
  | 'invalid_input'
  | 'not_found'
  | 'conflict'
  | 'insufficient_balance'
  | 'matchmaking_failed'
  | 'arbitrage_unavailable'
  | 'internal';
