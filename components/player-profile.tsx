'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react'
import useSWR from 'swr'
import { ChampionPortrait } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'
import { MatchDetailModal } from './match-detail-modal'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-foreground/10 rounded ${className ?? ''}`} />
}

interface PlayerProfileProps {
  playerName: string | null
  onClose: () => void
}

export function PlayerProfile({ playerName, onClose }: PlayerProfileProps) {
  // 1. Initialize all top-level React hooks at the absolute top of the component (never conditionally!)
  const [activeTab, setActiveTab] = useState<'all' | 'playoffs' | 'worlds' | 'msi'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [showAllChampions, setShowAllChampions] = useState(false)
  const [showAllMatches, setShowAllMatches] = useState(false)

  const { data, isLoading } = useSWR(
    playerName ? `/api/players/${encodeURIComponent(playerName)}` : null,
    fetcher,
    { keepPreviousData: true }
  )

  const { data: matchDetailData } = useSWR(
    selectedMatchId ? `/api/matches/${encodeURIComponent(selectedMatchId)}` : null,
    fetcher
  )
  const selectedMatch = matchDetailData?.data

  if (!playerName) return null

  const player = data?.data

  if (isLoading || !player) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </button>
          {/* Header skeleton */}
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-3">
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          {/* Stats strip skeleton */}
          <div className="border-t border-b border-border py-6 mb-8">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          {/* Champion pool skeleton */}
          <div className="mb-8">
            <Skeleton className="h-7 w-36 mb-4" />
            <div className="h-px bg-border mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          </div>
          {/* Matches skeleton */}
          <div>
            <Skeleton className="h-7 w-36 mb-4" />
            <div className="h-px bg-border mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const maxGames = player.activityByYear && player.activityByYear.length > 0
    ? Math.max(...player.activityByYear.map((a: any) => a.games), 1)
    : 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-4xl md:text-5xl text-foreground">{player.name}</h1>
                <RoleIcon role={player.role} size={24} />
              </div>
              <p className="font-mono text-sm text-foreground-muted">{player.career}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-foreground-muted hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="border-t border-b border-border py-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-0 sm:divide-x divide-border">
            <div className="text-center sm:px-4">
              <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                {player.games.toLocaleString()}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">Games</div>
            </div>
            <div className="text-center sm:px-4">
              <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                {player.wins.toLocaleString()}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">Wins</div>
            </div>
            <div className="text-center sm:px-4">
              <div className={`font-mono text-2xl md:text-3xl mb-1 ${
                player.winRate >= 55 ? 'text-win' : player.winRate >= 50 ? 'text-amber' : 'text-loss'
              }`}>
                {player.winRate.toFixed(1)}%
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">Win Rate</div>
            </div>
            <div className="text-center sm:px-4">
              <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                {player.kda.toFixed(2)}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">KDA</div>
            </div>
            <div className="text-center sm:px-4">
              <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                {(player.lastYear && player.firstYear) ? (player.lastYear - player.firstYear + 1) : player.activityByYear?.length || 0}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">Years</div>
            </div>
          </div>
        </div>

        {/* Champion Pool */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="font-serif text-2xl text-foreground">Champion Pool</h2>
            
            {/* Search and Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Search champions..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowAllChampions(false); }}
                  className="pl-8 pr-3 py-1 text-xs border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted w-40"
                />
              </div>

              {/* Tabs */}
              <div className="flex rounded border border-border overflow-hidden">
                {(['all', 'playoffs', 'worlds', 'msi'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setShowAllChampions(false); }}
                    className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? 'bg-foreground text-background font-medium'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-row-hover'
                    }`}
                  >
                    {tab === 'all' ? 'All-Time' : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-border mb-4" />

          {/* Filtered Champion pool rendering */}
          {(() => {
            const filteredPool = player.championPool
              .map((cp: any) => {
                let games = cp.games
                let winRate = cp.winRate
                let kda = cp.kda

                if (activeTab === 'playoffs') {
                  games = cp.playoffsGames
                  winRate = cp.playoffsWinRate
                  kda = cp.playoffsKda
                } else if (activeTab === 'worlds') {
                  games = cp.worldsGames
                  winRate = cp.worldsWinRate
                  kda = cp.worldsKda
                } else if (activeTab === 'msi') {
                  games = cp.msiGames
                  winRate = cp.msiWinRate
                  kda = cp.msiKda
                }

                return { ...cp, games, winRate, kda }
              })
              .filter((cp: any) => {
                const matchesTab = cp.games > 0
                const matchesSearch = cp.champion.name.toLowerCase().includes(searchQuery.toLowerCase())
                return matchesTab && matchesSearch
              })

            if (filteredPool.length === 0) {
              return (
                <div className="text-center py-8 text-sm text-foreground-muted border border-dashed border-border rounded">
                  No champions found for this selection.
                </div>
              )
            }

            const INITIAL_SHOW = 8
            const displayPool = showAllChampions ? filteredPool : filteredPool.slice(0, INITIAL_SHOW)
            const hasMore = filteredPool.length > INITIAL_SHOW

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayPool.map((cp: any) => (
                    <div key={cp.champion.id} className="border border-border p-4 bg-surface/50 rounded-lg hover:border-foreground-muted transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <ChampionPortrait champion={cp.champion} size={40} />
                        <div>
                          <div className="text-sm text-foreground font-medium">{cp.champion.name}</div>
                          <div className="text-xs text-foreground-muted font-mono">{cp.games} games</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground-muted">Win Rate</span>
                          <div className="flex items-center gap-2">
                            <ScoreBar value={cp.winRate} width={40} />
                            <span className={`font-mono text-xs ${
                              cp.winRate >= 55 ? 'text-win' : cp.winRate >= 50 ? 'text-amber' : 'text-loss'
                            }`}>
                              {cp.winRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground-muted">KDA</span>
                          <span className="font-mono text-xs text-foreground">{typeof cp.kda === 'number' ? cp.kda.toFixed(2) : cp.kda}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <button
                    onClick={() => setShowAllChampions(!showAllChampions)}
                    className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-sm text-foreground-secondary hover:text-foreground border border-border rounded-lg hover:bg-row-hover transition-colors"
                  >
                    {showAllChampions ? (
                      <>
                        Show Less
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Show {filteredPool.length - INITIAL_SHOW} More Champions
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </>
            )
          })()}
        </div>

        {/* Activity by Year */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">Activity by Year</h2>
          <div className="h-px bg-border mb-4" />
          <div className="flex items-end gap-2 h-36 px-2 border border-border/40 rounded-lg bg-surface/20 py-4">
            {player.activityByYear.map((activity: any) => (
              <div key={activity.year} className="flex-1 flex flex-col items-center justify-end h-full">
                <div 
                  className="w-full bg-foreground dark:bg-accent-cyan/60 transition-all duration-300 rounded-t-sm min-h-[4px]"
                  style={{ height: `${(activity.games / maxGames) * 100}%` }}
                />
                <span className="text-[10px] font-mono text-foreground-muted mt-2">
                  {activity.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* League Breakdown */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">League Breakdown</h2>
          <div className="h-px bg-border mb-4" />
          <div className="space-y-0">
            {player.leagueBreakdown.map((league: any) => (
              <div 
                key={league.league}
                className="grid grid-cols-3 gap-4 py-3 border-b border-border"
              >
                <span className="text-sm text-foreground">{league.league}</span>
                <span className="font-mono text-sm text-foreground-secondary">{league.games} games</span>
                <div className="flex items-center gap-2 justify-end">
                  <ScoreBar value={league.winRate} width={60} />
                  <span className={`font-mono text-sm ${
                    league.winRate >= 55 ? 'text-win' : league.winRate >= 50 ? 'text-amber' : 'text-loss'
                  }`}>
                    {league.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="relative">
          <h2 className="font-serif text-2xl text-foreground mb-4">Recent Matches</h2>
          <div className="h-px bg-border mb-4" />
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
                  <th className="py-2 text-left font-normal">Date</th>
                  <th className="py-2 text-left font-normal">League</th>
                  <th className="py-2 text-left font-normal">Champion</th>
                  <th className="py-2 text-center font-normal">Result</th>
                  <th className="py-2 text-right font-normal">KDA</th>
                </tr>
              </thead>
              <tbody>
              {(() => {
                const displayPool = showAllMatches ? player.recentMatches : player.recentMatches.slice(0, 20)
                return displayPool.map((match: any, index: number) => (
                  <tr 
                    key={index}
                    onClick={() => {
                      if (match.gameId) {
                        setSelectedMatchId(match.gameId)
                      }
                    }}
                    className={`border-b border-border transition-colors ${match.gameId ? 'cursor-pointer hover:bg-row-hover' : ''}`}
                  >
                    <td className="py-3">
                      <span className="font-mono text-sm text-foreground-secondary">{match.date}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-foreground">{match.league}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <ChampionPortrait champion={match.champion} size={24} />
                        <span className="text-sm text-foreground">{match.champion.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        match.result === 'win' 
                          ? 'bg-win/20 text-win' 
                          : 'bg-loss/20 text-loss'
                      }`}>
                        {match.result === 'win' ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-mono text-sm text-foreground-secondary">{match.kda}</span>
                    </td>
                  </tr>
                ))
              })()}
            </tbody>
          </table>
          
          {player.recentMatches.length > 20 && (
            <button
              onClick={() => setShowAllMatches(!showAllMatches)}
              className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-sm text-foreground-secondary hover:text-foreground border border-border rounded-lg hover:bg-row-hover transition-colors"
            >
              {showAllMatches ? (
                <>
                  Show Less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show {player.recentMatches.length - 20} More Matches
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>

      {/* Match Detail Modal mounting */}
      {selectedMatchId && !selectedMatch && (
        <div className="fixed inset-0 bg-black/30 z-[70] flex items-center justify-center">
          <div className="text-white text-sm animate-pulse">Loading match details…</div>
        </div>
      )}
      <AnimatePresence>
        {selectedMatchId && selectedMatch && (
          <MatchDetailModal
            match={selectedMatch}
            onClose={() => setSelectedMatchId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
