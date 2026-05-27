'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Database, ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { Champion } from '@/lib/data'
import { ScoreBar } from './score-bar'
import { RoleIcon } from './role-icon'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const tabs = [
  { id: 2, label: '2 Champions' },
  { id: 3, label: '3 Champions' },
  { id: 4, label: '4 Champions' },
  { id: 5, label: '5 Champions' },
]

interface SynergySectionProps {
  onChampionClick: (champion: Champion) => void
}

function makeChampionObj(name: string, imageUrl: string): any {
  return { id: name, name, imageUrl, role: 'mid', presence: 0, winRate: 0, picks: 0, bans: 0 }
}

export function SynergySection({ onChampionClick }: SynergySectionProps) {
  const [activeTab, setActiveTab] = useState(2)
  const [minGames, setMinGames] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useSWR(
    `/api/champions/synergy?limit=150&size=${activeTab}`,
    fetcher
  )

  const rawRows = data?.data || []
  
    const filteredRows = useMemo(() => {
      return rawRows.filter((row: any) => {
        const games = row.gamesTogether || 0
        const gamesMatch = games >= minGames
        
        // Search functionality
        let searchMatch = false
        if (activeTab === 2) {
          // For 2v2, check championA and championB
          searchMatch = row.championA?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        row.championB?.toLowerCase().includes(searchQuery.toLowerCase())
        } else {
          // For 3v3, 4v4, 5v5, check all champions in the array
          searchMatch = (row.champions || []).some(name => 
            name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        return gamesMatch && searchMatch
      })
    }, [rawRows, minGames, searchQuery, activeTab])

  return (
    <section id="synergy" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Synergy</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

       {/* Filters and Tabs Grid */}
       <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border pb-3">
         {/* Tabs */}
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

      {isLoading && (
        <div className="text-center py-12 text-foreground-muted">Loading synergy data...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500">Error loading data</div>
      )}

      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Champions</div>
            <div className="col-span-3">Score</div>
            <div className="col-span-2 text-right">W/G</div>
          </div>

          {(() => {
            const displayPool = showAll ? filteredRows : filteredRows.slice(0, 20)
            const hasMore = filteredRows.length > 20
            return (
              <>
                {displayPool.map((row: any, index: number) => {
                  const isTwo = activeTab === 2
                  const champNames: string[] = isTwo
                    ? [row.championA, row.championB]
                    : row.champions
                  const imageUrls: string[] = isTwo
                    ? [row.imageUrlA, row.imageUrlB]
                    : row.imageUrls
                  const score: number = row.synergyScore
                  const wins: number = row.winsTogether
                  const games: number = row.gamesTogether

                  return (
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

                       {/* Champions */}
                       <div className="col-span-1 md:col-span-6 flex items-center gap-3">
                         <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                         {isTwo ? (
                           <div className="flex items-center gap-2">
                             <div
                               className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                               onClick={() => onChampionClick(makeChampionObj(champNames[0], imageUrls[0]))}
                             >
                               <img src={imageUrls[0]} alt={champNames[0]} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                               <div className="flex items-center gap-1">
                                 <span className="text-sm text-foreground">{champNames[0]}</span>
                                 {row.roleA1 && (
                                   <RoleIcon 
                                     role={row.roleA1 === 'sup' ? 'support' : row.roleA1 as any} 
                                     size={12} 
                                     className="ml-1"
                                   />
                                 )}
                               </div>
                             </div>
                             <span className="text-foreground-muted">+</span>
                             <div
                               className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                               onClick={() => onChampionClick(makeChampionObj(champNames[1], imageUrls[1]))}
                             >
                               <img src={imageUrls[1]} alt={champNames[1]} className="w-8 h-8 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                               <div className="flex items-center gap-1">
                                 <span className="text-sm text-foreground">{champNames[1]}</span>
                                 {row.roleA2 && (
                                   <RoleIcon 
                                     role={row.roleA2 === 'sup' ? 'support' : row.roleA2 as any} 
                                     size={12} 
                                     className="ml-1"
                                   />
                                 )}
                               </div>
                             </div>
                           </div>
                         ) : (
                           <div className="flex flex-col gap-1">
                             <div className="flex gap-1">
                               {champNames.map((name, i) => (
                                 <img key={i} src={imageUrls[i]} alt={name} className="w-7 h-7 rounded-full border border-border" onError={e => (e.target as any).style.display='none'} />
                               ))}
                             </div>
                             <div className="flex flex-wrap gap-1 text-xs text-foreground-secondary">
                               {champNames.map((name, i) => (
                                 <span
                                   key={i}
                                   className="cursor-pointer hover:text-foreground"
                                   onClick={() => onChampionClick(makeChampionObj(name, imageUrls[i]))}
                                 >
                                   {name}{i < champNames.length - 1 ? ', ' : ''}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>

                      {/* Score */}
                      <div className="hidden md:flex col-span-3 items-center gap-2">
                        <ScoreBar value={score} colorClass="bg-accent dark:bg-accent-cyan" width={80} />
                        <span className="font-mono text-sm text-foreground">{score?.toFixed(1)}</span>
                      </div>

                      {/* W/G */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-end">
                        <span className="font-mono text-sm text-foreground-muted">
                          {wins}/{games}
                        </span>
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
                        Show {filteredRows.length - 20} More Synergy Combinations
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </>
            )
          })()}

          {filteredRows.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No synergy data matches filter</div>
          )}
        </div>
      )}
    </section>
  )
}
