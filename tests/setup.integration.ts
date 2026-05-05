/**
 * Vitest integration test global setup.
 * Initializes Supabase test harness and environment.
 */

// Set environment for integration tests
process.env['SOCIOS_ENV'] = 'local';
process.env['LOG_LEVEL'] = 'silent';
