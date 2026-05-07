import { describe, it, expect, beforeEach } from 'vitest';
import { GET as streamGET } from '@/app/api/mock-football/matches/[id]/stream/route';
import { POST as tickPOST } from '@/app/api/mock-football/admin/tick/route';
import { simulatorRegistry } from '@/features/live-data/simulator';

describe('Mock Football API Integration', () => {
  beforeEach(() => {
    process.env['MOCK_FOOTBALL_TOKEN'] = 'test-token';
    process.env['SOCIOS_ENV'] = 'local';

    const sim = simulatorRegistry.get('m_eng_usa');
    if (sim) {
      sim.pause();
      sim.match.currentMinute = 0;
      sim.match.score = { home: 0, away: 0 };
    }
  });

  it('delivers events via SSE when tick is called', async () => {
    const sim = simulatorRegistry.get('m_eng_usa');
    expect(sim).toBeDefined();

    const req = new Request('http://localhost:3000/api/mock-football/matches/m_eng_usa/stream', {
      headers: { 'Authorization': 'Bearer test-token' }
    });

    const res = await streamGET(req, { params: Promise.resolve({ id: 'm_eng_usa' }) });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const reader = res.body?.getReader();
    expect(reader).toBeDefined();

    let result = await reader!.read();
    let text = new TextDecoder().decode(result.value);
    expect(text).toContain(': connected');

    const tickReq = new Request('http://localhost:3000/api/mock-football/admin/tick', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ matchId: 'm_eng_usa', seconds: 900 })
    });

    const tickRes = await tickPOST(tickReq);
    expect(tickRes.status).toBe(200);

    let collectedText = '';
    while (!collectedText.includes('"type":"shot_off_target"')) {
      result = await reader!.read();
      if (result.done) break;
      collectedText += new TextDecoder().decode(result.value);
    }

    expect(collectedText).toContain('"type":"kickoff"');
    expect(collectedText).toContain('"type":"shot_off_target"');

    sim?.pause();
  });
});
