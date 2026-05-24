'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { matches, getMatchDetail, type Champion } from '@/lib/data'
import { MatchDetailModal } from './match-detail-modal'

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

  const filteredMatches = useMemo(() => {
    let filtered = matches

    if (selectedYear !== 'All Years') {
      filtered = filtered.filter((m) => m.date.startsWith(selectedYear))
    }

    if (patchFilter) {
      filtered = filtered.filter((m) => m.patch.includes(patchFilter))
    }

    if (playoffsOnly) {
      filtered = filtered.filter((m) => m.playoffs)
    }

    return filtered
  }, [selectedYear, patchFilter, playoffsOnly])

  const selectedMatch = selectedMatchId ? getMatchDetail(selectedMatchId) : null

  return (
    <section id="matches" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Matches</h2>
        <div className="h-px bg-border" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground-secondary">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
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
            onChange={(e) => setPatchFilter(e.target.value)}
            className="w-24 px-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={playoffsOnly}
            onChange={(e) => setPlayoffsOnly(e.target.checked)}
            className="accent-foreground"
          />
          <span className="text-sm text-foreground-secondary">Playoffs Only</span>
        </label>
      </div>

      {/* Match Table */}
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
            {filteredMatches.map((match) => (
              <motion.tr 
                key={match.id} 
                onClick={() => setSelectedMatchId(match.id)}
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
                    {match.blueTeam}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-sm ${match.winner === 'red' ? 'text-foreground font-medium' : 'text-foreground-secondary'}`}>
                    {match.redTeam}
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
                  <span className="font-mono text-sm text-foreground-secondary">{match.duration}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <MatchDetailModal
            match={selectedMatch}
            onClose={() => setSelectedMatchId(null)}
            onPlayerClick={onPlayerClick}
            onChampionClick={onChampionClick}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
