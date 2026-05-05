/**
 * Smoke tests for the Result type utility.
 * Verifies the discriminated union works correctly.
 * See coding_standards.md §1.5
 */

import { describe, expect, it } from 'vitest';
import { err, ok } from '@/lib/result';
import type { AppError } from '@/lib/result';

describe('Result utilities', () => {
  describe('ok()', () => {
    it('creates a successful result with the given value', () => {
      const result = ok('hello');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello');
      }
    });

    it('works with numeric values', () => {
      const result = ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('works with object values', () => {
      const payload = { id: 'abc', name: 'Test' };
      const result = ok(payload);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(payload);
      }
    });
  });

  describe('err()', () => {
    it('creates a failed result with the given error', () => {
      const error: AppError = {
        code: 'unauthorized',
        message: 'Not authenticated',
      };
      const result = err(error);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('unauthorized');
        expect(result.error.message).toBe('Not authenticated');
      }
    });

    it('supports all AppErrorCode values', () => {
      const codes: AppError['code'][] = [
        'unauthorized',
        'invalid_input',
        'not_found',
        'conflict',
        'insufficient_balance',
        'matchmaking_failed',
        'arbitrage_unavailable',
        'internal',
      ];

      for (const code of codes) {
        const result = err({ code, message: `Error: ${code}` });
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.code).toBe(code);
        }
      }
    });

    it('includes optional internalDetail without surfacing it to client', () => {
      const result = err({
        code: 'internal' as const,
        message: 'Something went wrong',
        internalDetail: { dbError: 'connection_refused' },
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.internalDetail).toEqual({ dbError: 'connection_refused' });
        // The message is safe for end users; internalDetail is logged server-side only
        expect(result.error.message).toBe('Something went wrong');
      }
    });
  });

  describe('type narrowing', () => {
    it('narrows correctly via ok flag', () => {
      function processResult(input: string) {
        if (input === 'fail') return err({ code: 'invalid_input' as const, message: 'Bad input' });
        return ok(input.toUpperCase());
      }

      const success = processResult('hello');
      expect(success.ok).toBe(true);
      if (success.ok) {
        expect(success.value).toBe('HELLO');
      }

      const failure = processResult('fail');
      expect(failure.ok).toBe(false);
      if (!failure.ok) {
        expect(failure.error.code).toBe('invalid_input');
      }
    });
  });
});
