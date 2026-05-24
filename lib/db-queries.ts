import { db } from '@/lib/db';

const DATADRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion';

// Helper to format champion name for Data Dragon URL
function formatChampionImage(name: string): string {
  // Handle special champion name cases for Data Dragon URLs
  const nameMap: Record<string, string> = {
    "Bel'Veth": "Belveth",
    "Cho'Gath": "Chogath",
    "K'Sante": "KSante",
    "Kai'Sa": "Kaisa",
    "Kha'Zix": "Khazix",
    "Kog'Maw": "KogMaw",
    "LeBlanc": "Leblanc",
    "Rek'Sai": "RekSai",
    "Vel'Koz": "Velkoz",
    "Wukong": "MonkeyKing",
    "Nunu & Willump": "Nunu",
    "Renata Glasc": "Renata",
  };
  
  const formatted = nameMap[name] || name.replace(/['\s.]/g, '');
  return `${DATADRAGON_BASE}/${formatted}.png`;
}

export interface ChampionPresence {
  champion: string;
  league: string;
  games: number;
  picks: number;
  bans: number;
  wins: number;
  presence: number;
  winRate: number;
  imageUrl: string;
}

export interface ChampionSynergy {
  championA: string;
  championB: string;
  league: string;
  winsTogether: number;
  gamesTogether: number;
  synergyScore: number;
  imageUrlA: string;
  imageUrlB: string;
}

export interface ChampionCounter {
  championA: string;
  championB: string;
  league: string;
  winsAgainst: number;
  gamesAgainst: number;
  counterScore: number;
  imageUrlA: string;
  imageUrlB: string;
}

export interface ChampionWinRate {
  champion: string;
  league: string;
  games: number;
  wins: number;
  winRate: number;
  imageUrl: string;
}

export interface Match {
  gameId: string;
  league: string;
  year: number;
  patch: string;
  date: string;
  durationSeconds: number;
  sideBlue: string;
  sideRed: string;
  winner: string;
  playoffs: boolean;
}

export interface ProPlayer {
  player: string;
  team: string;
  position: string;
  league: string;
}

export interface Participant {
  id: number;
  gameId: string;
  player: string;
  team: string;
  side: string;
  position: string;
  champion: string;
  won: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  visionScore: number;
  imageUrl: string;
}

// Fetch champion presence data
export async function getChampionPresence(league: string = 'ALL', limit: number = 20): Promise<ChampionPresence[]> {
  const result = await db.execute({
    sql: `SELECT * FROM champion_presence WHERE league = ? ORDER BY presence DESC LIMIT ?`,
    args: [league, limit]
  });
  
  return result.rows.map((row: any) => ({
    champion: row.champion,
    league: row.league,
    games: row.games,
    picks: row.picks,
    bans: row.bans,
    wins: row.wins,
    presence: row.presence,
    winRate: row.win_rate,
    imageUrl: formatChampionImage(row.champion)
  }));
}

// Fetch champion synergy data
export async function getChampionSynergy(league: string = 'ALL', limit: number = 20): Promise<ChampionSynergy[]> {
  const result = await db.execute({
    sql: `SELECT * FROM champion_synergy WHERE league = ? ORDER BY synergy_score DESC LIMIT ?`,
    args: [league, limit]
  });
  
  return result.rows.map((row: any) => ({
    championA: row.champion_a,
    championB: row.champion_b,
    league: row.league,
    winsTogether: row.wins_together,
    gamesTogether: row.games_together,
    synergyScore: row.synergy_score,
    imageUrlA: formatChampionImage(row.champion_a),
    imageUrlB: formatChampionImage(row.champion_b)
  }));
}

// Fetch champion counter data
export async function getChampionCounters(league: string = 'ALL', limit: number = 20): Promise<ChampionCounter[]> {
  const result = await db.execute({
    sql: `SELECT * FROM champion_counters WHERE league = ? ORDER BY counter_score DESC LIMIT ?`,
    args: [league, limit]
  });
  
  return result.rows.map((row: any) => ({
    championA: row.champion_a,
    championB: row.champion_b,
    league: row.league,
    winsAgainst: row.wins_against,
    gamesAgainst: row.games_against,
    counterScore: row.counter_score,
    imageUrlA: formatChampionImage(row.champion_a),
    imageUrlB: formatChampionImage(row.champion_b)
  }));
}

// Fetch champion win rates
export async function getChampionWinRates(league: string = 'ALL', limit: number = 20): Promise<ChampionWinRate[]> {
  const result = await db.execute({
    sql: `SELECT * FROM champion_win_rates WHERE league = ? AND games >= 50 ORDER BY win_rate DESC LIMIT ?`,
    args: [league, limit]
  });
  
  return result.rows.map((row: any) => ({
    champion: row.champion,
    league: row.league,
    games: row.games,
    wins: row.wins,
    winRate: row.win_rate,
    imageUrl: formatChampionImage(row.champion)
  }));
}

// Fetch matches
export async function getMatches(league?: string, limit: number = 20): Promise<Match[]> {
  let sql = `SELECT * FROM matches`;
  const args: any[] = [];
  
  if (league && league !== 'All Leagues') {
    sql += ` WHERE league = ?`;
    args.push(league);
  }
  
  sql += ` ORDER BY date DESC LIMIT ?`;
  args.push(limit);
  
  const result = await db.execute({ sql, args });
  
  return result.rows.map((row: any) => ({
    gameId: row.game_id,
    league: row.league,
    year: row.year,
    patch: row.patch,
    date: row.date,
    durationSeconds: row.duration_seconds,
    sideBlue: row.side_blue,
    sideRed: row.side_red,
    winner: row.winner,
    playoffs: row.playoffs === 1
  }));
}

// Fetch pro players
export async function getProPlayers(league?: string, limit: number = 50): Promise<ProPlayer[]> {
  let sql = `SELECT * FROM pro_players`;
  const args: any[] = [];
  
  if (league && league !== 'All Leagues') {
    sql += ` WHERE league = ?`;
    args.push(league);
  }
  
  sql += ` LIMIT ?`;
  args.push(limit);
  
  const result = await db.execute({ sql, args });
  
  return result.rows.map((row: any) => ({
    player: row.player,
    team: row.team,
    position: row.position,
    league: row.league
  }));
}

// Fetch match participants
export async function getMatchParticipants(gameId: string): Promise<Participant[]> {
  const result = await db.execute({
    sql: `SELECT * FROM participants WHERE game_id = ?`,
    args: [gameId]
  });
  
  return result.rows.map((row: any) => ({
    id: row.id,
    gameId: row.game_id,
    player: row.player,
    team: row.team,
    side: row.side,
    position: row.position,
    champion: row.champion,
    won: row.won === 1,
    kills: row.kills,
    deaths: row.deaths,
    assists: row.assists,
    cs: row.cs,
    gold: row.gold,
    visionScore: row.vision_score,
    imageUrl: formatChampionImage(row.champion)
  }));
}

// Get database stats
export async function getDatabaseStats() {
  const [matches, champions, players, synergies, counters] = await Promise.all([
    db.execute(`SELECT COUNT(*) as total FROM matches`),
    db.execute(`SELECT COUNT(DISTINCT champion) as total FROM champion_presence`),
    db.execute(`SELECT COUNT(*) as total FROM pro_players`),
    db.execute(`SELECT COUNT(*) as total FROM champion_synergy`),
    db.execute(`SELECT COUNT(*) as total FROM champion_counters`)
  ]);
  
  const distinctLeagues = await db.execute(`SELECT COUNT(DISTINCT league) as total FROM matches`);
  
  return {
    matches: (matches.rows[0] as any)?.total || 0,
    champions: (champions.rows[0] as any)?.total || 0,
    players: (players.rows[0] as any)?.total || 0,
    leagues: (distinctLeagues.rows[0] as any)?.total || 0,
    synergyPairs: (synergies.rows[0] as any)?.total || 0,
    counterPairs: (counters.rows[0] as any)?.total || 0
  };
}

// Get unique leagues
export async function getLeagues(): Promise<string[]> {
  const result = await db.execute(`SELECT DISTINCT league FROM matches ORDER BY league`);
  return ['All Leagues', ...result.rows.map((row: any) => row.league)];
}
