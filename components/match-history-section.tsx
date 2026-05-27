'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, ChevronDown, ChevronUp } from 'lucide-react'
import type { Champion } from '@/lib/data'
import { MatchDetailModal } from './match-detail-modal'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const years = ['All Years', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014']

interface MatchHistorySectionProps {
  onPlayerClick?: (playerId: string) => void
  onChampionClick?: (champion: Champion) => void
}

export function MatchHistorySection({ onPlayerClick, onChampionClick }: MatchHistorySectionProps) {
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [patchFilter, setPatchFilter] = useState('')
  const [playoffsOnly, setPlayoffsOnly] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Construct URL query parameters
  const params = new URLSearchParams()
  if (selectedYear !== 'All Years') params.append('year', selectedYear)
  if (patchFilter) params.append('patch', patchFilter)
  if (playoffsOnly) params.append('playoffs', 'true')
  params.append('limit', '100')

  const { data, isLoading, error } = useSWR(`/api/matches?${params.toString()}`, fetcher)
  const matches = data?.data || []

  // Get details of the selected match from the API
  const { data: matchDetailData } = useSWR(
    selectedMatchId ? `/api/matches/${encodeURIComponent(selectedMatchId)}` : null,
    fetcher
  )
  const selectedMatch = matchDetailData?.data

  return (
    <section id="matches" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Matches</h2>
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
          <label className="text-sm text-foreground-secondary">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setShowAll(false); }}
            className="px-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground focus:outline-none focus:border-foreground-muted"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground-secondary">Patch:</label>
          <input
            type="text"
            placeholder="e.g. 14.1"
            value={patchFilter}
            onChange={(e) => { setPatchFilter(e.target.value); setShowAll(false); }}
            className="w-24 px-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={playoffsOnly}
            onChange={(e) => { setPlayoffsOnly(e.target.checked); setShowAll(false); }}
            className="accent-foreground"
          />
          <span className="text-sm text-foreground-secondary">Playoffs Only</span>
        </label>
      </div>

      {isLoading && <div className="text-center py-12 text-foreground-muted">Loading matches...</div>}
      {error && <div className="text-center py-12 text-red-500">Error loading matches</div>}

      {!isLoading && !error && (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
                <th className="py-2 text-left font-normal">Date</th>
                <th className="py-2 text-left font-normal">League</th>
                <th className="py-2 text-left font-normal">Patch</th>
                <th className="py-2 text-left font-normal">Blue Team</th>
                <th className="py-2 text-left font-normal">Red Team</th>
                <th className="py-2 text-center font-normal">Winner</th>
                <th className="py-2 text-right font-normal">Duration</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const displayPool = showAll ? matches : matches.slice(0, 20)
                return displayPool.map((match: any) => {
                  const durationMinutes = match.durationSeconds 
                    ? `${Math.floor(match.durationSeconds / 60)}:${(match.durationSeconds % 60).toString().padStart(2, '0')}`
                    : '—'
                  return (
                    <motion.tr 
                      key={match.gameId} 
                      onClick={() => setSelectedMatchId(match.gameId)}
                      className="border-b border-border hover:bg-row-hover transition-colors duration-150 cursor-pointer"
                      whileHover={{ backgroundColor: 'var(--color-row-hover)' }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <td className="py-3">
                        <span className="font-mono text-sm text-foreground-secondary">{match.date}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-foreground">{match.league}</span>
                        {match.playoffs && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber/20 text-amber rounded">
                            PO
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-sm text-foreground-muted">{match.patch}</span>
                      </td>
                      <td className="py-3">
                        <span className={`text-sm ${match.winner === 'blue' ? 'text-foreground font-medium' : 'text-foreground-secondary'}`}>
                          {match.sideBlue || 'Blue Team'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-sm ${match.winner === 'red' ? 'text-foreground font-medium' : 'text-foreground-secondary'}`}>
                          {match.sideRed || 'Red Team'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          match.winner === 'blue' 
                            ? 'bg-accent/20 text-accent dark:bg-accent-cyan/20 dark:text-accent-cyan' 
                            : 'bg-loss/20 text-loss'
                        }`}>
                          {match.winner.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-mono text-sm text-foreground-secondary">{durationMinutes}</span>
                      </td>
                    </motion.tr>
                  )
                })
              })()}
            </tbody>
          </table>
          
          {matches.length > 20 && (
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
                  Show {matches.length - 20} More Matches
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          
          {matches.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No matches found</div>
          )}
        </div>
      )}

      {/* Loading detail spinner */}
      {selectedMatchId && !selectedMatch && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="text-foreground-muted text-sm animate-pulse">Loading match details…</div>
        </div>
      )}

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatchId && selectedMatch && (
          <MatchDetailModal
            match={selectedMatch}
            onClose={() => {
              setSelectedMatchId(null)
            }}
            onPlayerClick={onPlayerClick}
            onChampionClick={onChampionClick}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
