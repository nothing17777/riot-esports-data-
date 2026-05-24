'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react'
import { leagues } from '@/lib/data'

const navLinks = [
  { href: '#presence', label: 'Presence' },
  { href: '#synergy', label: 'Synergy' },
  { href: '#counters', label: 'Counters' },
  { href: '#lane-matchups', label: 'Lane Matchups' },
  { href: '#win-rates', label: 'Win Rates' },
  { href: '#matches', label: 'Matches' },
  { href: '#players', label: 'Players' },
  { href: '/db-status', label: 'DB Status' },
]

interface NavbarProps {
  selectedLeague: string
  onLeagueChange: (league: string) => void
}

export function Navbar({ selectedLeague, onLeagueChange }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl tracking-tight text-foreground">
            ESPORTS.DATA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* League Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLeagueDropdownOpen(!leagueDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded bg-transparent hover:bg-surface transition-colors duration-150"
              >
                <span className="text-foreground-secondary">{selectedLeague}</span>
                <ChevronDown className="w-4 h-4 text-foreground-muted" />
              </button>
              <AnimatePresence>
                {leagueDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-40 bg-background border border-border rounded shadow-sm z-50"
                  >
                    {leagues.map((league) => (
                      <button
                        key={league}
                        onClick={() => {
                          onLeagueChange(league)
                          setLeagueDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-surface transition-colors duration-150 ${
                          selectedLeague === league ? 'text-foreground font-medium' : 'text-foreground-secondary'
                        }`}
                      >
                        {league}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground-secondary hover:text-foreground transition-colors duration-150"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground-secondary hover:text-foreground transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-foreground-secondary hover:text-foreground transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border">
                <select
                  value={selectedLeague}
                  onChange={(e) => onLeagueChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded bg-transparent text-foreground"
                >
                  {leagues.map((league) => (
                    <option key={league} value={league}>
                      {league}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
