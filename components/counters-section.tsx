'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Database, ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { Champion } from '@/lib/data'
import { ScoreBar } from './score-bar'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const tabs = [
  { id: '1', label: '1v1' },
  { id: '2', label: '2v2 Duos' },
  { id: '3', label: '3v3' },
  { id: '4', label: '4v4' },
  { id: '5', label: '5v5' },
]

const rolePairFilters = [
  { id: 'any',     label: 'ANY',     r1: 'Any',    r2: 'Any' },
  { id: 'bot-sup', label: 'BOT+SUP', r1: 'bot',    r2: 'sup' },
  { id: 'top-jgl', label: 'TOP+JGL', r1: 'top',    r2: 'jungle' },
  { id: 'top-mid', label: 'TOP+MID', r1: 'top',    r2: 'mid' },
  { id: 'top-bot', label: 'TOP+BOT', r1: 'top',    r2: 'bot' },
  { id: 'top-sup', label: 'TOP+SUP', r1: 'top',    r2: 'sup' },
  { id: 'jgl-mid', label: 'JGL+MID', r1: 'jungle', r2: 'mid' },
  { id: 'jgl-bot', label: 'JGL+BOT', r1: 'jungle', r2: 'bot' },
  { id: 'jgl-sup', label: 'JGL+SUP', r1: 'jungle', r2: 'sup' },
  { id: 'mid-bot', label: 'MID+BOT', r1: 'mid',    r2: 'bot' },
  { id: 'mid-sup', label: 'MID+SUP', r1: 'mid',    r2: 'sup' },
]

interface CountersSectionProps {
  onChampionClick: (champion: Champion) => void
}

function makeChampionObj(name: string, imageUrl: string): any {
  return { id: name, name, imageUrl, role: 'mid', presence: 0, winRate: 0, picks: 0, bans: 0 }
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    top: 'TOP', jungle: 'JGL', jgl: 'JGL', mid: 'MID',
    bot: 'BOT', adc: 'BOT', sup: 'SUP', support: 'SUP'
  }
  return map[role?.toLowerCase()] || role?.toUpperCase() || ''
}

export function CountersSection({ onChampionClick }: CountersSectionProps) {
  const [activeTab, setActiveTab] = useState('1')
  const [rolePairFilter, setRolePairFilter] = useState('any')
  const [minGames, setMinGames] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedPair = rolePairFilters.find(f => f.id === rolePairFilter) || rolePairFilters[0]

  const url = `/api/champions/counters?size=${activeTab}&limit=150&role1=${selectedPair.r1}&role2=${selectedPair.r2}`
  const { data, isLoading, error } = useSWR(url, fetcher)
  
  const rawRows = data?.data || []

    const filteredRows = useMemo(() => {
      return rawRows.filter((row: any) => {
        const games = row.gamesAgainst || 0
        const gamesMatch = games >= minGames
        
        // Search functionality
        let searchMatch = false
        if (activeTab === '2') {
          // For 2v2, check all champions: championA, championB, a1, a2, b1, b2
          searchMatch = row.championA?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        row.championB?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.a1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.a2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.b1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.b2?.toLowerCase().includes(searchQuery.toLowerCase())
        } else if (activeTab === '1') {
          // For 1v1, check championA and championB
          searchMatch = row.championA?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        row.championB?.toLowerCase().includes(searchQuery.toLowerCase())
        } else {
          // For 3v3, 4v4, 5v5, check team arrays
          const teamAMatch = (row.teamA || []).some(name => 
            name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          const teamBMatch = (row.teamB || []).some(name => 
            name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          searchMatch = teamAMatch || teamBMatch
        }
        
        return gamesMatch && searchMatch
      })
    }, [rawRows, minGames, searchQuery, activeTab])

  return (
    <section id="counters" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Counters</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

       {/* Tabs & Games Filter Grid */}
       <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border pb-3">
         <div className="flex items-center gap-6">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); setShowAll(false); }}
               className={`tab-underline pb-3 text-sm transition-colors duration-150 ${
                 activeTab === tab.id 
                   ? 'active text-foreground font-medium' 
                   : 'text-foreground-secondary hover:text-foreground'
               }`}
             >
               {tab.label}
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

      {/* Role Pair Filter (2v2 only) */}
      {activeTab === '2' && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {rolePairFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => { setRolePairFilter(filter.id); setShowAll(false); }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors duration-150 ${
                rolePairFilter === filter.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground-secondary hover:border-foreground-muted'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {isLoading && <div className="text-center py-12 text-foreground-muted">Loading counter data...</div>}
      {error && <div className="text-center py-12 text-red-500">Error loading data</div>}

      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Winner</div>
            <div className="col-span-1 text-center">vs</div>
            <div className="col-span-3">Loser</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-1 text-right">W/G</div>
          </div>

          {(() => {
            const displayPool = showAll ? filteredRows : filteredRows.slice(0, 20)
            const hasMore = filteredRows.length > 20
            return (
              <>
                {displayPool.map((row: any, index: number) => {
                  const score: number = row.counterScore
                  const wins: number = row.winsAgainst
                  const games: number = row.gamesAgainst

                  // 1v1 row format
                  if (activeTab === '1') {
                    return (
                      <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150">
                        <div className="hidden md:flex col-span-1 items-center justify-center">
                          <span className={`font-mono text-sm ${index === 0 ? 'text-amber' : index === 1 ? 'text-foreground-secondary' : 'text-foreground-muted'}`}>{index + 1}</span>
                        </div>
                        <div className="col-span-1 md:col-span-4 flex items-center gap-2">
                          <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => onChampionClick(makeChampionObj(row.championA, row.imageUrlA))}>
                            <img src={row.imageUrlA} alt={row.championA} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                            <span className="text-sm text-foreground">{row.championA}</span>
                          </div>
                        </div>
                        <div className="hidden md:flex col-span-1 items-center justify-center">
                          <span className="text-xs italic text-foreground-muted">beats</span>
                        </div>
                        <div className="hidden md:flex col-span-3 items-center gap-2">
                          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => onChampionClick(makeChampionObj(row.championB, row.imageUrlB))}>
                            <img src={row.imageUrlB} alt={row.championB} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                            <span className="text-sm text-foreground-secondary">{row.championB}</span>
                          </div>
                        </div>
                        <div className="hidden md:flex col-span-2 items-center gap-2">
                          <ScoreBar value={score} width={60} />
                          <span className="font-mono text-sm text-foreground">{score?.toFixed(1)}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                          <span className="font-mono text-sm text-foreground-muted">{wins}/{games}</span>
                        </div>
                      </div>
                    )
                  }

                  // 2v2 row format
                  if (activeTab === '2') {
                    return (
                      <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150">
                        <div className="hidden md:flex col-span-1 items-center justify-center">
                          <span className={`font-mono text-sm ${index === 0 ? 'text-amber' : 'text-foreground-muted'}`}>{index + 1}</span>
                        </div>
                        <div className="col-span-1 md:col-span-4 flex items-start gap-2">
                          <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <img src={row.imageUrlA1} alt={row.a1} className="w-7 h-7 rounded-full border border-border flex-shrink-0" onError={e => (e.target as any).style.display='none'} />
                              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground-muted">{roleLabel(row.roleA1)}</span>
                              <span className="text-sm text-foreground">{row.a1}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <img src={row.imageUrlA2} alt={row.a2} className="w-7 h-7 rounded-full border border-border flex-shrink-0" onError={e => (e.target as any).style.display='none'} />
                              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground-muted">{roleLabel(row.roleA2)}</span>
                              <span className="text-sm text-foreground">{row.a2}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex col-span-1 items-center justify-center">
                          <span className="text-xs italic text-foreground-muted">beats</span>
                        </div>
                        <div className="hidden md:flex col-span-3 items-start gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <img src={row.imageUrlB1} alt={row.b1} className="w-7 h-7 rounded-full border border-border flex-shrink-0" onError={e => (e.target as any).style.display='none'} />
                              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground-muted">{roleLabel(row.roleB1)}</span>
                              <span className="text-sm text-foreground-secondary">{row.b1}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <img src={row.imageUrlB2} alt={row.b2} className="w-7 h-7 rounded-full border border-border flex-shrink-0" onError={e => (e.target as any).style.display='none'} />
                              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground-muted">{roleLabel(row.roleB2)}</span>
                              <span className="text-sm text-foreground-secondary">{row.b2}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex col-span-2 items-center gap-2">
                          <ScoreBar value={score} width={60} />
                          <span className="font-mono text-sm text-foreground">{score?.toFixed(1)}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                          <span className="font-mono text-sm text-foreground-muted">{wins}/{games}</span>
                        </div>
                      </div>
                    )
                  }

                  // 3v3, 4v4, 5v5 row format
                  const teamA: string[] = row.teamA || []
                  const teamB: string[] = row.teamB || []
                  const urlsA: string[] = row.imageUrlsA || []
                  const urlsB: string[] = row.imageUrlsB || []
                  return (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150">
                      <div className="hidden md:flex col-span-1 items-center justify-center">
                        <span className={`font-mono text-sm ${index === 0 ? 'text-amber' : 'text-foreground-muted'}`}>{index + 1}</span>
                      </div>
                      <div className="col-span-1 md:col-span-4 flex items-center gap-1">
                        <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                        {teamA.map((name, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            <img src={urlsA[i]} alt={name} className="w-7 h-7 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                            <span className="text-[9px] text-foreground-muted max-w-[36px] truncate">{name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:flex col-span-1 items-center justify-center">
                        <span className="text-xs italic text-foreground-muted">beats</span>
                      </div>
                      <div className="hidden md:flex col-span-3 items-center gap-1">
                        {teamB.map((name, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            <img src={urlsB[i]} alt={name} className="w-7 h-7 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                            <span className="text-[9px] text-foreground-muted max-w-[36px] truncate">{name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:flex col-span-2 items-center gap-2">
                        <ScoreBar value={score} width={60} />
                        <span className="font-mono text-sm text-foreground">{score?.toFixed(1)}</span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <span className="font-mono text-sm text-foreground-muted">{wins}/{games}</span>
                      </div>
                    </div>
                  )
                })}
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
                        Show {filteredRows.length - 20} More Counter Matchups
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </>
            )
          })()}

          {filteredRows.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No counter data matches filter</div>
          )}
        </div>
      )}
    </section>
  )
}
