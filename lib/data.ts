// Mock data for the esports analytics dashboard

export interface Champion {
  id: string
  name: string
  role: 'top' | 'jungle' | 'mid' | 'bot' | 'support'
  imageUrl: string
  presence: number
  winRate: number
  picks: number
  bans: number
}

export interface SynergyPair {
  id: string
  champions: Champion[]
  score: number
  wins: number
  games: number
}

export interface CounterPair {
  id: string
  winner: Champion[]
  loser: Champion[]
  score: number
  wins: number
  games: number
}

export interface LaneMatchup {
  id: string
  championA: Champion
  championB: Champion
  role: 'top' | 'jungle' | 'mid' | 'bot' | 'support'
  score: number
  wins: number
  games: number
}

export interface Match {
  id: string
  date: string
  league: string
  patch: string
  blueTeam: string
  redTeam: string
  winner: 'blue' | 'red'
  duration: string
  playoffs: boolean
}

export interface MatchParticipant {
  player: string
  playerId: string
  position: 'top' | 'jungle' | 'mid' | 'bot' | 'support'
  champion: Champion
  kills: number
  deaths: number
  assists: number
  cs: number
  gold: number
  visionScore: number
  kda: number
}

export interface TeamData {
  team: string
  won: boolean
  players: MatchParticipant[]
  bans: Champion[]
  totals: {
    kills: number
    deaths: number
    gold: number
  }
}

export interface MatchDetail {
  gameId: string
  league: string
  date: string
  patch: string
  duration: string
  playoffs: boolean
  winner: 'blue' | 'red'
  blue: TeamData
  red: TeamData
}

export interface Player {
  id: string
  name: string
  role: 'top' | 'jungle' | 'mid' | 'bot' | 'support'
  career: string
  games: number
  wins: number
  winRate: number
  kda: number
  yearsActive: string
  championPool: PlayerChampion[]
  recentMatches: PlayerMatch[]
  leagueBreakdown: LeagueStats[]
  activityByYear: YearActivity[]
}

export interface PlayerChampion {
  champion: Champion
  games: number
  winRate: number
  kda: number
}

export interface PlayerMatch {
  date: string
  league: string
  champion: Champion
  result: 'win' | 'loss'
  kda: string
}

export interface LeagueStats {
  league: string
  games: number
  winRate: number
}

export interface YearActivity {
  year: number
  games: number
}

const DATADRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion'

export const champions: Champion[] = [
  { id: '1', name: 'Azir', role: 'mid', imageUrl: `${DATADRAGON_BASE}/Azir.png`, presence: 89.2, winRate: 52.4, picks: 4521, bans: 3892 },
  { id: '2', name: 'Jinx', role: 'bot', imageUrl: `${DATADRAGON_BASE}/Jinx.png`, presence: 85.7, winRate: 54.1, picks: 4102, bans: 3421 },
  { id: '3', name: 'Thresh', role: 'support', imageUrl: `${DATADRAGON_BASE}/Thresh.png`, presence: 82.3, winRate: 49.8, picks: 5892, bans: 2103 },
  { id: '4', name: "K'Sante", role: 'top', imageUrl: `${DATADRAGON_BASE}/KSante.png`, presence: 79.6, winRate: 47.2, picks: 3892, bans: 4521 },
  { id: '5', name: 'Lee Sin', role: 'jungle', imageUrl: `${DATADRAGON_BASE}/LeeSin.png`, presence: 78.4, winRate: 51.3, picks: 6721, bans: 1892 },
  { id: '6', name: 'Orianna', role: 'mid', imageUrl: `${DATADRAGON_BASE}/Orianna.png`, presence: 76.1, winRate: 50.2, picks: 5421, bans: 2341 },
  { id: '7', name: "Kai'Sa", role: 'bot', imageUrl: `${DATADRAGON_BASE}/Kaisa.png`, presence: 74.8, winRate: 53.7, picks: 4892, bans: 2892 },
  { id: '8', name: 'Renekton', role: 'top', imageUrl: `${DATADRAGON_BASE}/Renekton.png`, presence: 72.3, winRate: 48.9, picks: 5102, bans: 2103 },
  { id: '9', name: 'Nautilus', role: 'support', imageUrl: `${DATADRAGON_BASE}/Nautilus.png`, presence: 71.6, winRate: 51.8, picks: 4521, bans: 2521 },
  { id: '10', name: 'Viego', role: 'jungle', imageUrl: `${DATADRAGON_BASE}/Viego.png`, presence: 69.4, winRate: 52.1, picks: 3892, bans: 3102 },
  { id: '11', name: 'Ahri', role: 'mid', imageUrl: `${DATADRAGON_BASE}/Ahri.png`, presence: 67.8, winRate: 51.9, picks: 4102, bans: 2341 },
  { id: '12', name: 'Aphelios', role: 'bot', imageUrl: `${DATADRAGON_BASE}/Aphelios.png`, presence: 65.2, winRate: 49.3, picks: 3521, bans: 2892 },
  { id: '13', name: 'Jax', role: 'top', imageUrl: `${DATADRAGON_BASE}/Jax.png`, presence: 63.7, winRate: 54.2, picks: 3892, bans: 2521 },
  { id: '14', name: 'Elise', role: 'jungle', imageUrl: `${DATADRAGON_BASE}/Elise.png`, presence: 61.4, winRate: 50.7, picks: 4102, bans: 1892 },
  { id: '15', name: 'Lulu', role: 'support', imageUrl: `${DATADRAGON_BASE}/Lulu.png`, presence: 59.8, winRate: 52.6, picks: 3892, bans: 2103 },
  { id: '16', name: 'Syndra', role: 'mid', imageUrl: `${DATADRAGON_BASE}/Syndra.png`, presence: 58.2, winRate: 48.4, picks: 3521, bans: 2341 },
  { id: '17', name: 'Zeri', role: 'bot', imageUrl: `${DATADRAGON_BASE}/Zeri.png`, presence: 56.7, winRate: 46.8, picks: 2892, bans: 3102 },
  { id: '18', name: 'Gnar', role: 'top', imageUrl: `${DATADRAGON_BASE}/Gnar.png`, presence: 54.3, winRate: 50.1, picks: 3892, bans: 1521 },
  { id: '19', name: 'Jarvan IV', role: 'jungle', imageUrl: `${DATADRAGON_BASE}/JarvanIV.png`, presence: 52.8, winRate: 49.4, picks: 3521, bans: 1892 },
  { id: '20', name: 'Rakan', role: 'support', imageUrl: `${DATADRAGON_BASE}/Rakan.png`, presence: 51.2, winRate: 53.1, picks: 3102, bans: 2103 },
]

export const synergyPairs: Record<number, SynergyPair[]> = {
  2: [
    { id: 's1', champions: [champions[1], champions[2]], score: 67.8, wins: 892, games: 1341 },
    { id: 's2', champions: [champions[6], champions[14]], score: 65.2, wins: 721, games: 1102 },
    { id: 's3', champions: [champions[0], champions[4]], score: 63.4, wins: 654, games: 1032 },
    { id: 's4', champions: [champions[11], champions[8]], score: 61.7, wins: 589, games: 954 },
    { id: 's5', champions: [champions[3], champions[9]], score: 59.8, wins: 521, games: 872 },
    { id: 's6', champions: [champions[5], champions[13]], score: 58.2, wins: 478, games: 821 },
    { id: 's7', champions: [champions[7], champions[18]], score: 56.9, wins: 432, games: 759 },
    { id: 's8', champions: [champions[10], champions[19]], score: 55.4, wins: 398, games: 718 },
  ],
  3: [
    { id: 's9', champions: [champions[0], champions[4], champions[6]], score: 71.2, wins: 421, games: 591 },
    { id: 's10', champions: [champions[1], champions[2], champions[5]], score: 68.4, wins: 389, games: 569 },
    { id: 's11', champions: [champions[3], champions[9], champions[14]], score: 65.7, wins: 342, games: 521 },
    { id: 's12', champions: [champions[7], champions[13], champions[8]], score: 62.3, wins: 298, games: 478 },
  ],
  4: [
    { id: 's13', champions: [champions[0], champions[4], champions[6], champions[14]], score: 74.6, wins: 287, games: 385 },
    { id: 's14', champions: [champions[3], champions[9], champions[1], champions[2]], score: 71.8, wins: 254, games: 354 },
  ],
  5: [
    { id: 's15', champions: [champions[3], champions[4], champions[0], champions[1], champions[2]], score: 78.2, wins: 189, games: 242 },
    { id: 's16', champions: [champions[7], champions[9], champions[5], champions[6], champions[14]], score: 75.4, wins: 167, games: 221 },
  ],
}

export const counterPairs: Record<string, CounterPair[]> = {
  '1v1': [
    { id: 'c1', winner: [champions[0]], loser: [champions[5]], score: 58.7, wins: 892, games: 1521 },
    { id: 'c2', winner: [champions[4]], loser: [champions[9]], score: 56.2, wins: 721, games: 1283 },
    { id: 'c3', winner: [champions[1]], loser: [champions[11]], score: 55.4, wins: 654, games: 1181 },
    { id: 'c4', winner: [champions[3]], loser: [champions[7]], score: 54.8, wins: 589, games: 1075 },
    { id: 'c5', winner: [champions[2]], loser: [champions[8]], score: 53.9, wins: 521, games: 967 },
    { id: 'c6', winner: [champions[13]], loser: [champions[18]], score: 53.2, wins: 478, games: 899 },
  ],
  '2v2': [
    { id: 'c7', winner: [champions[1], champions[2]], loser: [champions[11], champions[8]], score: 62.4, wins: 432, games: 692 },
    { id: 'c8', winner: [champions[6], champions[14]], loser: [champions[16], champions[19]], score: 59.8, wins: 389, games: 651 },
    { id: 'c9', winner: [champions[3], champions[4]], loser: [champions[7], champions[9]], score: 57.2, wins: 342, games: 598 },
    { id: 'c10', winner: [champions[0], champions[13]], loser: [champions[5], champions[18]], score: 55.6, wins: 298, games: 536 },
  ],
  '3v3': [
    { id: 'c11', winner: [champions[0], champions[4], champions[3]], loser: [champions[5], champions[9], champions[7]], score: 64.8, wins: 254, games: 392 },
    { id: 'c12', winner: [champions[1], champions[2], champions[13]], loser: [champions[11], champions[8], champions[18]], score: 61.2, wins: 221, games: 361 },
  ],
  '4v4': [
    { id: 'c13', winner: [champions[0], champions[4], champions[1], champions[2]], loser: [champions[5], champions[9], champions[11], champions[8]], score: 67.4, wins: 189, games: 280 },
  ],
  '5v5': [
    { id: 'c14', winner: [champions[3], champions[4], champions[0], champions[1], champions[2]], loser: [champions[7], champions[9], champions[5], champions[11], champions[8]], score: 71.2, wins: 142, games: 199 },
  ],
}

export const laneMatchups: LaneMatchup[] = [
  { id: 'l1', championA: champions[3], championB: champions[7], role: 'top', score: 56.8, wins: 892, games: 1571 },
  { id: 'l2', championA: champions[7], championB: champions[12], role: 'top', score: 52.4, wins: 721, games: 1376 },
  { id: 'l3', championA: champions[12], championB: champions[17], role: 'top', score: 54.1, wins: 654, games: 1209 },
  { id: 'l4', championA: champions[4], championB: champions[9], role: 'jungle', score: 55.7, wins: 589, games: 1058 },
  { id: 'l5', championA: champions[9], championB: champions[13], role: 'jungle', score: 51.2, wins: 521, games: 1018 },
  { id: 'l6', championA: champions[13], championB: champions[18], role: 'jungle', score: 53.8, wins: 478, games: 889 },
  { id: 'l7', championA: champions[0], championB: champions[5], role: 'mid', score: 57.4, wins: 892, games: 1554 },
  { id: 'l8', championA: champions[5], championB: champions[10], role: 'mid', score: 49.8, wins: 654, games: 1313 },
  { id: 'l9', championA: champions[10], championB: champions[15], role: 'mid', score: 52.6, wins: 521, games: 991 },
  { id: 'l10', championA: champions[1], championB: champions[6], role: 'bot', score: 51.8, wins: 892, games: 1722 },
  { id: 'l11', championA: champions[6], championB: champions[11], role: 'bot', score: 54.9, wins: 721, games: 1313 },
  { id: 'l12', championA: champions[11], championB: champions[16], role: 'bot', score: 56.2, wins: 589, games: 1048 },
  { id: 'l13', championA: champions[2], championB: champions[8], role: 'support', score: 52.1, wins: 892, games: 1713 },
  { id: 'l14', championA: champions[8], championB: champions[14], role: 'support', score: 48.7, wins: 654, games: 1343 },
  { id: 'l15', championA: champions[14], championB: champions[19], role: 'support', score: 50.9, wins: 521, games: 1023 },
]

export const matches: Match[] = [
  { id: 'm1', date: '2026-01-15', league: 'LCK', patch: '14.1', blueTeam: 'T1', redTeam: 'Gen.G', winner: 'blue', duration: '32:45', playoffs: false },
  { id: 'm2', date: '2026-01-15', league: 'LCK', patch: '14.1', blueTeam: 'DRX', redTeam: 'KT Rolster', winner: 'red', duration: '28:12', playoffs: false },
  { id: 'm3', date: '2026-01-14', league: 'LEC', patch: '14.1', blueTeam: 'G2 Esports', redTeam: 'Fnatic', winner: 'blue', duration: '35:21', playoffs: false },
  { id: 'm4', date: '2026-01-14', league: 'LEC', patch: '14.1', blueTeam: 'MAD Lions', redTeam: 'Team Vitality', winner: 'red', duration: '41:08', playoffs: false },
  { id: 'm5', date: '2026-01-13', league: 'LPL', patch: '14.1', blueTeam: 'JDG', redTeam: 'BLG', winner: 'blue', duration: '29:54', playoffs: false },
  { id: 'm6', date: '2026-01-13', league: 'LPL', patch: '14.1', blueTeam: 'Weibo Gaming', redTeam: 'Top Esports', winner: 'blue', duration: '33:17', playoffs: false },
  { id: 'm7', date: '2026-01-12', league: 'LCS', patch: '14.1', blueTeam: 'Cloud9', redTeam: 'Team Liquid', winner: 'red', duration: '37:42', playoffs: false },
  { id: 'm8', date: '2026-01-12', league: 'LCS', patch: '14.1', blueTeam: '100 Thieves', redTeam: 'FlyQuest', winner: 'blue', duration: '30:28', playoffs: false },
  { id: 'm9', date: '2025-11-05', league: 'Worlds', patch: '13.21', blueTeam: 'T1', redTeam: 'Weibo Gaming', winner: 'blue', duration: '34:56', playoffs: true },
  { id: 'm10', date: '2025-11-04', league: 'Worlds', patch: '13.21', blueTeam: 'JDG', redTeam: 'Gen.G', winner: 'red', duration: '42:13', playoffs: true },
]

export const players: Player[] = [
  {
    id: 'p1',
    name: 'Faker',
    role: 'mid',
    career: 'SK Telecom T1 → T1',
    games: 1892,
    wins: 1124,
    winRate: 59.4,
    kda: 4.21,
    yearsActive: '2013–2026',
    championPool: [
      { champion: champions[0], games: 342, winRate: 58.2, kda: 4.5 },
      { champion: champions[5], games: 289, winRate: 54.7, kda: 3.9 },
      { champion: champions[10], games: 256, winRate: 61.3, kda: 4.8 },
      { champion: champions[15], games: 198, winRate: 52.1, kda: 3.7 },
    ],
    recentMatches: [
      { date: '2026-01-15', league: 'LCK', champion: champions[0], result: 'win', kda: '5/2/8' },
      { date: '2026-01-12', league: 'LCK', champion: champions[5], result: 'win', kda: '3/1/12' },
      { date: '2026-01-08', league: 'LCK', champion: champions[0], result: 'loss', kda: '2/4/5' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 1421, winRate: 61.2 },
      { league: 'Worlds', games: 287, winRate: 58.9 },
      { league: 'MSI', games: 184, winRate: 54.3 },
    ],
    activityByYear: [
      { year: 2013, games: 89 }, { year: 2014, games: 124 }, { year: 2015, games: 156 },
      { year: 2016, games: 142 }, { year: 2017, games: 168 }, { year: 2018, games: 134 },
      { year: 2019, games: 145 }, { year: 2020, games: 132 }, { year: 2021, games: 148 },
      { year: 2022, games: 156 }, { year: 2023, games: 178 }, { year: 2024, games: 165 },
      { year: 2025, games: 142 }, { year: 2026, games: 13 },
    ],
  },
  {
    id: 'p2',
    name: 'Chovy',
    role: 'mid',
    career: 'Griffin → DRX → Hanwha Life → Gen.G',
    games: 1245,
    wins: 721,
    winRate: 57.9,
    kda: 4.87,
    yearsActive: '2018–2026',
    championPool: [
      { champion: champions[0], games: 287, winRate: 56.4, kda: 5.1 },
      { champion: champions[5], games: 234, winRate: 58.1, kda: 4.6 },
      { champion: champions[15], games: 198, winRate: 54.2, kda: 4.2 },
    ],
    recentMatches: [
      { date: '2026-01-15', league: 'LCK', champion: champions[0], result: 'loss', kda: '4/3/6' },
      { date: '2026-01-11', league: 'LCK', champion: champions[5], result: 'win', kda: '6/1/9' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 1089, winRate: 58.4 },
      { league: 'Worlds', games: 112, winRate: 52.7 },
    ],
    activityByYear: [
      { year: 2018, games: 78 }, { year: 2019, games: 142 }, { year: 2020, games: 156 },
      { year: 2021, games: 148 }, { year: 2022, games: 168 }, { year: 2023, games: 189 },
      { year: 2024, games: 178 }, { year: 2025, games: 176 }, { year: 2026, games: 10 },
    ],
  },
  {
    id: 'p3',
    name: 'Zeus',
    role: 'top',
    career: 'T1',
    games: 687,
    wins: 412,
    winRate: 60.0,
    kda: 3.54,
    yearsActive: '2021–2026',
    championPool: [
      { champion: champions[3], games: 156, winRate: 58.3, kda: 3.2 },
      { champion: champions[7], games: 134, winRate: 54.5, kda: 3.1 },
      { champion: champions[12], games: 98, winRate: 62.2, kda: 4.1 },
    ],
    recentMatches: [
      { date: '2026-01-15', league: 'LCK', champion: champions[3], result: 'win', kda: '4/2/7' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 542, winRate: 61.4 },
      { league: 'Worlds', games: 98, winRate: 56.1 },
    ],
    activityByYear: [
      { year: 2021, games: 89 }, { year: 2022, games: 134 }, { year: 2023, games: 168 },
      { year: 2024, games: 156 }, { year: 2025, games: 132 }, { year: 2026, games: 8 },
    ],
  },
  {
    id: 'p4',
    name: 'Ruler',
    role: 'bot',
    career: 'Samsung Galaxy → Gen.G → JDG',
    games: 1356,
    wins: 798,
    winRate: 58.8,
    kda: 5.12,
    yearsActive: '2016–2026',
    championPool: [
      { champion: champions[1], games: 287, winRate: 59.2, kda: 5.4 },
      { champion: champions[6], games: 234, winRate: 57.3, kda: 4.9 },
      { champion: champions[11], games: 189, winRate: 55.6, kda: 4.7 },
    ],
    recentMatches: [
      { date: '2026-01-13', league: 'LPL', champion: champions[1], result: 'win', kda: '8/1/5' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 892, winRate: 59.4 },
      { league: 'LPL', games: 312, winRate: 57.1 },
      { league: 'Worlds', games: 152, winRate: 58.6 },
    ],
    activityByYear: [
      { year: 2016, games: 89 }, { year: 2017, games: 134 }, { year: 2018, games: 142 },
      { year: 2019, games: 156 }, { year: 2020, games: 148 }, { year: 2021, games: 132 },
      { year: 2022, games: 145 }, { year: 2023, games: 168 }, { year: 2024, games: 142 },
      { year: 2025, games: 92 }, { year: 2026, games: 8 },
    ],
  },
  {
    id: 'p5',
    name: 'Keria',
    role: 'support',
    career: 'DRX → T1',
    games: 892,
    wins: 534,
    winRate: 59.9,
    kda: 4.67,
    yearsActive: '2020–2026',
    championPool: [
      { champion: champions[2], games: 198, winRate: 61.1, kda: 4.9 },
      { champion: champions[8], games: 156, winRate: 57.7, kda: 4.2 },
      { champion: champions[14], games: 134, winRate: 58.2, kda: 5.1 },
    ],
    recentMatches: [
      { date: '2026-01-15', league: 'LCK', champion: champions[2], result: 'win', kda: '1/2/14' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 756, winRate: 60.6 },
      { league: 'Worlds', games: 98, winRate: 55.1 },
    ],
    activityByYear: [
      { year: 2020, games: 98 }, { year: 2021, games: 142 }, { year: 2022, games: 156 },
      { year: 2023, games: 178 }, { year: 2024, games: 168 }, { year: 2025, games: 142 },
      { year: 2026, games: 8 },
    ],
  },
  {
    id: 'p6',
    name: 'Canyon',
    role: 'jungle',
    career: 'DAMWON Gaming → DWG KIA → Dplus KIA',
    games: 1087,
    wins: 654,
    winRate: 60.2,
    kda: 4.34,
    yearsActive: '2019–2026',
    championPool: [
      { champion: champions[4], games: 234, winRate: 58.5, kda: 4.2 },
      { champion: champions[9], games: 198, winRate: 61.1, kda: 4.6 },
      { champion: champions[13], games: 156, winRate: 57.1, kda: 3.9 },
    ],
    recentMatches: [
      { date: '2026-01-14', league: 'LCK', champion: champions[4], result: 'win', kda: '5/2/11' },
    ],
    leagueBreakdown: [
      { league: 'LCK', games: 912, winRate: 61.3 },
      { league: 'Worlds', games: 134, winRate: 56.7 },
    ],
    activityByYear: [
      { year: 2019, games: 89 }, { year: 2020, games: 156 }, { year: 2021, games: 168 },
      { year: 2022, games: 178 }, { year: 2023, games: 189 }, { year: 2024, games: 168 },
      { year: 2025, games: 132 }, { year: 2026, games: 7 },
    ],
  },
]

export const leagues = [
  'All Leagues',
  'LCK',
  'LPL',
  'LEC',
  'LCS',
  'Worlds',
  'MSI',
  'PCS',
  'VCS',
  'CBLOL',
]

export const stats = [
  { label: 'Matches', value: '98,421' },
  { label: 'Champions', value: '168' },
  { label: 'Players', value: '4,892' },
  { label: 'Leagues', value: '47' },
  { label: 'Years', value: '13' },
  { label: 'Bans', value: '1.2M' },
  { label: 'Synergy Pairs', value: '24,521' },
  { label: 'Counter Pairs', value: '18,942' },
]

// Mock match detail data generator
export function getMatchDetail(matchId: string): MatchDetail | null {
  const match = matches.find(m => m.id === matchId)
  if (!match) return null

  // Generate consistent mock data based on match
  const positionOrder: Array<'top' | 'jungle' | 'mid' | 'bot' | 'support'> = ['top', 'jungle', 'mid', 'bot', 'support']
  
  const blueChampions = [champions[3], champions[4], champions[0], champions[1], champions[2]]
  const redChampions = [champions[7], champions[9], champions[5], champions[6], champions[8]]
  const blueBans = [champions[10], champions[11], champions[12], champions[13], champions[14]]
  const redBans = [champions[15], champions[16], champions[17], champions[18], champions[19]]

  const bluePlayers = [
    { name: 'Zeus', id: 'p3' },
    { name: 'Oner', id: 'p7' },
    { name: 'Faker', id: 'p1' },
    { name: 'Gumayusi', id: 'p8' },
    { name: 'Keria', id: 'p5' },
  ]

  const redPlayers = [
    { name: 'Kiin', id: 'p9' },
    { name: 'Canyon', id: 'p6' },
    { name: 'Chovy', id: 'p2' },
    { name: 'Peyz', id: 'p10' },
    { name: 'Lehends', id: 'p11' },
  ]

  const generateStats = (isWinner: boolean, index: number) => {
    const baseKills = isWinner ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 4) + 1
    const baseDeaths = isWinner ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 5) + 2
    const baseAssists = Math.floor(Math.random() * 10) + 3
    return {
      kills: baseKills,
      deaths: baseDeaths,
      assists: baseAssists,
      cs: index === 1 ? Math.floor(Math.random() * 50) + 80 : Math.floor(Math.random() * 100) + 200,
      gold: Math.floor(Math.random() * 5000) + 12000,
      visionScore: Math.floor(Math.random() * 30) + 15,
      kda: baseDeaths > 0 ? Math.round(((baseKills + baseAssists) / baseDeaths) * 10) / 10 : baseKills + baseAssists,
    }
  }

  const blueIsWinner = match.winner === 'blue'

  const bluePlayerData: MatchParticipant[] = positionOrder.map((pos, i) => {
    const stats = generateStats(blueIsWinner, i)
    return {
      player: bluePlayers[i].name,
      playerId: bluePlayers[i].id,
      position: pos,
      champion: blueChampions[i],
      ...stats,
    }
  })

  const redPlayerData: MatchParticipant[] = positionOrder.map((pos, i) => {
    const stats = generateStats(!blueIsWinner, i)
    return {
      player: redPlayers[i].name,
      playerId: redPlayers[i].id,
      position: pos,
      champion: redChampions[i],
      ...stats,
    }
  })

  const blueTotals = {
    kills: bluePlayerData.reduce((sum, p) => sum + p.kills, 0),
    deaths: bluePlayerData.reduce((sum, p) => sum + p.deaths, 0),
    gold: bluePlayerData.reduce((sum, p) => sum + p.gold, 0),
  }

  const redTotals = {
    kills: redPlayerData.reduce((sum, p) => sum + p.kills, 0),
    deaths: redPlayerData.reduce((sum, p) => sum + p.deaths, 0),
    gold: redPlayerData.reduce((sum, p) => sum + p.gold, 0),
  }

  return {
    gameId: match.id,
    league: match.league,
    date: match.date,
    patch: match.patch,
    duration: match.duration,
    playoffs: match.playoffs,
    winner: match.winner,
    blue: {
      team: match.blueTeam,
      won: blueIsWinner,
      players: bluePlayerData,
      bans: blueBans,
      totals: blueTotals,
    },
    red: {
      team: match.redTeam,
      won: !blueIsWinner,
      players: redPlayerData,
      bans: redBans,
      totals: redTotals,
    },
  }
}
