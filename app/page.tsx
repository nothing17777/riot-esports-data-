'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Champion } from '@/lib/data'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { PresenceSection } from '@/components/presence-section'
import { SynergySection } from '@/components/synergy-section'
import { CountersSection } from '@/components/counters-section'
import { LaneMatchupsSection } from '@/components/lane-matchups-section'
import { WinRatesSection } from '@/components/win-rates-section'
import { MatchHistorySection } from '@/components/match-history-section'
import { PlayersSection } from '@/components/players-section'
import { ChampionDrawer } from '@/components/champion-drawer'
import { PlayerProfile } from '@/components/player-profile'

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState('All Leagues')
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <Navbar 
        selectedLeague={selectedLeague} 
        onLeagueChange={setSelectedLeague} 
      />
      
      <HeroSection />
      
      <PresenceSection onChampionClick={setSelectedChampion} />
      
      <SynergySection onChampionClick={setSelectedChampion} />
      
      <CountersSection onChampionClick={setSelectedChampion} />
      
      <LaneMatchupsSection onChampionClick={setSelectedChampion} />
      
      <WinRatesSection onChampionClick={setSelectedChampion} />
      
      <MatchHistorySection 
        onPlayerClick={setSelectedPlayer}
        onChampionClick={setSelectedChampion}
      />
      
      <PlayersSection onPlayerClick={setSelectedPlayer} />

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-serif text-lg text-foreground mb-2">ESPORTS.DATA</p>
          <p className="text-xs text-foreground-muted">
            {"Data sourced from Oracle's Elixir · 2014–2026 · Professional League of Legends Analytics"}
          </p>
        </div>
      </footer>

      {/* Champion Drawer */}
      <AnimatePresence>
        {selectedChampion && (
          <ChampionDrawer 
            champion={selectedChampion} 
            onClose={() => setSelectedChampion(null)} 
          />
        )}
      </AnimatePresence>

      {/* Player Profile */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerProfile 
            playerName={selectedPlayer} 
            onClose={() => setSelectedPlayer(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  )
}
