/**
 * Environment variable validation using Zod.
 * Parses process.env at module load; throws a clear startup error if validation fails.
 * See ag_instructions.md §0.5 and coding_standards.md §3.5
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const envSchema = z.object({
  // Supabase — public
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Supabase — server-only (optional in local; required in non-local envs)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),

  // Gemini
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

  // Mock football API
  MOCK_FOOTBALL_TOKEN: z.string().optional(),
  MOCK_FOOTBALL_FIXTURE: z
    .string()
    .optional()
    .default('argentina-vs-france'),

  // Environment metadata
  SOCIOS_ENV: z
    .enum(['local', 'preview', 'staging', 'prod'])
    .default('local'),

  OUTBOUND_PROXY_URL: z.string().url().optional().or(z.literal('')),

  OTEL_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(false),

  // Logging
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .default('info'),
});

// ---------------------------------------------------------------------------
// Validation — runs once at module load; throws on failure
// ---------------------------------------------------------------------------

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');

    throw new Error(
      `[chiliz-clash] Environment validation failed.\n` +
        `Check your .env.local file against .env.example.\n\n` +
        `${issues}\n`
    );
  }

  return result.data;
}

/** Typed, validated environment variables. Throws at import if any required var is missing. */
export const env = parseEnv();
