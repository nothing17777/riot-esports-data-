'use client'

import { useState, useMemo } from 'react'
import { Search, Database, ChevronDown, ChevronUp } from 'lucide-react'
import useSWR from 'swr'
import type { ChampionWinRate } from '@/lib/db-queries'
import type { Champion } from '@/lib/data'
import { ScoreBar } from './score-bar'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface WinRatesSectionProps {
  onChampionClick: (champion: Champion) => void
}

function makeChampionObj(row: ChampionWinRate): any {
  return { id: row.champion, name: row.champion, imageUrl: row.imageUrl, role: 'mid', presence: 0, winRate: row.winRate, picks: row.games, bans: 0 }
}

export function WinRatesSection({ onChampionClick }: WinRatesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [minGames, setMinGames] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const { data, isLoading, error } = useSWR('/api/champions/winrates?limit=250', fetcher)

  const filteredChampions = useMemo(() => {
    if (!data?.data) return []
    let filtered = data.data as ChampionWinRate[]
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.champion.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply min games filter
    filtered = filtered.filter((c) => c.games >= minGames)

    return filtered.sort((a, b) => b.winRate - a.winRate)
  }, [data, searchQuery, minGames])

  return (
    <section id="win-rates" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Win Rates</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Filters Grid */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowAll(false); }}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted"
          />
        </div>

        {/* Min Games Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs tracking-wider uppercase text-foreground-muted">Min Games:</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={minGames}
            onChange={(e) => { setMinGames(Number(e.target.value)); setShowAll(false); }}
            className="w-28 accent-foreground"
          />
          <span className="font-mono text-sm text-foreground w-12 text-right">{minGames}</span>
        </div>
      </div>

      {isLoading && <div className="text-center py-12 text-foreground-muted">Loading win rate data...</div>}
      {error && <div className="text-center py-12 text-red-500">Error loading data</div>}

      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Champion</div>
            <div className="col-span-2">Games</div>
            <div className="col-span-3">Win Rate</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {(() => {
            const displayPool = showAll ? filteredChampions : filteredChampions.slice(0, 20)
            const hasMore = filteredChampions.length > 20
            return (
              <>
                {displayPool.map((champion, index) => (
                  <div
                    key={champion.champion}
                    className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150"
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
                    <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                      <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                      <img
                        src={champion.imageUrl}
                        alt={champion.champion}
                        className="w-8 h-8 rounded-full border border-border"
                        onError={e => (e.target as any).style.display='none'}
                      />
                      <span className="text-sm text-foreground font-medium">{champion.champion}</span>
                    </div>

                    {/* Games */}
                    <div className="hidden md:flex col-span-2 items-center">
                      <span className="font-mono text-sm text-foreground-secondary">
                        {champion.games.toLocaleString()}
                      </span>
                    </div>

                    {/* Win Rate */}
                    <div className="col-span-1 md:col-span-3 flex items-center gap-2 justify-end md:justify-start">
                      <ScoreBar value={champion.winRate} width={80} />
                      <span className={`font-mono text-sm ${
                        champion.winRate >= 55 ? 'text-win' :
                        champion.winRate >= 50 ? 'text-amber' :
                        'text-loss'
                      }`}>
                        {champion.winRate.toFixed(1)}%
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex col-span-2 items-center justify-end">
                      <button
                        onClick={() => onChampionClick(makeChampionObj(champion))}
                        className="px-3 py-1 text-xs border border-border text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors duration-150"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-sm text-foreground-secondary hover:text-foreground border border-border rounded-lg hover:bg-row-hover transition-colors"
                  >
                    {showAll ? (
                      <>
                        Show Less
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Show {filteredChampions.length - 20} More Champions
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </>
            )
          })()}

          {filteredChampions.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No champions found</div>
          )}
        </div>
      )}
    </section>
  )
}
