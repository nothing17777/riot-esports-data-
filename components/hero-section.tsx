'use client'

import { stats } from '@/lib/data'

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main Headline */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6 text-balance">
          Professional League of Legends
          <br />
          <span className="text-foreground-secondary">Analytics & Statistics</span>
        </h1>
        <p className="text-sm tracking-widest uppercase text-foreground-muted">
          {"Oracle's Elixir · 2014–2026 · 98,000+ Matches"}
        </p>
      </div>

      {/* Stats Strip */}
      <div className="border-t border-b border-border py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-0 lg:divide-x divide-border">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center lg:px-4">
              <div className="font-mono text-2xl md:text-3xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
