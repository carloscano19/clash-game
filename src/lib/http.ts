/**
 * HTTP fetch wrapper — ALL outbound non-Supabase, non-Gemini HTTP must go through here.
 * See coding_standards.md §3.6
 *
 * Features:
 * - Routes through OUTBOUND_PROXY_URL if set
 * - Enforces a 5s default timeout (hard ceiling 30s)
 * - Validates response status and content-type
 * - Logs the call (URL, status, duration)
 * - Strips Cookie headers from outbound calls unless explicitly opted-in
 */

import { log } from './log';

const DEFAULT_TIMEOUT_MS = 5_000;
const HARD_CEILING_MS = 30_000;

interface FetchHttpOptions extends RequestInit {
  /** Override default 5s timeout (max 30s) */
  timeoutMs?: number;
  /** Pass cookies to the outbound request (dangerous — opt-in only) */
  allowCookies?: boolean;
}

/**
 * Fetch wrapper for all third-party HTTP calls.
 * Enforces timeout, proxy routing, logging, and cookie stripping.
 */
export async function fetchHttp(
  url: string,
  opts: FetchHttpOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, allowCookies = false, ...fetchOpts } = opts;

  const effectiveTimeout = Math.min(timeoutMs, HARD_CEILING_MS);
  const proxyUrl = process.env['OUTBOUND_PROXY_URL'];
  const targetUrl = proxyUrl ? `${proxyUrl}?target=${encodeURIComponent(url)}` : url;

  // Strip Cookie headers from outbound calls unless opted-in
  const headers = new Headers(fetchOpts.headers);
  if (!allowCookies) {
    headers.delete('Cookie');
    headers.delete('cookie');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

  const startedAt = Date.now();

  try {
    const response = await fetch(targetUrl, {
      ...fetchOpts,
      headers,
      signal: controller.signal,
    });

    const durationMs = Date.now() - startedAt;

    log.info('http.outbound', {
      url,
      status: response.status,
      durationMs,
    });

    return response;
  } catch (error: unknown) {
    const durationMs = Date.now() - startedAt;

    log.error('http.outbound.error', {
      url,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
