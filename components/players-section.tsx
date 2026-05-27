'use client'

import { useState } from 'react'
import { Search, Database } from 'lucide-react'
import useSWR, { preload } from 'swr'
import { RoleIcon } from './role-icon'

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Preload player data on hover so it's cached before the user clicks
function prefetchPlayer(name: string) {
  preload(`/api/players/${encodeURIComponent(name)}`, fetcher)
}

const roles = [
  { id: 'all', label: 'ALL' },
  { id: 'top', label: 'TOP' },
  { id: 'jungle', label: 'JGL' },
  { id: 'mid', label: 'MID' },
  { id: 'bot', label: 'BOT' },
  { id: 'support', label: 'SUP' },
] as const

interface PlayersSectionProps {
  onPlayerClick: (playerName: string) => void
}

export function PlayersSection({ onPlayerClick }: PlayersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const params = new URLSearchParams()
  if (selectedRole !== 'all') {
    // Map support to sup since that is the position key in many DB structures or api filters
    const pos = selectedRole === 'support' ? 'sup' : selectedRole
    params.append('position', pos)
  }
  if (searchQuery) params.append('search', searchQuery)
  params.append('limit', '100')

  const { data, isLoading, error } = useSWR(`/api/players?${params.toString()}`, fetcher)
  const players = data?.data || []

  return (
    <section id="players" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Players</h2>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
            <Database className="w-3 h-3" />
            Live Data
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-3 py-1.5 text-xs border transition-colors duration-150 ${
                selectedRole === role.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground-secondary hover:border-foreground-muted'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="text-center py-12 text-foreground-muted">Loading players...</div>}
      {error && <div className="text-center py-12 text-red-500">Error loading players</div>}

      {!isLoading && !error && (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-xs tracking-widest uppercase text-foreground-muted border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-right">Games</div>
            <div className="col-span-2 text-right">Wins</div>
            <div className="col-span-2 text-right">Win Rate</div>
          </div>

          {players.map((player: any, index: number) => (
            <div
              key={player.id || player.name}
              onClick={() => onPlayerClick(player.name)}
              onMouseEnter={() => prefetchPlayer(player.name)}
              className="grid grid-cols-2 md:grid-cols-12 gap-4 py-3 border-b border-border hover:bg-row-hover transition-colors duration-150 cursor-pointer"
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

              {/* Player */}
              <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                <span className="md:hidden font-mono text-sm text-foreground-muted w-6">{index + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground font-medium">{player.name}</span>
                  <RoleIcon role={player.role || player.position} size={14} />
                </div>
                {player.career && (
                  <span className="text-xs text-foreground-muted hidden sm:inline truncate max-w-48">
                    {player.career}
                  </span>
                )}
              </div>

              {/* Games */}
              <div className="hidden md:flex col-span-2 items-center justify-end">
                <span className="font-mono text-sm text-foreground-secondary">{(player.games || 0).toLocaleString()}</span>
              </div>

              {/* Wins */}
              <div className="hidden md:flex col-span-2 items-center justify-end">
                <span className="font-mono text-sm text-foreground-secondary">{(player.wins || 0).toLocaleString()}</span>
              </div>

              {/* Win Rate */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-end">
                <span className={`font-mono text-sm ${
                  player.winRate >= 55 ? 'text-win' :
                  player.winRate >= 50 ? 'text-amber' :
                  'text-loss'
                }`}>
                  {(player.winRate || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}

          {players.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">No players found</div>
          )}
        </div>
      )}
    </section>
  )
}
