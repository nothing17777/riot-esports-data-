'use client'

import Image from 'next/image'
import type { Champion } from '@/lib/data'

interface ChampionPortraitProps {
  champion: Champion
  size?: number
  className?: string
}

export function ChampionPortrait({ champion, size = 32, className = '' }: ChampionPortraitProps) {
  return (
    <div 
      className={`relative rounded-full overflow-hidden border border-border flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={champion.imageUrl}
        alt={champion.name}
        width={size}
        height={size}
        className="object-cover"
        unoptimized
      />
    </div>
  )
}

interface ChampionClusterProps {
  champions: Champion[]
  size?: number
}

export function ChampionCluster({ champions, size = 32 }: ChampionClusterProps) {
  return (
    <div className="flex items-center -space-x-2">
      {champions.map((champion, i) => (
        <ChampionPortrait 
          key={champion.id} 
          champion={champion} 
          size={size}
          className="ring-2 ring-background"
        />
      ))}
    </div>
  )
}
