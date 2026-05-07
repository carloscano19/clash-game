import { NextResponse } from 'next/server';
import { checkMockAuth } from '@/app/api/mock-football/auth';
import { simulatorRegistry } from '@/features/live-data/simulator';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkMockAuth(req);
  if (authError) return authError;

  const id = (await params).id;
  const sim = simulatorRegistry.get(id);
  if (!sim) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

  const url = new URL(req.url);
  const sinceStr = url.searchParams.get('since');
  let events = sim.eventsHistory;

  if (sinceStr) {
    const sinceDate = new Date(sinceStr);
    if (!isNaN(sinceDate.getTime())) {
      events = events.filter(e => new Date(e.occurredAt).getTime() > sinceDate.getTime());
    }
  }

  return NextResponse.json({ events });
}
