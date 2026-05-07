import type { Match, MatchEvent } from '@/types/football';
import argFraFixture from './fixtures/argentina-vs-france.json';
import engUsaFixture from './fixtures/england-vs-usa.json';
import braPorFixture from './fixtures/brazil-vs-portugal.json';

// Simple deterministic PRNG (Mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MatchSimulator {
  public match: Match;
  public eventsHistory: MatchEvent[] = [];
  
  private pendingEvents: MatchEvent[] = [];
  private subscribers: Set<(e: MatchEvent) => void> = new Set();
  private isPlaying = false;
  private intervalId: NodeJS.Timeout | null = null;
  private prng: () => number;

  constructor(match: Match, initialEvents: MatchEvent[], seed = 12345) {
    this.match = { ...match };
    this.prng = mulberry32(seed);
    
    // Sort events by minute to ensure correct processing order
    this.pendingEvents = [...initialEvents].sort((a, b) => a.minute - b.minute);
  }

  public start() {
    if (this.isPlaying || this.match.status === 'finished') return;
    this.isPlaying = true;
    if (this.match.status === 'scheduled') this.match.status = 'live';

    // Auto-advancing interval — 1 simulation minute per real second.
    // Disabled by default in favour of manual /admin/tick control.
    // Call start() explicitly only if you want the auto-clock.
    this.intervalId = setInterval(() => {
      this.tick(60);
    }, 1000);
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public tick(seconds: number) {
    if (seconds <= 0 || this.match.status === 'finished') return;
    // Transition from scheduled → live on first manual tick
    if (this.match.status === 'scheduled') this.match.status = 'live';

    const minutesToAdvance = seconds / 60;
    const nextMinute = this.match.currentMinute + minutesToAdvance;

    // Process all events up to nextMinute
    while (this.pendingEvents.length > 0) {
      const next = this.pendingEvents[0];
      if (!next || next.minute > nextMinute) break;
      const ev = this.pendingEvents.shift()!;
      
      // Update match state based on event
      if (ev.type === 'goal' || ev.type === 'penalty_scored') {
        if (ev.team === 'home') this.match.score.home++;
        if (ev.team === 'away') this.match.score.away++;
      } else if (ev.type === 'half_time') {
        this.match.status = 'half_time';
      } else if (ev.type === 'second_half_start') {
        this.match.status = 'live';
      } else if (ev.type === 'full_time') {
        this.match.status = 'finished';
        this.pause();
      }

      this.emit(ev);
    }

    this.match.currentMinute = nextMinute;
  }

  public inject(event: MatchEvent) {
    // Instantly apply and emit
    this.eventsHistory.push(event);
    this.subscribers.forEach((cb) => cb(event));
  }

  public subscribe(cb: (e: MatchEvent) => void): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  private emit(event: MatchEvent) {
    // Set occurrence time based on real server time when it happens
    event.occurredAt = new Date().toISOString();
    this.eventsHistory.push(event);
    this.subscribers.forEach((cb) => cb(event));
  }
}

// Global registry of active simulators (used by API routes)
class SimulatorRegistry {
  private simulators: Map<string, MatchSimulator> = new Map();

  constructor() {
    this.loadFixtures();
  }

  private loadFixtures() {
    const fixtures = [argFraFixture, engUsaFixture, braPorFixture];
    for (const fx of fixtures) {
      const match = fx.match as Match;
      const events = fx.events as MatchEvent[];
      const sim = new MatchSimulator(match, events);
      this.simulators.set(match.id, sim);
    }
  }

  public get(matchId: string): MatchSimulator | undefined {
    return this.simulators.get(matchId);
  }

  public getAllMatches(): Match[] {
    return Array.from(this.simulators.values()).map(s => s.match);
  }
}

// Singleton for development
export const simulatorRegistry = new SimulatorRegistry();
