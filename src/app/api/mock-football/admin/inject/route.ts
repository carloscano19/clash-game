import { NextResponse } from 'next/server';
import { checkMockAuth } from '@/app/api/mock-football/auth';
import { simulatorRegistry } from '@/features/live-data/simulator';
import { MatchEventSchema } from '@/types/football.schema';

export async function POST(req: Request) {
  if (process.env['SOCIOS_ENV'] !== 'local') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authError = checkMockAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const event = MatchEventSchema.parse(body);

    const sim = simulatorRegistry.get(event.matchId);
    if (!sim) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    sim.inject(event);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Bad Request', details: err.message }, { status: 400 });
  }
}
