'use client'

import { useState } from 'react'
import { synergyPairs, type SynergyPair, type Champion } from '@/lib/data'
import { ChampionPortrait, ChampionCluster } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

const tabs = [
  { id: 2, label: '2 Champions' },
  { id: 3, label: '3 Champions' },
  { id: 4, label: '4 Champions' },
  { id: 5, label: '5 Champions' },
]

interface SynergySectionProps {
  onChampionClick: (champion: Champion) => void
}

export function SynergySection({ onChampionClick }: SynergySectionProps) {
  const [activeTab, setActiveTab] = useState(2)

  const currentPairs = synergyPairs[activeTab] || []

  return (
    <section id="synergy" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Synergy</h2>
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

      {/* Synergy List */}
      <div className="space-y-0">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6">Champions</div>
          <div className="col-span-3">Score</div>
          <div className="col-span-2 text-right">W/G</div>
        </div>

        {currentPairs.map((pair, index) => (
          <div
            key={pair.id}
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
              
              {activeTab === 2 ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    onClick={() => onChampionClick(pair.champions[0])}
                  >
                    <ChampionPortrait champion={pair.champions[0]} size={32} />
                    <span className="text-sm text-foreground">{pair.champions[0].name}</span>
                    <RoleIcon role={pair.champions[0].role} size={14} />
                  </div>
                  <span className="text-foreground-muted">+</span>
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    onClick={() => onChampionClick(pair.champions[1])}
                  >
                    <ChampionPortrait champion={pair.champions[1]} size={32} />
                    <span className="text-sm text-foreground">{pair.champions[1].name}</span>
                    <RoleIcon role={pair.champions[1].role} size={14} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <ChampionCluster champions={pair.champions} size={28} />
                  <div className="flex flex-wrap gap-1 text-xs text-foreground-secondary">
                    {pair.champions.map((c, i) => (
                      <span 
                        key={c.id} 
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => onChampionClick(c)}
                      >
                        {c.name}{i < pair.champions.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="hidden md:flex col-span-3 items-center gap-2">
              <ScoreBar value={pair.score} colorClass="bg-accent dark:bg-accent-cyan" width={80} />
              <span className="font-mono text-sm text-foreground">{pair.score.toFixed(1)}</span>
            </div>

            {/* W/G */}
            <div className="col-span-1 md:col-span-2 flex items-center justify-end">
              <span className="font-mono text-sm text-foreground-muted">
                {pair.wins}/{pair.games}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
