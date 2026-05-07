import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { MatchSimulator } from './simulator';
import type { Match, MatchEvent } from '@/types/football';

describe('MatchSimulator', () => {
  let mockMatch: Match;
  let mockEvents: MatchEvent[];

  beforeEach(() => {
    mockMatch = {
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

    mockEvents = [
      { id: 'e1', matchId: 'm1', type: 'kickoff', minute: 0, team: null, player: null, detailJson: {}, occurredAt: '' },
      { id: 'e2', matchId: 'm1', type: 'goal', minute: 15, team: 'home', player: null, detailJson: {}, occurredAt: '' },
      { id: 'e3', matchId: 'm1', type: 'yellow_card', minute: 30, team: 'away', player: null, detailJson: {}, occurredAt: '' },
    ];
  });

  it('initializes with pending events sorted by minute', () => {
    const sim = new MatchSimulator(mockMatch, mockEvents);
    expect(sim.match.currentMinute).toBe(0);
    expect(sim.eventsHistory).toHaveLength(0);
  });

  it('tick(seconds) advances time and emits events', () => {
    const sim = new MatchSimulator(mockMatch, mockEvents);
    const receivedEvents: MatchEvent[] = [];
    sim.subscribe((e) => receivedEvents.push(e));
    sim.start();

    sim.tick(600);
    expect(sim.match.currentMinute).toBe(10);
    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0]?.type).toBe('kickoff');

    sim.tick(600);
    expect(sim.match.currentMinute).toBe(20);
    expect(receivedEvents).toHaveLength(2);
    expect(receivedEvents[1]?.type).toBe('goal');
    expect(sim.match.score.home).toBe(1);

    sim.pause();
  });

  it('inject(event) bypasses the pending queue and emits instantly', () => {
    const sim = new MatchSimulator(mockMatch, mockEvents);
    const receivedEvents: MatchEvent[] = [];
    sim.subscribe((e) => receivedEvents.push(e));

    const customEvent: MatchEvent = {
      id: 'custom1', matchId: 'm1', type: 'red_card', minute: 5, team: 'away', player: null, detailJson: {}, occurredAt: ''
    };

    sim.inject(customEvent);
    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0]?.id).toBe('custom1');
    expect(sim.eventsHistory).toHaveLength(1);
    expect(sim.eventsHistory[0]?.id).toBe('custom1');
  });

  it('is deterministic over arbitrary tick sequences (property test)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 1, max: 1000 })), (ticks) => {
        const sim = new MatchSimulator(mockMatch, mockEvents);
        sim.start();

        let totalTicks = 0;
        for (const seconds of ticks) {
          sim.tick(seconds);
          totalTicks += seconds;
        }

        const expectedMinute = totalTicks / 60;
        expect(sim.match.currentMinute).toBeCloseTo(expectedMinute, 5);

        const expectedEventCount = totalTicks === 0
          ? 0
          : mockEvents.filter(e => e.minute <= expectedMinute).length;

        expect(sim.eventsHistory.length).toBe(expectedEventCount);

        for (let i = 1; i < sim.eventsHistory.length; i++) {
          const prev = sim.eventsHistory[i - 1];
          const curr = sim.eventsHistory[i];
          if (prev && curr) {
            expect(curr.minute).toBeGreaterThanOrEqual(prev.minute);
          }
        }

        sim.pause();
      })
    );
  });
});
