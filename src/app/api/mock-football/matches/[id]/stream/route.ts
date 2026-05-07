import { simulatorRegistry } from '@/features/live-data/simulator';
import type { MatchEvent } from '@/types/football';

export const dynamic = 'force-dynamic';

/**
 * Checks mock auth — accepts either Bearer header OR `?token=` query param
 * (EventSource in the browser cannot set custom headers).
 */
function checkStreamAuth(req: Request): boolean {
  const expected = process.env['MOCK_FOOTBALL_TOKEN'];
  if (!expected) return false;

  // Check Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split('Bearer ')[1] === expected;
  }

  // Fall back to query param for EventSource clients
  const { searchParams } = new URL(req.url);
  return searchParams.get('token') === expected;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkStreamAuth(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const id = (await params).id;
  const sim = simulatorRegistry.get(id);
  if (!sim) {
    return new Response('Match not found', { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection comment to keep-alive
      controller.enqueue(new TextEncoder().encode(': connected\n\n'));

      const onEvent = (e: MatchEvent) => {
        const data = `data: ${JSON.stringify(e)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };

      const unsubscribe = sim.subscribe(onEvent);

      req.signal.addEventListener('abort', () => {
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
