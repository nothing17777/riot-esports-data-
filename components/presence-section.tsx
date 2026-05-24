'use client'

import { useState, useMemo } from 'react'
import { Search, Database } from 'lucide-react'
import useSWR from 'swr'
import type { ChampionPresence } from '@/lib/db-queries'
import { PresenceBar, ScoreBar } from './score-bar'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface PresenceSectionProps {
  onChampionClick?: (champion: any) => void
}

export function PresenceSection({ onChampionClick }: PresenceSectionProps) {
  const [sortBy, setSortBy] = useState<'presence' | 'winRate' | 'picks' | 'bans'>('presence')
  const [minPicks, setMinPicks] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useSWR('/api/champions/presence?limit=100', fetcher)

  const filteredChampions = useMemo(() => {
    if (!data?.data) return []
    
    let filtered = (data.data as ChampionPresence[]).filter(
      (c) => c.picks >= minPicks && c.champion.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'presence':
          return b.presence - a.presence
        case 'winRate':
          return b.winRate - a.winRate
        case 'picks':
          return b.picks - a.picks
        case 'bans':
          return b.bans - a.bans
        default:
          return 0
      }
    })
  }, [data, sortBy, minPicks, searchQuery])

  return (
    <section id="presence" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Presence</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground-secondary">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground focus:outline-none focus:border-foreground-muted"
          >
            <option value="presence">Presence</option>
            <option value="winRate">Win Rate</option>
            <option value="picks">Picks</option>
            <option value="bans">Bans</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground-secondary">Min Picks:</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={minPicks}
            onChange={(e) => setMinPicks(Number(e.target.value))}
            className="w-24 accent-foreground"
          />
          <span className="font-mono text-sm text-foreground-muted w-16">{minPicks.toLocaleString()}</span>
        </div>

        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-foreground-muted">
          Loading champion data from database...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-red-500">
          Error loading data: {error.message}
        </div>
      )}

      {/* Champion List */}
      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">Champion</div>
            <div className="col-span-2">Presence</div>
            <div className="col-span-2">Win Rate</div>
            <div className="col-span-2 text-right">Picks</div>
            <div className="col-span-2 text-right">Bans</div>
          </div>

          {filteredChampions.length === 0 ? (
            <div className="text-center py-8 text-foreground-muted">
              No champions found matching your criteria
            </div>
          ) : (
            filteredChampions.map((champion, index) => (
              <div
                key={`${champion.champion}-${champion.league}`}
                onClick={() => onChampionClick?.({
                  id: champion.champion,
                  name: champion.champion,
                  imageUrl: champion.imageUrl,
                  presence: champion.presence,
                  winRate: champion.winRate,
                  picks: champion.picks,
                  bans: champion.bans,
                  role: 'mid'
                })}
                className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150 cursor-pointer"
              >
                {/* Rank */}
                <div className="hidden md:flex col-span-1 items-center justify-center">
                  <span className={`font-mono text-sm ${
                    index === 0 ? 'text-amber' :
                    index === 1 ? 'text-foreground-secondary' :
                    index === 2 ? 'text-amber' :
                    'text-foreground-muted'
                  }`}>
                    {index + 1}
                  </span>
                </div>

                {/* Champion */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                  <img 
                    src={champion.imageUrl} 
                    alt={champion.champion}
                    className="w-8 h-8 rounded-full border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="text-sm text-foreground font-medium">{champion.champion}</span>
                </div>

                {/* Presence */}
                <div className="hidden md:flex col-span-2 items-center gap-2">
                  <PresenceBar value={champion.presence} width={60} />
                  <span className="font-mono text-sm text-foreground">{champion.presence.toFixed(1)}%</span>
                </div>

                {/* Win Rate */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-2 justify-end md:justify-start">
                  <ScoreBar value={champion.winRate} width={60} />
                  <span className={`font-mono text-sm ${
                    champion.winRate >= 55 ? 'text-win' :
                    champion.winRate >= 50 ? 'text-amber' :
                    'text-loss'
                  }`}>
                    {champion.winRate.toFixed(1)}%
                  </span>
                </div>

                {/* Picks */}
                <div className="hidden md:flex col-span-2 items-center justify-end">
                  <span className="font-mono text-sm text-foreground-secondary">{champion.picks.toLocaleString()}</span>
                </div>

                {/* Bans */}
                <div className="hidden md:flex col-span-2 items-center justify-end">
                  <span className="font-mono text-sm text-foreground-secondary">{champion.bans.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}

          {/* Total count */}
          <div className="pt-4 text-sm text-foreground-muted">
            Showing {filteredChampions.length} champions from database
          </div>
        </div>
      )}
    </section>
  )
}
