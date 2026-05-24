'use client'

interface ScoreBarProps {
  value: number
  maxValue?: number
  colorClass?: string
  width?: number
}

export function ScoreBar({ value, maxValue = 100, colorClass, width = 100 }: ScoreBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  // Determine color based on value if not provided
  const getColorClass = () => {
    if (colorClass) return colorClass
    if (value >= 55) return 'bg-win'
    if (value >= 50) return 'bg-amber'
    return 'bg-loss'
  }

  return (
    <div className="score-bar" style={{ width }}>
      <div 
        className={`score-bar-fill ${getColorClass()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

interface PresenceBarProps {
  value: number
  width?: number
}

export function PresenceBar({ value, width = 80 }: PresenceBarProps) {
  return (
    <div className="score-bar" style={{ width }}>
      <div 
        className="score-bar-fill bg-accent dark:bg-accent-cyan"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
