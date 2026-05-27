'use client'

import { motion } from 'framer-motion'
import { X, Eye } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useCallback } from 'react'
import type { MatchDetail, MatchParticipant, Champion } from '@/lib/data'
import { RoleIcon } from './role-icon'

interface MatchDetailModalProps {
  match: MatchDetail | null
  onClose: () => void
  onPlayerClick?: (playerId: string) => void
  onChampionClick?: (champion: Champion) => void
}

function formatGold(gold: number): string {
  return (gold / 1000).toFixed(1) + 'k'
}

function BannedChampion({ champion }: { champion: Champion }) {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
      <Image
        src={champion.imageUrl}
        alt={champion.name}
        width={32}
        height={32}
        className="object-cover grayscale opacity-60"
        unoptimized
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <X className="w-5 h-5 text-loss/80 stroke-[3]" />
      </div>
    </div>
  )
}

function PlayerRow({ 
  participant, 
  side,
  matchupWinner,
  onPlayerClick,
  onChampionClick,
}: { 
  participant: MatchParticipant
  side: 'blue' | 'red'
  matchupWinner?: 'blue' | 'red' | 'tie'
  onPlayerClick?: (playerId: string) => void
  onChampionClick?: (champion: Champion) => void
}) {
  const isBlue = side === 'blue'
  
  const kdaContent = (
    <span className="font-mono text-sm whitespace-nowrap w-24 text-center inline-block">
      <span className="text-win">{participant.kills}</span>
      <span className="text-foreground-muted"> / </span>
      <span className="text-loss">{participant.deaths}</span>
      <span className="text-foreground-muted"> / </span>
      <span className="text-foreground-secondary">{participant.assists}</span>
    </span>
  )

  const statsContent = (
    <>
      <span className="font-mono text-sm text-foreground-muted w-12 text-center">{participant.cs}</span>
      <span className="font-mono text-sm text-amber w-14 text-center">{formatGold(participant.gold)}</span>
      <span className="font-mono text-sm text-foreground-muted flex items-center gap-1 w-10 justify-center">
        <Eye className="w-3 h-3" />
        {participant.visionScore}
      </span>
    </>
  )

  const championPortrait = (
    <button
      onClick={() => onChampionClick?.(participant.champion)}
      className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-foreground-muted transition-colors flex-shrink-0 cursor-pointer"
    >
      <Image
        src={participant.champion.imageUrl}
        alt={participant.champion.name}
        width={40}
        height={40}
        className="object-cover"
        unoptimized
      />
    </button>
  )

  const playerName = (
    <button
      onClick={() => onPlayerClick?.(participant.playerId)}
      className="font-medium text-foreground hover:underline cursor-pointer text-sm"
    >
      {participant.player}
    </button>
  )

  const championName = (
    <span className="text-xs text-foreground-muted truncate max-w-[70px]">
      {participant.champion.name}
    </span>
  )

  if (isBlue) {
    return (
      <div className="flex items-center gap-3 py-2.5">
        <RoleIcon role={participant.position} size={16} className="flex-shrink-0" />
        {championPortrait}
        <div className="flex flex-col min-w-0 w-20">
          {playerName}
          {championName}
        </div>
        {kdaContent}
        {statsContent}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-2.5 justify-end">
      {statsContent}
      {kdaContent}
      <div className="flex flex-col items-end min-w-0 w-20">
        {playerName}
        {championName}
      </div>
      {championPortrait}
      <RoleIcon role={participant.position} size={16} className="flex-shrink-0" />
    </div>
  )
}

export function MatchDetailModal({ match, onClose, onPlayerClick, onChampionClick }: MatchDetailModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!match) return null

  const totalGold = match.blue.totals.gold + match.red.totals.gold
  const blueGoldPercent = (match.blue.totals.gold / totalGold) * 100
  const totalKills = match.blue.totals.kills + match.red.totals.kills

  // Calculate team KDAs
  const blueKDA = match.blue.totals.deaths > 0 
    ? ((match.blue.totals.kills + match.blue.players.reduce((sum, p) => sum + p.assists, 0)) / match.blue.totals.deaths).toFixed(1)
    : 'Perfect'
  const redKDA = match.red.totals.deaths > 0
    ? ((match.red.totals.kills + match.red.players.reduce((sum, p) => sum + p.assists, 0)) / match.red.totals.deaths).toFixed(1)
    : 'Perfect'

  // Find MVP (highest KDA on winning team)
  const winningTeam = match.winner === 'blue' ? match.blue : match.red
  const mvp = [...winningTeam.players].sort((a, b) => b.kda - a.kda)[0]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="match-detail-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[60]"
      />

      {/* Modal */}
      <motion.div
        key="match-detail-modal"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed inset-4 md:inset-8 lg:inset-16 bg-background border border-border rounded-lg z-[60] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-foreground-muted font-mono">
              {match.league} · {match.date} · Patch {match.patch}
            </span>
            {match.playoffs && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber/20 text-amber rounded uppercase tracking-wider">
                Playoffs
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-row-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Match Title */}
          <div className="px-6 py-8 text-center border-b border-border">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <div className={`text-right ${match.blue.won ? '' : 'opacity-70'}`}>
                <h2 className={`font-serif text-2xl md:text-3xl ${match.blue.won ? 'font-bold text-foreground' : 'text-foreground-secondary'}`}>
                  {match.blue.team}
                </h2>
                {match.blue.won && (
                  <span className="text-xs tracking-widest uppercase text-win font-medium">Victory</span>
                )}
                {!match.blue.won && (
                  <span className="text-xs tracking-widest uppercase text-loss font-medium">Defeat</span>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <span className="font-mono text-3xl md:text-4xl text-foreground-muted">vs</span>
                <span className="font-mono text-lg text-foreground-secondary mt-1">{match.duration}</span>
              </div>

              <div className={`text-left ${match.red.won ? '' : 'opacity-70'}`}>
                <h2 className={`font-serif text-2xl md:text-3xl ${match.red.won ? 'font-bold text-foreground' : 'text-foreground-secondary'}`}>
                  {match.red.team}
                </h2>
                {match.red.won && (
                  <span className="text-xs tracking-widest uppercase text-win font-medium">Victory</span>
                )}
                {!match.red.won && (
                  <span className="text-xs tracking-widest uppercase text-loss font-medium">Defeat</span>
                )}
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6">
              {/* Blue Team */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${match.blue.won ? 'border-l-win bg-win/5' : 'border-l-loss/30 bg-surface'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-foreground">{match.blue.team}</h3>
                  <span className="font-mono text-sm text-foreground-muted">
                    {match.blue.totals.kills} kills · {formatGold(match.blue.totals.gold)}
                  </span>
                </div>
                <div className="flex items-center gap-3 pb-2 text-[10px] tracking-wider font-mono uppercase text-foreground-muted border-b border-border/40 mb-1">
                  <div className="w-4 flex-shrink-0" />
                  <div className="w-10 flex-shrink-0" />
                  <div className="w-20 flex-shrink-0">Player</div>
                  <div className="w-24 text-center">KDA</div>
                  <div className="w-12 text-center">CS</div>
                  <div className="w-14 text-center">Gold</div>
                  <div className="w-10 text-center">VS</div>
                </div>
                <div className="divide-y divide-border">
                  {match.blue.players.map((player, index) => (
                    <motion.div
                      key={player.playerId + '-' + index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <PlayerRow 
                        participant={player} 
                        side="blue"
                        onPlayerClick={onPlayerClick}
                        onChampionClick={onChampionClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Center Lane Matchup Indicators */}
              <div className="hidden lg:flex flex-col items-center justify-center gap-2 py-4">
                {match.blue.players.map((bluePlayer, index) => {
                  const redPlayer = match.red.players[index]
                  const blueAdvantage = bluePlayer.gold > redPlayer.gold
                  const diff = Math.abs(bluePlayer.gold - redPlayer.gold)
                  return (
                    <div key={index} className="flex items-center gap-2 h-[52px]">
                      <div className={`w-2 h-2 rounded-full ${blueAdvantage ? 'bg-accent dark:bg-accent-cyan' : 'bg-transparent'}`} />
                      <span className="font-mono text-xs text-foreground-muted w-12 text-center">
                        {diff > 500 ? (blueAdvantage ? '+' : '-') + formatGold(diff) : '—'}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${!blueAdvantage && diff > 500 ? 'bg-loss' : 'bg-transparent'}`} />
                    </div>
                  )
                })}
              </div>

              {/* Red Team */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg border-r-4 ${match.red.won ? 'border-r-win bg-win/5' : 'border-r-loss/30 bg-surface'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-foreground-muted">
                    {formatGold(match.red.totals.gold)} · {match.red.totals.kills} kills
                  </span>
                  <h3 className="font-serif text-lg font-bold text-foreground">{match.red.team}</h3>
                </div>
                <div className="flex items-center gap-3 pb-2 text-[10px] tracking-wider font-mono uppercase text-foreground-muted border-b border-border/40 mb-1 justify-end">
                  <div className="w-10 text-center">VS</div>
                  <div className="w-14 text-center">Gold</div>
                  <div className="w-12 text-center">CS</div>
                  <div className="w-24 text-center">KDA</div>
                  <div className="w-20 text-right flex-shrink-0">Player</div>
                  <div className="w-10 flex-shrink-0" />
                  <div className="w-4 flex-shrink-0" />
                </div>
                <div className="divide-y divide-border">
                  {match.red.players.map((player, index) => (
                    <motion.div
                      key={player.playerId + '-' + index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <PlayerRow 
                        participant={player} 
                        side="red"
                        onPlayerClick={onPlayerClick}
                        onChampionClick={onChampionClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Gold Distribution Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-4 border-t border-border"
          >
            <div className="text-xs tracking-widest uppercase text-foreground-muted text-center mb-3">
              Gold Distribution
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-foreground-secondary w-16 text-right">
                {blueGoldPercent.toFixed(0)}%
              </span>
              <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${blueGoldPercent}%` }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                  className="h-full bg-accent/60 dark:bg-accent-cyan/60"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - blueGoldPercent}%` }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                  className="h-full bg-loss/40"
                />
              </div>
              <span className="font-mono text-sm text-foreground-secondary w-16">
                {(100 - blueGoldPercent).toFixed(0)}%
              </span>
            </div>
            <div className="text-center mt-2">
              <span className="font-mono text-sm text-foreground-muted">
                Total: {formatGold(totalGold)}
              </span>
            </div>
          </motion.div>

          {/* KDA Summary */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-xs tracking-widest uppercase text-foreground-muted mb-1">Blue KDA</div>
                <div className="font-mono text-xl text-foreground">{blueKDA}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-xs tracking-widest uppercase text-foreground-muted mb-1">Total Kills</div>
                <div className="font-mono text-xl text-foreground">
                  <span className="text-accent dark:text-accent-cyan">{match.blue.totals.kills}</span>
                  <span className="text-foreground-muted mx-2">—</span>
                  <span className="text-loss">{match.red.totals.kills}</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-xs tracking-widest uppercase text-foreground-muted mb-1">Red KDA</div>
                <div className="font-mono text-xl text-foreground">{redKDA}</div>
              </div>
            </div>
          </div>

          {/* Bans Strip */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {match.blue.bans.map((champion, index) => (
                  <BannedChampion key={'blue-ban-' + index} champion={champion} />
                ))}
              </div>
              <span className="text-xs tracking-widest uppercase text-foreground-muted">Bans</span>
              <div className="flex items-center gap-2">
                {match.red.bans.map((champion, index) => (
                  <BannedChampion key={'red-ban-' + index} champion={champion} />
                ))}
              </div>
            </div>
          </div>

          {/* MVP Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 py-4 border-t border-border"
          >
            <div className="flex items-center justify-center gap-4 p-4 bg-amber/10 rounded-lg border border-amber/20">
              <button
                onClick={() => onChampionClick?.(mvp.champion)}
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber hover:border-amber/70 transition-colors cursor-pointer"
              >
                <Image
                  src={mvp.champion.imageUrl}
                  alt={mvp.champion.name}
                  width={48}
                  height={48}
                  className="object-cover"
                  unoptimized
                />
              </button>
              <div>
                <div className="text-xs tracking-widest uppercase text-amber mb-0.5">Match MVP</div>
                <button
                  onClick={() => onPlayerClick?.(mvp.playerId)}
                  className="font-serif text-lg text-foreground hover:underline cursor-pointer"
                >
                  {mvp.player}
                </button>
                <span className="font-mono text-sm text-foreground-muted ml-2">
                  {mvp.kills}/{mvp.deaths}/{mvp.assists} · {mvp.kda.toFixed(1)} KDA
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
