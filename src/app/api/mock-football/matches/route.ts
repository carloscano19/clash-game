import { NextResponse } from 'next/server';
import { checkMockAuth } from '@/app/api/mock-football/auth';
import { simulatorRegistry } from '@/features/live-data/simulator';

export async function GET(req: Request) {
  const authError = checkMockAuth(req);
  if (authError) return authError;

  const matches = simulatorRegistry.getAllMatches();
  return NextResponse.json({ matches });
}
