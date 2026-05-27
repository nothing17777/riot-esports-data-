import { db } from '@/lib/db';

const DATADRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion';

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

// Fetch matches with optional filters
export async function getMatches(
  league?: string,
  limit: number = 50,
  year?: string,
  patch?: string,
  playoffs?: boolean
): Promise<Match[]> {
  const conditions: string[] = [];
  const args: any[] = [];

  if (league && league !== 'All Leagues') {
    conditions.push('league = ?');
    args.push(league);
  }
  if (year && year !== 'All Years') {
    conditions.push('year = ?');
    args.push(parseInt(year));
  }
  if (patch) {
    conditions.push('patch LIKE ?');
    args.push(`%${patch}%`);
  }
  if (playoffs === true) {
    conditions.push('playoffs = 1');
  }

  let sql = `SELECT * FROM matches`;
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
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

// Fetch full match detail from database (participants + bans)
export async function getMatchDetailFromDb(gameId: string): Promise<any | null> {
  // Fetch the match row
  const matchResult = await db.execute({
    sql: `SELECT * FROM matches WHERE game_id = ?`,
    args: [gameId]
  });

  if (matchResult.rows.length === 0) return null;
  const matchRow = matchResult.rows[0] as any;

  // Fetch participants
  const participantsResult = await db.execute({
    sql: `SELECT * FROM participants WHERE game_id = ? ORDER BY side, position`,
    args: [gameId]
  });

  // Fetch bans
  const bansResult = await db.execute({
    sql: `SELECT * FROM bans WHERE game_id = ? ORDER BY side, ban_num`,
    args: [gameId]
  });

  const normalizePosition = (pos: string): 'top' | 'jungle' | 'mid' | 'bot' | 'support' => {
    const map: Record<string, any> = {
      top: 'top', jungle: 'jungle', mid: 'mid', bot: 'bot',
      adc: 'bot', support: 'support', sup: 'support'
    };
    return map[pos?.toLowerCase()] || 'mid';
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const buildParticipant = (row: any) => ({
    player: row.player || 'Unknown',
    playerId: row.player || 'unknown',
    position: normalizePosition(row.position),
    champion: {
      id: row.champion,
      name: row.champion,
      role: normalizePosition(row.position),
      imageUrl: formatChampionImage(row.champion),
      presence: 0, winRate: 0, picks: 0, bans: 0
    },
    kills: row.kills || 0,
    deaths: row.deaths || 0,
    assists: row.assists || 0,
    cs: row.cs || 0,
    gold: row.gold || 0,
    visionScore: row.vision_score || 0,
    kda: row.deaths > 0
      ? Math.round(((row.kills + row.assists) / row.deaths) * 10) / 10
      : (row.kills || 0) + (row.assists || 0)
  });

  const positionOrder = ['top', 'jungle', 'mid', 'bot', 'support'];
  const sortByPosition = (a: any, b: any) =>
    positionOrder.indexOf(a.position?.toLowerCase()) - positionOrder.indexOf(b.position?.toLowerCase());

  const blueParticipants = (participantsResult.rows as any[])
    .filter(r => r.side?.toLowerCase() === 'blue')
    .map(buildParticipant)
    .sort(sortByPosition);

  const redParticipants = (participantsResult.rows as any[])
    .filter(r => r.side?.toLowerCase() === 'red')
    .map(buildParticipant)
    .sort(sortByPosition);

  const buildBans = (side: string) =>
    (bansResult.rows as any[])
      .filter(r => r.side?.toLowerCase() === side)
      .sort((a: any, b: any) => (a.ban_num || 0) - (b.ban_num || 0))
      .map((r: any) => ({
        id: r.champion,
        name: r.champion,
        role: 'mid' as const,
        imageUrl: formatChampionImage(r.champion),
        presence: 0, winRate: 0, picks: 0, bans: 0
      }));

  const calcTotals = (participants: any[]) => ({
    kills: participants.reduce((s, p) => s + p.kills, 0),
    deaths: participants.reduce((s, p) => s + p.deaths, 0),
    gold: participants.reduce((s, p) => s + p.gold, 0),
  });

  const winner = matchRow.winner?.toLowerCase() === 'blue' ? 'blue' : 'red';

  return {
    gameId: matchRow.game_id,
    league: matchRow.league,
    date: matchRow.date,
    patch: matchRow.patch || '',
    duration: formatDuration(matchRow.duration_seconds || 0),
    playoffs: matchRow.playoffs === 1,
    winner,
    blue: {
      team: matchRow.side_blue || 'Blue',
      won: winner === 'blue',
      players: blueParticipants,
      bans: buildBans('blue'),
      totals: calcTotals(blueParticipants),
    },
    red: {
      team: matchRow.side_red || 'Red',
      won: winner === 'red',
      players: redParticipants,
      bans: buildBans('red'),
      totals: calcTotals(redParticipants),
    },
  };
}

// Fetch pro players with live aggregated stats
export async function getProPlayersWithStats(
  league?: string,
  position?: string,
  search?: string,
  limit: number = 100
): Promise<any[]> {
  const conditions: string[] = [`p.player != ''`];
  const args: any[] = [];

  if (league && league !== 'All Leagues') {
    conditions.push('m.league = ?');
    args.push(league);
  }
  if (position && position !== 'all') {
    const posMap: Record<string, string[]> = {
      top: ['top'], jungle: ['jungle'], mid: ['mid'],
      bot: ['bot', 'adc'], support: ['sup', 'support']
    };
    const positions = posMap[position] || [position];
    conditions.push(`(${positions.map(() => 'p.position = ?').join(' OR ')})`);
    args.push(...positions);
  }
  if (search) {
    conditions.push('p.player LIKE ?');
    args.push(`%${search}%`);
  }

  const sql = `
    SELECT
      p.player,
      p.position,
      p.team,
      m.league,
      COUNT(*) as games,
      SUM(p.won) as wins,
      ROUND(SUM(p.won) * 100.0 / COUNT(*), 1) as win_rate,
      ROUND(
        SUM(p.kills + p.assists) * 1.0 / NULLIF(SUM(p.deaths), 0),
        2
      ) as kda
    FROM participants p
    JOIN matches m ON p.game_id = m.game_id
    WHERE ${conditions.join(' AND ')}
    GROUP BY p.player, p.position
    ORDER BY games DESC
    LIMIT ?
  `;
  args.push(limit);

  const result = await db.execute({ sql, args });

  const normalizePosition = (pos: string): string => {
    const map: Record<string, string> = {
      top: 'top', jungle: 'jungle', mid: 'mid',
      bot: 'bot', adc: 'bot', sup: 'support', support: 'support'
    };
    return map[pos?.toLowerCase()] || pos;
  };

  return result.rows.map((row: any) => ({
    id: row.player,
    name: row.player,
    role: normalizePosition(row.position),
    team: row.team || '',
    league: row.league || '',
    games: row.games || 0,
    wins: row.wins || 0,
    winRate: row.win_rate || 0,
    kda: row.kda || 0,
  }));
}

// Fetch detailed player profile — all queries run in parallel for maximum speed
export async function getPlayerDetails(playerName: string): Promise<any | null> {
  // Fire all queries simultaneously instead of sequentially
  const [statsResult, championPoolResult, recentMatchesResult, leagueBreakdownResult, activityByYearResult, careerResult] = await Promise.all([
    // 1. Main aggregate stats
    db.execute({
      sql: `
        SELECT
          p.player,
          p.position,
          p.team,
          m.league,
          COUNT(*) as games,
          SUM(p.won) as wins,
          ROUND(SUM(p.won) * 100.0 / COUNT(*), 1) as win_rate,
          ROUND(SUM(p.kills + p.assists) * 1.0 / NULLIF(SUM(p.deaths), 0), 2) as kda,
          MIN(m.year) as first_year,
          MAX(m.year) as last_year
        FROM participants p
        JOIN matches m ON p.game_id = m.game_id
        WHERE p.player = ?
        GROUP BY p.player, p.position
        ORDER BY games DESC
        LIMIT 1
      `,
      args: [playerName]
    }),
    // 2. Champion pool (All-time, Playoffs, Worlds, MSI stats calculated using conditional aggregation)
    db.execute({
      sql: `
        SELECT
          p.champion,
          COUNT(*) as games,
          SUM(p.won) as wins,
          ROUND(SUM(p.won) * 100.0 / COUNT(*), 1) as win_rate,
          ROUND(SUM(p.kills + p.assists) * 1.0 / NULLIF(SUM(p.deaths), 0), 2) as kda,
          
          -- Playoffs stats
          SUM(CASE WHEN m.playoffs = 1 THEN 1 ELSE 0 END) as playoffs_games,
          SUM(CASE WHEN m.playoffs = 1 THEN p.won ELSE 0 END) as playoffs_wins,
          ROUND(SUM(CASE WHEN m.playoffs = 1 THEN p.kills + p.assists ELSE 0 END) * 1.0 / NULLIF(SUM(CASE WHEN m.playoffs = 1 THEN p.deaths ELSE 0 END), 0), 2) as playoffs_kda,

          -- Worlds stats (stored as 'WLDs' in the database)
          SUM(CASE WHEN UPPER(m.league) = 'WLDS' THEN 1 ELSE 0 END) as worlds_games,
          SUM(CASE WHEN UPPER(m.league) = 'WLDS' THEN p.won ELSE 0 END) as worlds_wins,
          ROUND(SUM(CASE WHEN UPPER(m.league) = 'WLDS' THEN p.kills + p.assists ELSE 0 END) * 1.0 / NULLIF(SUM(CASE WHEN UPPER(m.league) = 'WLDS' THEN p.deaths ELSE 0 END), 0), 2) as worlds_kda,

          -- MSI stats
          SUM(CASE WHEN UPPER(m.league) = 'MSI' THEN 1 ELSE 0 END) as msi_games,
          SUM(CASE WHEN UPPER(m.league) = 'MSI' THEN p.won ELSE 0 END) as msi_wins,
          ROUND(SUM(CASE WHEN UPPER(m.league) = 'MSI' THEN p.kills + p.assists ELSE 0 END) * 1.0 / NULLIF(SUM(CASE WHEN UPPER(m.league) = 'MSI' THEN p.deaths ELSE 0 END), 0), 2) as msi_kda
        FROM participants p
        JOIN matches m ON p.game_id = m.game_id
        WHERE p.player = ? AND p.champion != ''
        GROUP BY p.champion
        ORDER BY games DESC
      `,
      args: [playerName]
    }),
    // 3. Recent matches
    db.execute({
      sql: `
        SELECT
          m.game_id,
          m.date,
          m.league,
          p.champion,
          p.won,
          p.kills,
          p.deaths,
          p.assists
        FROM participants p
        JOIN matches m ON p.game_id = m.game_id
        WHERE p.player = ?
        ORDER BY m.date DESC
        LIMIT 10
      `,
      args: [playerName]
    }),
    // 4. League breakdown
    db.execute({
      sql: `
        SELECT
          m.league,
          COUNT(*) as games,
          ROUND(SUM(p.won) * 100.0 / COUNT(*), 1) as win_rate
        FROM participants p
        JOIN matches m ON p.game_id = m.game_id
        WHERE p.player = ?
        GROUP BY m.league
        ORDER BY games DESC
        LIMIT 8
      `,
      args: [playerName]
    }),
    // 5. Activity by year
    db.execute({
      sql: `
        SELECT
          m.year,
          COUNT(*) as games
        FROM participants p
        JOIN matches m ON p.game_id = m.game_id
        WHERE p.player = ?
        GROUP BY m.year
        ORDER BY m.year ASC
      `,
      args: [playerName]
    }),
    // 6. Career teams
    db.execute({
      sql: `
        SELECT DISTINCT p.team
        FROM participants p
        WHERE p.player = ? AND p.team != ''
        LIMIT 6
      `,
      args: [playerName]
    }),
  ]);

  if (statsResult.rows.length === 0) return null;
  const stats = statsResult.rows[0] as any;

  const normalizePosition = (pos: string): string => {
    const map: Record<string, string> = {
      top: 'top', jungle: 'jungle', mid: 'mid',
      bot: 'bot', adc: 'bot', sup: 'support', support: 'support'
    };
    return map[pos?.toLowerCase()] || 'mid';
  };

  const career = careerResult.rows.map((r: any) => r.team).join(' → ');

  const championPool = (championPoolResult.rows as any[]).map(row => ({
    champion: {
      id: row.champion,
      name: row.champion,
      role: normalizePosition(stats.position),
      imageUrl: formatChampionImage(row.champion),
      presence: 0, winRate: row.win_rate || 0, picks: row.games || 0, bans: 0
    },
    games: row.games || 0,
    winRate: row.win_rate || 0,
    kda: row.kda || 0,
    playoffsGames: row.playoffs_games || 0,
    playoffsWinRate: row.playoffs_games > 0 ? Math.round((row.playoffs_wins * 100.0 / row.playoffs_games) * 10) / 10 : 0,
    playoffsKda: row.playoffs_kda || 0,
    worldsGames: row.worlds_games || 0,
    worldsWinRate: row.worlds_games > 0 ? Math.round((row.worlds_wins * 100.0 / row.worlds_games) * 10) / 10 : 0,
    worldsKda: row.worlds_kda || 0,
    msiGames: row.msi_games || 0,
    msiWinRate: row.msi_games > 0 ? Math.round((row.msi_wins * 100.0 / row.msi_games) * 10) / 10 : 0,
    msiKda: row.msi_kda || 0,
  }));

  const recentMatches = (recentMatchesResult.rows as any[]).map(row => ({
    gameId: row.game_id || '',
    date: row.date || '',
    league: row.league || '',
    champion: {
      id: row.champion,
      name: row.champion,
      role: normalizePosition(stats.position),
      imageUrl: formatChampionImage(row.champion),
      presence: 0, winRate: 0, picks: 0, bans: 0
    },
    result: row.won === 1 ? 'win' : 'loss',
    kda: `${row.kills}/${row.deaths}/${row.assists}`,
  }));

  const leagueBreakdown = (leagueBreakdownResult.rows as any[]).map(row => ({
    league: row.league,
    games: row.games || 0,
    winRate: row.win_rate || 0,
  }));

  const activityByYear = (activityByYearResult.rows as any[]).map(row => ({
    year: row.year,
    games: row.games || 0,
  }));

  const firstYear = stats.first_year;
  const lastYear = stats.last_year;
  const yearsActive = firstYear === lastYear
    ? String(firstYear)
    : `${firstYear}–${lastYear}`;

  return {
    id: playerName,
    name: playerName,
    role: normalizePosition(stats.position),
    career,
    games: stats.games || 0,
    wins: stats.wins || 0,
    winRate: stats.win_rate || 0,
    kda: stats.kda || 0,
    firstYear,
    lastYear,
    yearsActive,
    championPool,
    recentMatches,
    leagueBreakdown,
    activityByYear,
  };
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

// Fetch multi champion synergy (3, 4, 5 champions)
export async function getChampionMultiSynergy(league: string = 'ALL', limit: number = 20, size: number = 3): Promise<any[]> {
  const table = `champion_synergy_${size}`;
  const cols = ['a', 'b', 'c', 'd', 'e'].slice(0, size).map(char => `champion_${char}`);

  const result = await db.execute({
    sql: `SELECT * FROM ${table} WHERE league = ? ORDER BY synergy_score DESC LIMIT ?`,
    args: [league, limit]
  });

  return result.rows.map((row: any) => {
    const championsList = cols.map(col => row[col]);
    return {
      champions: championsList,
      league: row.league,
      winsTogether: row.wins_together,
      gamesTogether: row.games_together,
      synergyScore: row.synergy_score,
      imageUrls: championsList.map(c => formatChampionImage(c))
    };
  });
}

// Fetch multi champion counters
export async function getChampionMultiCounters(
  league: string = 'ALL',
  limit: number = 20,
  size: number = 2,
  role1: string = 'Any',
  role2: string = 'Any'
): Promise<any[]> {
  const table = `champion_counter_${size}`;

  if (size === 2) {
    let sql = `SELECT * FROM ${table} WHERE league = ? AND games_against >= 5`;
    const args: any[] = [league];

    if (role1 !== 'Any' && role2 !== 'Any') {
      sql += ` AND (
        ((role_a1 = ? AND role_a2 = ?) OR (role_a1 = ? AND role_a2 = ?))
        AND
        ((role_b1 = ? AND role_b2 = ?) OR (role_b1 = ? AND role_b2 = ?))
      )`;
      args.push(role1, role2, role2, role1, role1, role2, role2, role1);
    }

    sql += ` ORDER BY counter_score DESC LIMIT ?`;
    args.push(limit);

    const result = await db.execute({ sql, args });
    return result.rows.map((row: any) => ({
      a1: row.a1,
      a2: row.a2,
      b1: row.b1,
      b2: row.b2,
      roleA1: row.role_a1,
      roleA2: row.role_a2,
      roleB1: row.role_b1,
      roleB2: row.role_b2,
      counterScore: row.counter_score,
      gamesAgainst: row.games_against,
      winsAgainst: row.wins_against,
      imageUrlA1: formatChampionImage(row.a1),
      imageUrlA2: formatChampionImage(row.a2),
      imageUrlB1: formatChampionImage(row.b1),
      imageUrlB2: formatChampionImage(row.b2),
    }));
  } else {
    const aCols = Array.from({ length: size }, (_, i) => `a${i + 1}`);
    const bCols = Array.from({ length: size }, (_, i) => `b${i + 1}`);

    const result = await db.execute({
      sql: `SELECT * FROM ${table} WHERE league = ? AND games_against >= 3 ORDER BY counter_score DESC LIMIT ?`,
      args: [league, limit]
    });

    return result.rows.map((row: any) => {
      const teamA = aCols.map(col => row[col]);
      const teamB = bCols.map(col => row[col]);
      return {
        teamA,
        teamB,
        counterScore: row.counter_score,
        gamesAgainst: row.games_against,
        winsAgainst: row.wins_against,
        imageUrlsA: teamA.map(c => formatChampionImage(c)),
        imageUrlsB: teamB.map(c => formatChampionImage(c)),
      };
    });
  }
}

// Fetch same-role head-to-head lane matchups
export async function getLaneMatchups(role: string, league: string = 'ALL', limit: number = 100): Promise<any[]> {
  const lc = league !== 'ALL' ? 'AND m.league = ?' : '';
  const args = [role, role];
  if (league !== 'ALL') args.push(league);

  const result = await db.execute({
    sql: `
      SELECT pb.champion AS champ_blue, pr.champion AS champ_red, pb.won AS blue_won
      FROM participants pb
      JOIN participants pr ON pb.game_id = pr.game_id
      JOIN matches m ON pb.game_id = m.game_id
      WHERE pb.side = 'blue' AND pb.position = ?
        AND pr.side = 'red'  AND pr.position = ?
        AND pb.champion != '' AND pr.champion != ''
        ${lc}
    `,
    args
  });

  const PRIOR_A = 5.0;
  const PRIOR_B = 5.0;
  const LCB_L = 1.0;

  const matchups: Record<string, { wins: number; games: number }> = {};

  for (const row of result.rows as any[]) {
    const a = row.champ_blue;
    const b = row.champ_red;
    const won = row.blue_won === 1;

    const key1 = `${a}_vs_${b}`;
    if (!matchups[key1]) matchups[key1] = { wins: 0, games: 0 };
    matchups[key1].games += 1;
    if (won) matchups[key1].wins += 1;

    const key2 = `${b}_vs_${a}`;
    if (!matchups[key2]) matchups[key2] = { wins: 0, games: 0 };
    matchups[key2].games += 1;
    if (!won) matchups[key2].wins += 1;
  }

  const list = Object.entries(matchups).map(([key, data]) => {
    const [a, b] = key.split('_vs_');
    const { wins, games } = data;

    const pa = PRIOR_A + wins;
    const pb_ = PRIOR_B + (games - wins);
    const tot = pa + pb_;
    const score = (pa / tot - LCB_L * Math.sqrt((pa * pb_) / (tot * tot * (tot + 1)))) * 100;

    return {
      championA: a,
      championB: b,
      wins,
      games,
      score: parseFloat(score.toFixed(2)),
      imageUrlA: formatChampionImage(a),
      imageUrlB: formatChampionImage(b),
      role
    };
  });

  return list.sort((x, y) => y.score - x.score).slice(0, limit);
}

// Fetch champion position/role mappings
export async function getChampionRoles(): Promise<Record<string, string>> {
  const result = await db.execute(`
    SELECT champion, position, COUNT(*) as cnt
    FROM participants
    WHERE champion != '' AND position != ''
    GROUP BY champion, position
  `);

  const best: Record<string, { pos: string; cnt: number }> = {};
  for (const row of result.rows as any[]) {
    const c = row.champion;
    const pos = row.position;
    const cnt = row.cnt;

    if (!best[c] || cnt > best[c].cnt) {
      best[c] = { pos, cnt };
    }
  }

  const mapping: Record<string, string> = {};
  for (const [c, val] of Object.entries(best)) {
    let role = val.pos.toLowerCase();
    if (role === 'sup') role = 'support';
    mapping[c] = role;
  }

  return mapping;
}

