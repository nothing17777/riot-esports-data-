'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Database, ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { Champion } from '@/lib/data'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const roles = [
  { id: 'top', label: 'TOP' },
  { id: 'jungle', label: 'JUNGLE' },
  { id: 'mid', label: 'MID' },
  { id: 'bot', label: 'BOT' },
  { id: 'sup', label: 'SUPPORT' },
] as const

interface LaneMatchupsSectionProps {
  onChampionClick: (champion: Champion) => void
}

function makeChampionObj(name: string, imageUrl: string): any {
  return { id: name, name, imageUrl, role: 'mid', presence: 0, winRate: 0, picks: 0, bans: 0 }
}

export function LaneMatchupsSection({ onChampionClick }: LaneMatchupsSectionProps) {
  const [activeRole, setActiveRole] = useState<string>('mid')
  const [minGames, setMinGames] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useSWR(
    `/api/champions/lane-matchups?role=${activeRole}&limit=150`,
    fetcher
  )

  const rawRows = data?.data || []

   const filteredRows = useMemo(() => {
     return rawRows.filter((row: any) => {
       const games = row.games || 0
       const gamesMatch = games >= minGames
       
       // Search functionality
       const searchMatch = 
         row.championA?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         row.championB?.toLowerCase().includes(searchQuery.toLowerCase())
       
       return gamesMatch && searchMatch
     })
   }, [rawRows, minGames, searchQuery])

  return (
    <section id="lane-matchups" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Lane Matchups</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

       {/* Role Selector & Games Filter Grid */}
       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
         <div className="flex flex-wrap items-center gap-2">
           {roles.map((role) => (
             <button
               key={role.id}
               onClick={() => { setActiveRole(role.id); setShowAll(false); }}
               className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors duration-150 ${
                 activeRole === role.id
                   ? 'bg-foreground text-background border-foreground'
                   : 'border-border text-foreground-secondary hover:border-foreground-muted'
               }`}
             >
               <RoleIcon role={role.id === 'sup' ? 'support' : role.id as any} size={16} />
               <span>{role.label}</span>
             </button>
           ))}
         </div>

         {/* Min Games Filter */}
         <div className="flex items-center gap-2">
           <label className="text-xs tracking-wider uppercase text-foreground-muted">Min Games:</label>
           <input
             type="range"
             min="0"
             max="200"
             step="10"
             value={minGames}
             onChange={(e) => { setMinGames(Number(e.target.value)); setShowAll(false); }}
             className="w-28 accent-foreground"
           />
           <span className="font-mono text-sm text-foreground w-12 text-right">{minGames}</span>
         </div>

         {/* Search */}
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
       </div>

      {isLoading && <div className="text-center py-12 text-foreground-muted">Loading lane matchup data...</div>}
      {error && <div className="text-center py-12 text-red-500">Error loading data</div>}

      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Champion A</div>
            <div className="col-span-1 text-center">vs</div>
            <div className="col-span-3">Champion B</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-1 text-right">W/G</div>
          </div>

          {(() => {
            const displayPool = showAll ? filteredRows : filteredRows.slice(0, 20)
            const hasMore = filteredRows.length > 20
            return (
              <>
                {displayPool.map((row: any, index: number) => (
                  <div
                    key={index}
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

                    {/* Champion A */}
                    <div className="col-span-1 md:col-span-4 flex items-center gap-2">
                      <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => onChampionClick(makeChampionObj(row.championA, row.imageUrlA))}
                      >
                        <img src={row.imageUrlA} alt={row.championA} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                        <span className="text-sm text-foreground">{row.championA}</span>
                        <RoleIcon role={activeRole === 'sup' ? 'support' : activeRole as any} size={14} />
                      </div>
                    </div>

                    {/* VS */}
                    <div className="hidden md:flex col-span-1 items-center justify-center">
                      <div className="flex items-center gap-1">
                        <RoleIcon role={activeRole === 'sup' ? 'support' : activeRole as any} size={14} />
                        <span className="text-xs text-foreground-muted">VS</span>
                        <RoleIcon role={activeRole === 'sup' ? 'support' : activeRole as any} size={14} />
                      </div>
                    </div>

                    {/* Champion B */}
                    <div className="hidden md:flex col-span-3 items-center gap-2">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => onChampionClick(makeChampionObj(row.championB, row.imageUrlB))}
                      >
                        <img src={row.imageUrlB} alt={row.championB} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                        <span className="text-sm text-foreground-secondary">{row.championB}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="hidden md:flex col-span-2 items-center gap-2">
                      <ScoreBar value={row.score} width={60} />
                      <span className="font-mono text-sm text-foreground">{row.score?.toFixed(1)}</span>
                    </div>

                    {/* W/G */}
                    <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                      <span className="font-mono text-sm text-foreground-muted">
                        {row.wins}/{row.games}
                      </span>
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
                        Show {filteredRows.length - 20} More Lane Matchups
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </>
            )
          })()}

          {filteredRows.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No lane matchups match filter</div>
          )}
        </div>
      )}
    </section>
  )
}
