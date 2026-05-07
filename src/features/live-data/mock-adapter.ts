import type { FootballDataAdapter } from './adapter';
import type { Match, MatchEvent } from '@/types/football';
import { MatchSchema, MatchEventSchema } from '@/types/football.schema';
import { z } from 'zod';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env['NEXT_PUBLIC_APP_URL']) return process.env['NEXT_PUBLIC_APP_URL'];
  return 'http://localhost:3000';
}

function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${process.env['MOCK_FOOTBALL_TOKEN']}`,
  };
}

export class MockFootballAdapter implements FootballDataAdapter {
  async getMatch(matchId: string): Promise<Match> {
    const res = await fetch(`${getBaseUrl()}/api/mock-football/matches/${matchId}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch match: ${res.statusText}`);
    const data = await res.json();
    return MatchSchema.parse(data.match);
  }

  async getEventsSince(matchId: string, since: Date): Promise<MatchEvent[]> {
    const url = new URL(`${getBaseUrl()}/api/mock-football/matches/${matchId}/events`);
    url.searchParams.set('since', since.toISOString());
    const res = await fetch(url.toString(), {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
    const data = await res.json();
    return z.array(MatchEventSchema).parse(data.events);
  }

  subscribe(matchId: string, onEvent: (e: MatchEvent) => void): () => void {
    const url = `${getBaseUrl()}/api/mock-football/matches/${matchId}/stream`;
    if (typeof window !== 'undefined') {
      const eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data as string);
          const validated = MatchEventSchema.parse(parsed);
          onEvent(validated);
        } catch (err) {
          console.error('Error parsing SSE event:', err);
        }
      };
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
      };
      return () => eventSource.close();
    }
    console.warn('MockFootballAdapter.subscribe called on the server.');
    return () => {};
  }
}

export const mockAdapter = new MockFootballAdapter();
