import { NextResponse } from 'next/server';

export function checkMockAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];
  if (!token || token !== process.env['MOCK_FOOTBALL_TOKEN']) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
