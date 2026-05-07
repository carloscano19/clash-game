import { NextResponse } from 'next/server';
import { checkMockAuth } from '@/app/api/mock-football/auth';
import { simulatorRegistry } from '@/features/live-data/simulator';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkMockAuth(req);
  if (authError) return authError;

  const id = (await params).id;
  const sim = simulatorRegistry.get(id);
  if (!sim) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

  return NextResponse.json({ match: sim.match });
}
