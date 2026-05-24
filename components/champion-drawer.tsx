'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Champion } from '@/lib/data'
import { ChampionPortrait } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar, PresenceBar } from './score-bar'

interface ChampionDrawerProps {
  champion: Champion | null
  onClose: () => void
}

// Mock recent games data
const getMockRecentGames = (champion: Champion) => [
  { date: '2026-01-15', league: 'LCK', team: 'T1', result: 'win' as const, kda: '5/2/8' },
  { date: '2026-01-14', league: 'LPL', team: 'JDG', result: 'win' as const, kda: '4/1/6' },
  { date: '2026-01-13', league: 'LEC', team: 'G2', result: 'loss' as const, kda: '2/4/5' },
  { date: '2026-01-12', league: 'LCK', team: 'Gen.G', result: 'win' as const, kda: '6/3/9' },
  { date: '2026-01-11', league: 'LCS', team: 'C9', result: 'loss' as const, kda: '1/5/3' },
  { date: '2026-01-10', league: 'LPL', team: 'BLG', result: 'win' as const, kda: '7/2/4' },
  { date: '2026-01-09', league: 'LCK', team: 'DRX', result: 'win' as const, kda: '3/1/11' },
  { date: '2026-01-08', league: 'LEC', team: 'FNC', result: 'win' as const, kda: '4/2/7' },
]

export function ChampionDrawer({ champion, onClose }: ChampionDrawerProps) {
  if (!champion) return null

  const recentGames = getMockRecentGames(champion)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChampionPortrait champion={champion} size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl text-foreground">{champion.name}</h2>
                <RoleIcon role={champion.role} size={16} />
              </div>
              <p className="text-xs text-foreground-muted uppercase tracking-wider">{champion.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-foreground-muted mb-1">Presence</div>
              <div className="flex items-center gap-2">
                <PresenceBar value={champion.presence} width={60} />
                <span className="font-mono text-sm text-foreground">{champion.presence.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-foreground-muted mb-1">Win Rate</div>
              <div className="flex items-center gap-2">
                <ScoreBar value={champion.winRate} width={60} />
                <span className={`font-mono text-sm ${
                  champion.winRate >= 55 ? 'text-win' :
                  champion.winRate >= 50 ? 'text-amber' :
                  'text-loss'
                }`}>
                  {champion.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-foreground-muted mb-1">Picks</div>
              <span className="font-mono text-lg text-foreground">{champion.picks.toLocaleString()}</span>
            </div>
            <div>
              <div className="text-xs text-foreground-muted mb-1">Bans</div>
              <span className="font-mono text-lg text-foreground">{champion.bans.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="px-6 py-6">
          <h3 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">Last 50 Games</h3>
          <div className="space-y-0">
            {recentGames.map((game, index) => (
              <div 
                key={index}
                className="grid grid-cols-5 gap-2 py-2 border-b border-border text-sm"
              >
                <span className="font-mono text-foreground-muted">{game.date.slice(5)}</span>
                <span className="text-foreground-secondary">{game.league}</span>
                <span className="text-foreground">{game.team}</span>
                <span className={game.result === 'win' ? 'text-win' : 'text-loss'}>
                  {game.result === 'win' ? 'W' : 'L'}
                </span>
                <span className="font-mono text-foreground-secondary text-right">{game.kda}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
