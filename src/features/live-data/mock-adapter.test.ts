import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockAdapter } from './mock-adapter';
import type { Match } from '@/types/football';

describe('MockFootballAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getMatch fetches and validates a match', async () => {
    const fakeMatch: Match = {
      id: 'm1',
      externalId: 'ext1',
      competition: 'WORLD_CUP_2026',
      homeTeam: { id: 't1', name: 'A', shortCode: 'A', fanTokenSymbol: null },
      awayTeam: { id: 't2', name: 'B', shortCode: 'B', fanTokenSymbol: null },
      kickoffAt: new Date().toISOString(),
      status: 'scheduled',
      currentMinute: 0,
      score: { home: 0, away: 0 }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ match: fakeMatch }),
    });

    const match = await mockAdapter.getMatch('m1');
    expect(match.id).toBe('m1');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('subscribe connects to EventSource and parses events', () => {
    global.window = {} as Window & typeof globalThis;

    const mockEventSource = {
      onmessage: null as ((ev: MessageEvent) => void) | null,
      onerror: null as ((ev: Event) => void) | null,
      close: vi.fn(),
    };

    const MockEventSource = vi.fn(function(this: typeof mockEventSource) {
      mockEventSource.close = vi.fn();
      Object.assign(this, mockEventSource);
      MockEventSource.prototype.instance = this;
    });

    global.EventSource = MockEventSource as unknown as typeof EventSource;

    const onEvent = vi.fn();
    const unsubscribe = mockAdapter.subscribe('m1', onEvent);

    expect(global.EventSource).toHaveBeenCalledWith(
      expect.stringContaining('/api/mock-football/matches/m1/stream')
    );

    const fakeEvent = {
      id: 'e1', matchId: 'm1', type: 'goal', minute: 15, team: 'home',
      player: null, detailJson: {}, occurredAt: new Date().toISOString()
    };

    const instance = (global.EventSource as unknown as { prototype: { instance: typeof mockEventSource } }).prototype.instance;
    if (instance?.onmessage) {
      instance.onmessage({ data: JSON.stringify(fakeEvent) } as MessageEvent);
    }

    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent.mock.calls[0]?.[0]?.id).toBe('e1');

    unsubscribe();
    expect(instance?.close).toHaveBeenCalledTimes(1);
  });
});
