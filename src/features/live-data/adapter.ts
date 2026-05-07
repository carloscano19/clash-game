import type { Match, MatchEvent } from '@/types/football';

export interface FootballDataAdapter {
  getMatch(matchId: string): Promise<Match>;
  getEventsSince(matchId: string, since: Date): Promise<MatchEvent[]>;
  subscribe(matchId: string, onEvent: (e: MatchEvent) => void): () => void;
}
