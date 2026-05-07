import { z } from 'zod';

export const MatchStatusSchema = z.enum(['scheduled', 'live', 'half_time', 'finished', 'voided']);

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortCode: z.string(),
  fanTokenSymbol: z.string().nullable(),
});

export const MatchSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  competition: z.literal('WORLD_CUP_2026'),
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
  kickoffAt: z.string().datetime(),
  status: MatchStatusSchema,
  currentMinute: z.number().min(0).max(150),
  score: z.object({
    home: z.number().min(0),
    away: z.number().min(0),
  }),
});

export const MatchEventTypeSchema = z.enum([
  'kickoff',
  'goal',
  'shot_on_target',
  'shot_off_target',
  'corner',
  'yellow_card',
  'red_card',
  'substitution',
  'penalty_awarded',
  'penalty_scored',
  'penalty_missed',
  'half_time',
  'second_half_start',
  'full_time',
]);

export const MatchEventSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  type: MatchEventTypeSchema,
  minute: z.number().min(0).max(150),
  team: z.enum(['home', 'away']).nullable(),
  player: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  detailJson: z.record(z.string(), z.unknown()),
  occurredAt: z.string().datetime(),
});
