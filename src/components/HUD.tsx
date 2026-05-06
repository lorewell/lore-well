import type { CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'

export default function HUD() {
  const player = useGameStore((s) => s.player)
  const location = useGameStore((s) => s.currentLocationId)
  const gold = useGameStore((s) => s.gold)
  const locationName = LOCATIONS[location]?.name ?? location

  const hpPct = (player.stats.hp / player.stats.maxHp) * 100
  const mpPct = (player.stats.mp / player.stats.maxMp) * 100
  const expPct = (player.exp / player.expToNext) * 100

  return (
    <div className="pixel-hud">
      <div className="pixel-panel pixel-hud-card w-full max-w-md">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="pixel-label mb-1">WANDERER</div>
            <div className="truncate text-sm font-bold tracking-[0.12em]" style={{ color: '#f8e7b7' }}>
              {player.name}
            </div>
          </div>
          <div className="shrink-0 border-2 px-2 py-1 text-xs font-bold" style={{ borderColor: '#59442a', color: '#d6a845' }}>
            LV {player.level}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <StatusBar
            label="HP"
            current={player.stats.hp}
            max={player.stats.maxHp}
            pct={hpPct}
            color="var(--pixel-green)"
            lowColor="var(--pixel-red)"
          />
          <StatusBar
            label="MP"
            current={player.stats.mp}
            max={player.stats.maxMp}
            pct={mpPct}
            color="var(--pixel-blue)"
            lowColor="var(--pixel-blue)"
          />
          <StatusBar
            label="XP"
            current={player.exp}
            max={player.expToNext}
            pct={expPct}
            color="var(--pixel-gold)"
            lowColor="var(--pixel-gold)"
            compact
          />
        </div>
      </div>

      <div className="pixel-panel pixel-hud-card hidden min-w-52 sm:block">
        <div className="pixel-label mb-3 text-right">CURRENT AREA</div>
        <div className="text-right text-sm font-bold tracking-[0.12em]" style={{ color: '#f8e7b7' }}>
          {locationName}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <span className="border-2 px-2 py-1 text-xs font-bold" style={{ borderColor: '#6d4d26', color: '#f1c45d' }}>
            GOLD
          </span>
          <span className="text-sm font-bold" style={{ color: '#f1c45d' }}>{gold} G</span>
        </div>
      </div>
    </div>
  )
}

interface StatusBarProps {
  label: string
  current: number
  max: number
  pct: number
  color: string
  lowColor: string
  compact?: boolean
}

function StatusBar({ label, current, max, pct, color, lowColor, compact = false }: StatusBarProps) {
  const safePct = Math.max(0, Math.min(100, pct))
  const barColor = safePct < 25 ? lowColor : color
  const meterStyle = {
    '--meter-color': barColor,
    width: `${safePct}%`,
  } as CSSProperties

  return (
    <div className="grid grid-cols-[30px_minmax(0,1fr)_64px] items-center gap-2">
      <span className="text-[10px] font-bold" style={{ color: '#d0ad6f' }}>{label}</span>
      <div className={compact ? 'pixel-meter h-2' : 'pixel-meter'}>
        <div className="pixel-meter__fill" style={meterStyle} />
      </div>
      <span className="text-right text-[10px]" style={{ color: '#b68f59' }}>
        {current}/{max}
      </span>
    </div>
  )
}
