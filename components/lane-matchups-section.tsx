'use client'

import { useState } from 'react'
import { laneMatchups, type Champion } from '@/lib/data'
import { ChampionPortrait } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

const roles = [
  { id: 'top', label: 'TOP' },
  { id: 'jungle', label: 'JUNGLE' },
  { id: 'mid', label: 'MID' },
  { id: 'bot', label: 'BOT' },
  { id: 'support', label: 'SUPPORT' },
] as const

interface LaneMatchupsSectionProps {
  onChampionClick: (champion: Champion) => void
}

export function LaneMatchupsSection({ onChampionClick }: LaneMatchupsSectionProps) {
  const [activeRole, setActiveRole] = useState<typeof roles[number]['id']>('mid')

  const filteredMatchups = laneMatchups.filter((m) => m.role === activeRole)

  return (
    <section id="lane-matchups" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Lane Matchups</h2>
        <div className="h-px bg-border" />
      </div>

      {/* Role Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors duration-150 ${
              activeRole === role.id
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground-secondary hover:border-foreground-muted'
            }`}
          >
            <RoleIcon role={role.id} size={16} />
            <span>{role.label}</span>
          </button>
        ))}
      </div>

      {/* Matchup List */}
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

        {filteredMatchups.map((matchup, index) => (
          <div
            key={matchup.id}
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
                onClick={() => onChampionClick(matchup.championA)}
              >
                <ChampionPortrait champion={matchup.championA} size={32} />
                <span className="text-sm text-foreground">{matchup.championA.name}</span>
                <RoleIcon role={matchup.championA.role} size={14} />
              </div>
            </div>

            {/* VS */}
            <div className="hidden md:flex col-span-1 items-center justify-center">
              <div className="flex items-center gap-1">
                <RoleIcon role={matchup.role} size={14} />
                <span className="text-xs text-foreground-muted">VS</span>
                <RoleIcon role={matchup.role} size={14} />
              </div>
            </div>

            {/* Champion B */}
            <div className="hidden md:flex col-span-3 items-center gap-2">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                onClick={() => onChampionClick(matchup.championB)}
              >
                <ChampionPortrait champion={matchup.championB} size={32} />
                <span className="text-sm text-foreground-secondary">{matchup.championB.name}</span>
                <RoleIcon role={matchup.championB.role} size={14} />
              </div>
            </div>

            {/* Score */}
            <div className="hidden md:flex col-span-2 items-center gap-2">
              <ScoreBar value={matchup.score} width={60} />
              <span className="font-mono text-sm text-foreground">{matchup.score.toFixed(1)}</span>
            </div>

            {/* W/G */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-end">
              <span className="font-mono text-sm text-foreground-muted">
                {matchup.wins}/{matchup.games}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
