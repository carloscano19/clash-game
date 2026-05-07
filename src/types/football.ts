export type MatchStatus = 'scheduled' | 'live' | 'half_time' | 'finished' | 'voided';

export interface Match {
  id: string;
  externalId: string;
  competition: 'WORLD_CUP_2026';
  homeTeam: Team;
  awayTeam: Team;
  kickoffAt: string;     // ISO
  status: MatchStatus;
  currentMinute: number; // 0..120, includes added time as 45+x → encode as 45.x decimal
  score: { home: number; away: number };
}

export interface Team {
  id: string;
  name: string;
  shortCode: string;     // e.g. 'ARG'
  fanTokenSymbol: string | null;
}

export type MatchEventType =
  | 'kickoff'
  | 'goal'
  | 'shot_on_target'
  | 'shot_off_target'
  | 'corner'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'penalty_awarded'
  | 'penalty_scored'
  | 'penalty_missed'
  | 'half_time'
  | 'second_half_start'
  | 'full_time';

export interface MatchEvent {
  id: string;
  matchId: string;
  type: MatchEventType;
  minute: number;        // decimal as above
  team: 'home' | 'away' | null;
  player: { id: string; name: string } | null;
  detailJson: Record<string, unknown>;
  occurredAt: string;    // ISO; server timestamp at moment of emission
}
