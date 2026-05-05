/**
 * Structured logger — thin wrapper over pino (server) / console (client).
 * API is identical on both sides so all code uses the same interface.
 * See coding_standards.md §6.1
 *
 * Usage:
 *   log.info('duel.proposed', { duelId, userId, predicateKind });
 *   log.warn('arbitrage.low_confidence', { duelId, confidence });
 *   log.error('escrow.lock_failed', { duelId, error: err });
 */

import pino from 'pino';

// ---------------------------------------------------------------------------
// Redaction — strips PII and secrets from logs (coding_standards.md §6.1)
// ---------------------------------------------------------------------------

const REDACT_PATHS = [
  'email',
  'cookie',
  'authorization',
  'password',
  'token',
  'secret',
  'prompt', // full prompts can leak Zone C content
  '*.email',
  '*.cookie',
  '*.authorization',
  '*.password',
  '*.token',
  '*.secret',
];

// ---------------------------------------------------------------------------
// Logger factory
// ---------------------------------------------------------------------------

function createLogger() {
  if (typeof window !== 'undefined') {
    // Client-side: wrap console so the API is identical
    return {
      trace: (event: string, data?: Record<string, unknown>) =>
        console.debug('[TRACE]', event, data),
      debug: (event: string, data?: Record<string, unknown>) =>
        console.debug('[DEBUG]', event, data),
      info: (event: string, data?: Record<string, unknown>) =>
        console.info('[INFO]', event, data),
      warn: (event: string, data?: Record<string, unknown>) =>
        console.warn('[WARN]', event, data),
      error: (event: string, data?: Record<string, unknown>) =>
        console.error('[ERROR]', event, data),
      fatal: (event: string, data?: Record<string, unknown>) =>
        console.error('[FATAL]', event, data),
    };
  }

  // Server-side: use pino
  const level = process.env['LOG_LEVEL'] ?? 'info';

  const pinoLogger = pino({
    level,
    redact: {
      paths: REDACT_PATHS,
      censor: '[REDACTED]',
    },
    base: {
      service: 'chiliz-clash',
      env: process.env['SOCIOS_ENV'] ?? 'local',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  /**
   * Structured log helper.
   * Event names follow dotted form: <domain>.<event> (e.g. 'duel.proposed').
   * Never string-concatenate dynamic data into the message.
   */
  return {
    trace: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.trace(data ?? {}, event),
    debug: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.debug(data ?? {}, event),
    info: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.info(data ?? {}, event),
    warn: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.warn(data ?? {}, event),
    error: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.error(data ?? {}, event),
    fatal: (event: string, data?: Record<string, unknown>) =>
      pinoLogger.fatal(data ?? {}, event),
  };
}

export const log = createLogger();
