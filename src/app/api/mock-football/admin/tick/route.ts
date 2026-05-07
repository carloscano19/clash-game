import { NextResponse } from 'next/server';
import { checkMockAuth } from '@/app/api/mock-football/auth';
import { simulatorRegistry } from '@/features/live-data/simulator';
import { z } from 'zod';

const TickSchema = z.object({
  matchId: z.string(),
  seconds: z.number().min(0),
});

export async function POST(req: Request) {
  if (process.env['SOCIOS_ENV'] !== 'local') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authError = checkMockAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { matchId, seconds } = TickSchema.parse(body);

    const sim = simulatorRegistry.get(matchId);
    if (!sim) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // tick() handles the scheduled→live transition internally
    sim.tick(seconds);

    return NextResponse.json({ success: true, currentMinute: sim.match.currentMinute });
  } catch (err: any) {
    return NextResponse.json({ error: 'Bad Request', details: err.message }, { status: 400 });
  }
}
