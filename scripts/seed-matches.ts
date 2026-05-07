/**
 * Seed script — inserts 3 World Cup test matches into Supabase.
 * Run: npx tsx scripts/seed-matches.ts
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !serviceKey) {
  console.error('❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey);

const matches = [
  {
    external_id: 'ext_1',
    home_team: 'ARG',
    away_team: 'FRA',
    kickoff_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // started 40m ago
    status: 'live',
  },
  {
    external_id: 'ext_2',
    home_team: 'ENG',
    away_team: 'USA',
    kickoff_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // starts in 2h
    status: 'scheduled',
  },
  {
    external_id: 'ext_3',
    home_team: 'BRA',
    away_team: 'POR',
    kickoff_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // starts in 5h
    status: 'scheduled',
  },
];

async function seed() {
  console.log('🌱 Seeding matches...');

  // Upsert by external_id to be idempotent
  for (const match of matches) {
    const { data, error } = await supabase
      .from('matches')
      .upsert(match, { onConflict: 'external_id' })
      .select()
      .single();

    if (error) {
      console.error(`❌ Failed to upsert ${match.home_team} vs ${match.away_team}:`, error.message);
    } else {
      console.log(`✅ ${match.home_team} vs ${match.away_team} → id: ${data.id} (${match.status})`);
    }
  }

  console.log('\n🎉 Done! Run pnpm dev and visit http://localhost:3000');
}

seed().catch(console.error);
