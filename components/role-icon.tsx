'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

const ROLE_ICONS = {
  top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
  jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
  mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
  bot: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
  support: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png',
}

interface RoleIconProps {
  role: 'top' | 'jungle' | 'mid' | 'bot' | 'support'
  size?: number
  className?: string
}

export function RoleIcon({ role, size = 16, className = '' }: RoleIconProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Image
      src={ROLE_ICONS[role]}
      alt={role}
      width={size}
      height={size}
      className={`${isDark ? 'role-icon-dark' : 'role-icon-light'} ${className}`}
      unoptimized
    />
  )
}
