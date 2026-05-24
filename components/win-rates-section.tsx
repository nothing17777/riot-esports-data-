'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { champions, type Champion } from '@/lib/data'
import { ChampionPortrait } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

const roles = [
  { id: 'all', label: 'ALL' },
  { id: 'top', label: 'TOP' },
  { id: 'jungle', label: 'JGL' },
  { id: 'mid', label: 'MID' },
  { id: 'bot', label: 'BOT' },
  { id: 'support', label: 'SUP' },
] as const

interface WinRatesSectionProps {
  onChampionClick: (champion: Champion) => void
}

export function WinRatesSection({ onChampionClick }: WinRatesSectionProps) {
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set(['all']))
  const [searchQuery, setSearchQuery] = useState('')

  const toggleRole = (roleId: string) => {
    const newRoles = new Set(selectedRoles)
    if (roleId === 'all') {
      setSelectedRoles(new Set(['all']))
      return
    }
    
    newRoles.delete('all')
    if (newRoles.has(roleId)) {
      newRoles.delete(roleId)
      if (newRoles.size === 0) {
        newRoles.add('all')
      }
    } else {
      newRoles.add(roleId)
    }
    setSelectedRoles(newRoles)
  }

  const filteredChampions = useMemo(() => {
    let filtered = champions

    if (!selectedRoles.has('all')) {
      filtered = filtered.filter((c) => selectedRoles.has(c.role))
    }

    if (searchQuery) {
      filtered = filtered.filter((c) => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => b.winRate - a.winRate)
  }, [selectedRoles, searchQuery])

  return (
    <section id="win-rates" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Win Rates</h2>
        <div className="h-px bg-border" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => toggleRole(role.id)}
              className={`px-3 py-1.5 text-xs border transition-colors duration-150 ${
                selectedRoles.has(role.id)
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground-secondary hover:border-foreground-muted'
              }`}
            >
              {role.label}
            </button>
          ))}
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

      {/* Win Rates List */}
      <div className="space-y-0">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Champion</div>
          <div className="col-span-2">Games</div>
          <div className="col-span-3">Win Rate</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredChampions.map((champion, index) => (
          <div
            key={champion.id}
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
              <ChampionPortrait champion={champion} size={32} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground font-medium">{champion.name}</span>
                <RoleIcon role={champion.role} size={14} />
              </div>
            </div>

            {/* Games */}
            <div className="hidden md:flex col-span-2 items-center">
              <span className="font-mono text-sm text-foreground-secondary">
                {champion.picks.toLocaleString()}
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
                onClick={() => onChampionClick(champion)}
                className="px-3 py-1 text-xs border border-border text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors duration-150"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
