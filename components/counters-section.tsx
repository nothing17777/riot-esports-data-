'use client'

import { useState } from 'react'
import { counterPairs, type Champion } from '@/lib/data'
import { ChampionPortrait, ChampionCluster } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

const tabs = [
  { id: '1v1', label: '1v1' },
  { id: '2v2', label: '2v2 Duos' },
  { id: '3v3', label: '3v3' },
  { id: '4v4', label: '4v4' },
  { id: '5v5', label: '5v5' },
]

const rolePairFilters = [
  { id: 'any', label: 'ANY' },
  { id: 'bot-sup', label: 'BOT+SUP' },
  { id: 'top-jgl', label: 'TOP+JGL' },
  { id: 'top-mid', label: 'TOP+MID' },
  { id: 'mid-jgl', label: 'MID+JGL' },
]

interface CountersSectionProps {
  onChampionClick: (champion: Champion) => void
}

export function CountersSection({ onChampionClick }: CountersSectionProps) {
  const [activeTab, setActiveTab] = useState('1v1')
  const [rolePairFilter, setRolePairFilter] = useState('any')

  const currentCounters = counterPairs[activeTab] || []

  return (
    <section id="counters" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Counters</h2>
        <div className="h-px bg-border" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Role Pair Filter (2v2 only) */}
      {activeTab === '2v2' && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {rolePairFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setRolePairFilter(filter.id)}
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

      {/* Counter List */}
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

        {currentCounters.map((counter, index) => (
          <div
            key={counter.id}
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

            {/* Winner */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-2">
              <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
              {counter.winner.length === 1 ? (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => onChampionClick(counter.winner[0])}
                >
                  <ChampionPortrait champion={counter.winner[0]} size={32} />
                  <span className="text-sm text-foreground">{counter.winner[0].name}</span>
                  <RoleIcon role={counter.winner[0].role} size={14} />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <ChampionCluster champions={counter.winner} size={28} />
                  <div className="flex flex-wrap gap-1 text-xs text-foreground-secondary">
                    {counter.winner.map((c, i) => (
                      <span 
                        key={c.id}
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => onChampionClick(c)}
                      >
                        {c.name}{i < counter.winner.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* VS */}
            <div className="hidden md:flex col-span-1 items-center justify-center">
              <span className="text-xs italic text-foreground-muted">beats</span>
            </div>

            {/* Loser */}
            <div className="hidden md:flex col-span-3 items-center gap-2">
              {counter.loser.length === 1 ? (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => onChampionClick(counter.loser[0])}
                >
                  <ChampionPortrait champion={counter.loser[0]} size={32} />
                  <span className="text-sm text-foreground-secondary">{counter.loser[0].name}</span>
                  <RoleIcon role={counter.loser[0].role} size={14} />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <ChampionCluster champions={counter.loser} size={28} />
                  <div className="flex flex-wrap gap-1 text-xs text-foreground-secondary">
                    {counter.loser.map((c, i) => (
                      <span 
                        key={c.id}
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => onChampionClick(c)}
                      >
                        {c.name}{i < counter.loser.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="hidden md:flex col-span-2 items-center gap-2">
              <ScoreBar value={counter.score} width={60} />
              <span className="font-mono text-sm text-foreground">{counter.score.toFixed(1)}</span>
            </div>

            {/* W/G */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-end">
              <span className="font-mono text-sm text-foreground-muted">
                {counter.wins}/{counter.games}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
