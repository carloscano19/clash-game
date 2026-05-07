const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, 'src/features/live-data/fixtures');
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

function createMatch(id, externalId, home, away, status, kickoffAt) {
  return {
    id,
    externalId,
    competition: 'WORLD_CUP_2026',
    homeTeam: home,
    awayTeam: away,
    kickoffAt,
    status,
    currentMinute: 0,
    score: { home: 0, away: 0 }
  };
}

const teams = {
  ARG: { id: 't_arg', name: 'Argentina', shortCode: 'ARG', fanTokenSymbol: 'ARG' },
  FRA: { id: 't_fra', name: 'France', shortCode: 'FRA', fanTokenSymbol: 'FRA' },
  ENG: { id: 't_eng', name: 'England', shortCode: 'ENG', fanTokenSymbol: null },
  USA: { id: 't_usa', name: 'USA', shortCode: 'USA', fanTokenSymbol: null },
  BRA: { id: 't_bra', name: 'Brazil', shortCode: 'BRA', fanTokenSymbol: 'BRA' },
  POR: { id: 't_por', name: 'Portugal', shortCode: 'POR', fanTokenSymbol: 'POR' },
};

function createEvent(matchId, type, minute, team, player, detailJson = {}) {
  return {
    id: `ev_${Math.random().toString(36).substring(2, 9)}`,
    matchId,
    type,
    minute,
    team,
    player,
    detailJson,
    occurredAt: new Date().toISOString()
  };
}

// 1. Argentina vs France (High scoring, 3-2 by 75th min, 4 cards, 14 corners)
const argFraMatch = createMatch('m_arg_fra', 'ext_1', teams.ARG, teams.FRA, 'scheduled', '2026-06-15T18:00:00Z');
const argFraEvents = [
  createEvent('m_arg_fra', 'kickoff', 0, null, null),
  createEvent('m_arg_fra', 'corner', 5, 'home', null),
  createEvent('m_arg_fra', 'shot_on_target', 10, 'home', { id: 'p_messi', name: 'L. Messi' }),
  createEvent('m_arg_fra', 'goal', 11, 'home', { id: 'p_messi', name: 'L. Messi' }),
  createEvent('m_arg_fra', 'corner', 18, 'away', null),
  createEvent('m_arg_fra', 'yellow_card', 22, 'home', { id: 'p_depaul', name: 'R. De Paul' }),
  createEvent('m_arg_fra', 'corner', 25, 'home', null),
  createEvent('m_arg_fra', 'goal', 30, 'away', { id: 'p_mbappe', name: 'K. Mbappe' }),
  createEvent('m_arg_fra', 'corner', 35, 'away', null),
  createEvent('m_arg_fra', 'yellow_card', 40, 'away', { id: 'p_rabiot', name: 'A. Rabiot' }),
  createEvent('m_arg_fra', 'half_time', 45, null, null),
  createEvent('m_arg_fra', 'second_half_start', 45, null, null),
  createEvent('m_arg_fra', 'goal', 50, 'home', { id: 'p_dimaria', name: 'A. Di Maria' }),
  createEvent('m_arg_fra', 'corner', 55, 'home', null),
  createEvent('m_arg_fra', 'corner', 56, 'home', null),
  createEvent('m_arg_fra', 'corner', 57, 'home', null),
  createEvent('m_arg_fra', 'yellow_card', 60, 'home', { id: 'p_romero', name: 'C. Romero' }),
  createEvent('m_arg_fra', 'goal', 65, 'away', { id: 'p_giroud', name: 'O. Giroud' }),
  createEvent('m_arg_fra', 'corner', 70, 'away', null),
  createEvent('m_arg_fra', 'goal', 75, 'home', { id: 'p_messi', name: 'L. Messi' }),
  createEvent('m_arg_fra', 'yellow_card', 80, 'away', { id: 'p_tcho', name: 'A. Tchouameni' }),
  createEvent('m_arg_fra', 'corner', 81, 'home', null),
  createEvent('m_arg_fra', 'corner', 82, 'home', null),
  createEvent('m_arg_fra', 'corner', 83, 'away', null),
  createEvent('m_arg_fra', 'corner', 85, 'away', null),
  createEvent('m_arg_fra', 'corner', 88, 'home', null),
  createEvent('m_arg_fra', 'corner', 91, 'away', null),
  createEvent('m_arg_fra', 'full_time', 95, null, null),
];
fs.writeFileSync(path.join(fixturesDir, 'argentina-vs-france.json'), JSON.stringify({ match: argFraMatch, events: argFraEvents }, null, 2));

// 2. England vs USA (0-0 dull match)
const engUsaMatch = createMatch('m_eng_usa', 'ext_2', teams.ENG, teams.USA, 'scheduled', '2026-06-16T18:00:00Z');
const engUsaEvents = [
  createEvent('m_eng_usa', 'kickoff', 0, null, null),
  createEvent('m_eng_usa', 'shot_off_target', 15, 'home', { id: 'p_kane', name: 'H. Kane' }),
  createEvent('m_eng_usa', 'corner', 25, 'home', null),
  createEvent('m_eng_usa', 'shot_off_target', 35, 'away', { id: 'p_pulisic', name: 'C. Pulisic' }),
  createEvent('m_eng_usa', 'half_time', 45, null, null),
  createEvent('m_eng_usa', 'second_half_start', 45, null, null),
  createEvent('m_eng_usa', 'corner', 60, 'away', null),
  createEvent('m_eng_usa', 'substitution', 70, 'home', { id: 'p_foden', name: 'P. Foden' }),
  createEvent('m_eng_usa', 'yellow_card', 85, 'away', { id: 'p_mckennie', name: 'W. McKennie' }),
  createEvent('m_eng_usa', 'full_time', 93, null, null),
];
fs.writeFileSync(path.join(fixturesDir, 'england-vs-usa.json'), JSON.stringify({ match: engUsaMatch, events: engUsaEvents }, null, 2));

// 3. Brazil vs Portugal (1-1, penalties)
const braPorMatch = createMatch('m_bra_por', 'ext_3', teams.BRA, teams.POR, 'scheduled', '2026-06-17T18:00:00Z');
const braPorEvents = [
  createEvent('m_bra_por', 'kickoff', 0, null, null),
  createEvent('m_bra_por', 'goal', 20, 'home', { id: 'p_neymar', name: 'Neymar Jr' }),
  createEvent('m_bra_por', 'half_time', 45, null, null),
  createEvent('m_bra_por', 'second_half_start', 45, null, null),
  createEvent('m_bra_por', 'goal', 80, 'away', { id: 'p_cr7', name: 'C. Ronaldo' }),
  createEvent('m_bra_por', 'full_time', 90, null, null),
  createEvent('m_bra_por', 'penalty_scored', 121, 'home', { id: 'p_neymar', name: 'Neymar Jr' }),
  createEvent('m_bra_por', 'penalty_scored', 122, 'away', { id: 'p_cr7', name: 'C. Ronaldo' }),
  createEvent('m_bra_por', 'penalty_missed', 123, 'home', { id: 'p_vini', name: 'Vini Jr' }),
  createEvent('m_bra_por', 'penalty_scored', 124, 'away', { id: 'p_bruno', name: 'B. Fernandes' }),
  createEvent('m_bra_por', 'penalty_missed', 125, 'home', { id: 'p_rich', name: 'Richarlison' }),
];
fs.writeFileSync(path.join(fixturesDir, 'brazil-vs-portugal.json'), JSON.stringify({ match: braPorMatch, events: braPorEvents }, null, 2));

console.log("Fixtures generated in chiliz-clash");
