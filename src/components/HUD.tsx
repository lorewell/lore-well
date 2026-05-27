import type { CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Character } from '../types'

export default function HUD() {
  const player = useGameStore((s) => s.player)
  const companions = useGameStore((s) => s.companions)
  const gold = useGameStore((s) => s.gold)

  // 队伍：主角 + 同伴
  const party: Character[] = [player, ...companions]

  return (
    <div className="pixel-hud w-full">
      <div className="pixel-panel pixel-hud-card w-full">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="pixel-label mb-1">WANDERER</div>
            <div className="truncate text-sm font-bold tracking-[0.12em]" style={{ color: '#f8e7b7' }}>
              {player.name}
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="border-2 px-2 py-1 text-xs font-bold" style={{ borderColor: '#6d4d26', color: '#f1c45d' }}>
              {gold} G
            </span>
            <div className="border-2 px-2 py-1 text-xs font-bold" style={{ borderColor: '#59442a', color: '#d6a845' }}>
              LV {player.level}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {party.map((char) => (
            <PartyHPBar key={char.id} char={char} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface PartyHPBarProps {
  char: Character
}

function PartyHPBar({ char }: PartyHPBarProps) {
  const pct = Math.max(0, Math.min(100, (char.stats.hp / char.stats.maxHp) * 100))
  const barColor = pct < 25 ? 'var(--pixel-red)' : 'var(--pixel-green)'
  const meterStyle = {
    '--meter-color': barColor,
    width: `${pct}%`,
  } as CSSProperties

  return (
    <div className="grid grid-cols-[minmax(56px,auto)_minmax(0,1fr)_64px] items-center gap-2">
      <span className="truncate text-[10px] font-bold" style={{ color: '#d0ad6f' }}>
        {char.name}
      </span>
      <div className="pixel-meter">
        <div className="pixel-meter__fill" style={meterStyle} />
      </div>
      <span className="text-right text-[10px]" style={{ color: '#b68f59' }}>
        {char.stats.hp}/{char.stats.maxHp}
      </span>
    </div>
  )
}
