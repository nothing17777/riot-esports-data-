'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export function HeroSection() {
  const { data, isLoading } = useSWR('/api/stats', fetcher)

  const stats = data?.stats ? [
    { label: 'Matches', value: formatNumber(data.stats.matches) },
    { label: 'Champions', value: data.stats.champions.toString() },
    { label: 'Players', value: formatNumber(data.stats.players) },
    { label: 'Leagues', value: data.stats.leagues.toString() },
    { label: 'Synergy Pairs', value: formatNumber(data.stats.synergyPairs) },
    { label: 'Counter Pairs', value: formatNumber(data.stats.counterPairs) },
  ] : []

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main Headline */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6 text-balance">
          Professional League of Legends
          <br />
          <span className="text-foreground-secondary">Analytics & Statistics</span>
        </h1>
        <p className="text-sm tracking-widest uppercase text-foreground-muted">
          {"Oracle's Elixir · 2014–2026 · Live Database Connected"}
        </p>
        {data?.success && (
          <p className="text-xs text-green-500 mt-2">
            Database: Connected
          </p>
        )}
      </div>

      {/* Stats Strip */}
      <div className="border-t border-b border-border py-6">
        {isLoading ? (
          <div className="text-center text-foreground-muted">Loading stats from database...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0 lg:divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:px-4">
                <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs tracking-widest uppercase text-foreground-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
