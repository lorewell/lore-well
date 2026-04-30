import { useGameStore } from '../store/gameStore'

export default function HUD() {
  const player = useGameStore((s) => s.player)
  const location = useGameStore((s) => s.currentLocationId)
  const gold = useGameStore((s) => s.gold)

  const hpPct = (player.stats.hp / player.stats.maxHp) * 100
  const mpPct = (player.stats.mp / player.stats.maxMp) * 100
  const expPct = (player.exp / player.expToNext) * 100

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-start justify-between px-5 py-4 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
    >
      {/* 左侧：玩家信息 */}
      <div className="flex flex-col gap-1.5 min-w-45">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-widest uppercase" style={{ color: '#9070b0' }}>
            LV {player.level}
          </span>
          <span className="text-sm font-medium" style={{ color: '#e2d8f0' }}>
            {player.name}
          </span>
        </div>

        {/* HP */}
        <StatusBar
          label="HP"
          current={player.stats.hp}
          max={player.stats.maxHp}
          pct={hpPct}
          color="#44cc66"
          lowColor="#cc4444"
        />
        {/* MP */}
        <StatusBar
          label="MP"
          current={player.stats.mp}
          max={player.stats.maxMp}
          pct={mpPct}
          color="#4488ff"
          lowColor="#4488ff"
        />
        {/* EXP */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] w-6" style={{ color: '#9070b0' }}>EXP</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${expPct}%`, background: '#cc9900' }}
            />
          </div>
        </div>
      </div>

      {/* 右侧：地点名 + 金币 */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs tracking-widest" style={{ color: '#9070b0' }}>
          {location.toUpperCase()}
        </span>
        <span className="text-sm" style={{ color: '#ccaa44' }}>
          ◈ {gold} G
        </span>
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
}

function StatusBar({ label, current, max, pct, color, lowColor }: StatusBarProps) {
  const barColor = pct < 25 ? lowColor : color
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] w-6" style={{ color: '#9070b0' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }}
        />
      </div>
      <span className="text-[10px] w-16 text-right" style={{ color: '#9070b0' }}>
        {current}/{max}
      </span>
    </div>
  )
}
