'use client'

import { motion } from 'framer-motion'
import { X, ArrowLeft } from 'lucide-react'
import type { Player } from '@/lib/data'
import { ChampionPortrait } from './champion-portrait'
import { RoleIcon } from './role-icon'
import { ScoreBar } from './score-bar'

interface PlayerProfileProps {
  player: Player | null
  onClose: () => void
}

export function PlayerProfile({ player, onClose }: PlayerProfileProps) {
  if (!player) return null

  const maxGames = Math.max(...player.activityByYear.map((a) => a.games))

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
                {player.yearsActive}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">Years</div>
            </div>
          </div>
        </div>

        {/* Champion Pool */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">Champion Pool</h2>
          <div className="h-px bg-border mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {player.championPool.map((cp) => (
              <div key={cp.champion.id} className="border border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ChampionPortrait champion={cp.champion} size={40} />
                  <div>
                    <div className="text-sm text-foreground font-medium">{cp.champion.name}</div>
                    <div className="text-xs text-foreground-muted">{cp.games} games</div>
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
                    <span className="font-mono text-xs text-foreground">{cp.kda.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity by Year */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">Activity by Year</h2>
          <div className="h-px bg-border mb-4" />
          <div className="flex items-end gap-1 h-32">
            {player.activityByYear.map((activity) => (
              <div key={activity.year} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-foreground dark:bg-accent-cyan/60 transition-all"
                  style={{ height: `${(activity.games / maxGames) * 100}%` }}
                />
                <span className="text-xs text-foreground-muted mt-2 rotate-[-45deg] origin-top-left">
                  {activity.year.toString().slice(2)}
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
            {player.leagueBreakdown.map((league) => (
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
        <div>
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
                {player.recentMatches.map((match, index) => (
                  <tr 
                    key={index}
                    className="border-b border-border"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
