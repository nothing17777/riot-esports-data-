# ESPORTS.DATA — League of Legends Esports Analytics

Live site: [riot-esports-data.vercel.app](https://riot-esports-data.vercel.app)

A data analytics dashboard for professional League of Legends esports, covering 98,000+ pro matches from 2014–2026 across all major global leagues. Built with Next.js and backed by a Turso (libSQL) database, with data sourced from Oracle's Elixir.

## Features

- **Champion presence** — pick/ban rates and appearance frequency across leagues
- **Champion synergy** — best-performing champion pairings
- **Champion counters** — matchups that favor one champion over another
- **Lane matchups** — head-to-head performance by role
- **Win rates** — champion win rate breakdowns
- **Match history** — browsable match list with detailed match view
- **Player profiles** — pro player stats and history
- **League filtering** — filter data by competitive league
- **Light/dark theme**

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) with Radix UI primitives (shadcn/ui-style components)
- [Turso](https://turso.tech/) (libSQL) as the database, via `@libsql/client`
- Framer Motion, Recharts, react-hook-form, zod
- Deployed on Vercel, with Vercel Analytics

## Project Structure

```
app/
  api/                 # REST API routes (Next.js Route Handlers)
    champions/         # presence, synergy, counters, lane-matchups, winrates
    matches/           # match list + match detail by id
    players/           # player list + player detail by name
    stats/             # aggregate database stats + league list
    db-data/           # raw DB data inspection
    db-schema/         # DB schema inspection
    db-test/           # DB connection health check
  db-status/           # DB status/debug page
  page.tsx             # main dashboard page
  layout.tsx           # root layout, fonts, theme provider

components/            # dashboard sections + UI components (shadcn/ui)
hooks/                 # custom React hooks
lib/
  db.js                # Turso/libSQL client
  db-queries.ts         # all SQL query functions
  data.ts               # shared types and static data
  utils.ts
public/                 # icons and static assets
styles/                 # global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech/) database (or another libSQL-compatible database)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/nothing17777/riot-esports-data-.git
   cd riot-esports-data-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Copy `.env.example` to `.env.local` and fill in your Turso credentials:
   ```bash
   cp .env.example .env.local
   ```
   ```
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your_auth_token
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## API Routes

| Route | Description |
| --- | --- |
| `GET /api/stats` | Aggregate database stats + list of leagues |
| `GET /api/champions/presence` | Champion pick/appearance data |
| `GET /api/champions/synergy` | Champion pairing synergy data |
| `GET /api/champions/counters` | Champion counter matchup data |
| `GET /api/champions/lane-matchups` | Lane-vs-lane matchup data |
| `GET /api/champions/winrates` | Champion win rate data |
| `GET /api/matches` | List of matches |
| `GET /api/matches/[id]` | Details for a single match |
| `GET /api/players` | List of pro players |
| `GET /api/players/[name]` | Details for a single player |
| `GET /api/db-status`, `/api/db-schema`, `/api/db-test` | Database inspection/health endpoints |

## Data Source

Match and player data is sourced from [Oracle's Elixir](https://oracleselixir.com/), covering professional League of Legends matches from 2014–2026.

## License

No license specified.
