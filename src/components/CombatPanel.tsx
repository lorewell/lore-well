import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { GameManager } from '../game/GameManager'
import type { BattleAction } from '../types'

interface CombatPanelProps {
  onBattleEnd: () => void
}

export default function CombatPanel({ onBattleEnd }: CombatPanelProps) {
  const battle = useGameStore((s) => s.battle)
  const player = useGameStore((s) => s.player)
  const inventory = useGameStore((s) => s.inventory)
  const executeBattleAction = useGameStore((s) => s.executeBattleAction)
  const restoreHpMp = useGameStore((s) => s.restoreHpMp)
  const respawnAtVillage = useGameStore((s) => s.respawnAtVillage)
  const logRef = useRef<HTMLDivElement>(null)

  // 自动滚动日志到底部
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [battle.turnLog])

  useEffect(() => {
    if (battle.phase === 'victory') {
      GameManager.playVictory()
    } else if (battle.phase === 'defeat') {
      GameManager.playDefeat()
    }
  }, [battle.phase])

  if (!battle.active) return null
  if (!battle.enemy || !battle.enemyStats) return null

  const playerStats = battle.playerStats
  const enemyStats = battle.enemyStats
  const hpPct = (playerStats.hp / playerStats.maxHp) * 100
  const mpPct = (playerStats.mp / playerStats.maxMp) * 100
  const enemyHpPct = (enemyStats.hp / enemyStats.maxHp) * 100

  const isEnded =
    battle.phase === 'victory' || battle.phase === 'defeat' || battle.phase === 'flee'
  const isPlayerTurn = battle.phase === 'player_turn'

  const doAction = (action: BattleAction) => {
    if (!isPlayerTurn) return
    executeBattleAction(action)
  }

  const handleClose = () => {
    if (battle.phase === 'defeat') {
      // 失败时：传送回村庄，恢复 50% HP/MP（不满血）
      respawnAtVillage()
      GameManager.exitCombat()
      onBattleEnd()
    } else {
      // 胜利/逃跑：正常恢复并退出
      restoreHpMp()
      GameManager.exitCombat()
      onBattleEnd()
    }
  }

  const consumables = inventory.filter((i) => i.item.type === 'consumable')

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4"
      style={{ background: 'rgba(0,0,0,0.25)' }}
    >
      {/* 顶部：双方状态 */}
      <div className="flex justify-between items-start gap-4">
        {/* 玩家 */}
        <div
          className="flex-1 p-3 border"
          style={{ background: 'rgba(0,0,0,0.6)', borderColor: '#2a1040' }}
        >
          <div className="text-xs tracking-wider mb-1.5" style={{ color: '#aa55ff' }}>
            {player.name} · LV{player.level}
          </div>
          <MiniBar label="HP" pct={hpPct} color="#44cc66" />
          <MiniBar label="MP" pct={mpPct} color="#4488ff" />
          <div className="text-[10px] mt-1 space-y-0.5" style={{ color: '#9070b0' }}>
            <div>{playerStats.hp}/{playerStats.maxHp} HP · {playerStats.mp}/{playerStats.maxMp} MP</div>
            <div>ATK {playerStats.atk} · DEF {playerStats.def}</div>
          </div>
        </div>

        {/* 回合 */}
        <div className="flex flex-col items-center justify-center px-3" style={{ color: '#5a4070' }}>
          <div className="text-[10px] tracking-widest">ROUND</div>
          <div className="text-2xl font-bold" style={{ color: '#6600cc' }}>
            {battle.round}
          </div>
        </div>

        {/* 敌人 */}
        <div
          className="flex-1 p-3 border text-right"
          style={{ background: 'rgba(0,0,0,0.6)', borderColor: '#440022' }}
        >
          <div className="text-xs tracking-wider mb-1.5" style={{ color: '#cc4466' }}>
            {battle.enemy.name}
          </div>
          <MiniBar label="HP" pct={enemyHpPct} color="#cc4466" reverse />
          <div className="text-[10px] mt-1 space-y-0.5" style={{ color: '#9070b0' }}>
            <div>{enemyStats.hp}/{enemyStats.maxHp} HP</div>
            <div>ATK {enemyStats.atk} · DEF {enemyStats.def}</div>
          </div>
        </div>
      </div>

      {/* 中部：战斗日志 */}
      <div
        ref={logRef}
        className="flex-1 mx-0 my-3 px-4 py-2 text-xs overflow-y-auto border max-h-48"
        style={{
          background: 'rgba(0,0,0,0.5)',
          borderColor: '#1a0a2e',
          color: '#c0a0e0',
          scrollbarWidth: 'none',
        }}
      >
        {battle.turnLog.map((line, i) => (
          <p key={i} className="mb-0.5 leading-relaxed" style={{ color: i === battle.turnLog.length - 1 ? '#e2d8f0' : '#7a5a90' }}>
            {line}
          </p>
        ))}
      </div>

      {/* 底部：行动区域 */}
      {!isEnded ? (
        <div className="grid grid-cols-2 gap-2">
          {/* 攻击 */}
          <ActionButton onClick={() => doAction({ type: 'attack' })} disabled={!isPlayerTurn} color="#cc4466">
            ⚔️ 攻击
          </ActionButton>

          {/* 技能（列出所有技能按钮） */}
          {player.skills.map((sk) => (
            <ActionButton
              key={sk.id}
              onClick={() => doAction({ type: 'skill', skillId: sk.id })}
              disabled={!isPlayerTurn || playerStats.mp < sk.mpCost}
              color="#4488ff"
            >
              ✨ {sk.name}
              <span className="text-[10px] opacity-60 ml-1">({sk.mpCost}MP)</span>
            </ActionButton>
          ))}

          {/* 物品 */}
          {consumables.map((inv) => (
            <ActionButton
              key={inv.item.id}
              onClick={() => doAction({ type: 'item', itemId: inv.item.id })}
              disabled={!isPlayerTurn}
              color="#44aa66"
            >
              🧪 {inv.item.name} ×{inv.quantity}
            </ActionButton>
          ))}

          {/* 逃跑 */}
          <ActionButton onClick={() => doAction({ type: 'flee' })} disabled={!isPlayerTurn} color="#996633">
            🏃 逃跑
          </ActionButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          {battle.phase === 'victory' && (
            <>
              <p className="text-lg tracking-widest font-medium" style={{ color: '#ffcc44' }}>
                ✦ 胜利 ✦
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-2.5 text-sm tracking-widest border cursor-pointer hover:brightness-125 transition-all"
                style={{ borderColor: '#3a1a5a', background: 'rgba(102,0,204,0.2)', color: '#e2d8f0' }}
              >
                继续
              </button>
            </>
          )}
          {battle.phase === 'flee' && (
            <>
              <p className="text-lg tracking-widest font-medium" style={{ color: '#9070b0' }}>
                成功逃脱
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-2.5 text-sm tracking-widest border cursor-pointer hover:brightness-125 transition-all"
                style={{ borderColor: '#3a1a5a', background: 'rgba(102,0,204,0.2)', color: '#e2d8f0' }}
              >
                继续
              </button>
            </>
          )}
          {battle.phase === 'defeat' && (
            <>
              <p className="text-lg tracking-widest font-medium" style={{ color: '#cc4444' }}>
                ✝ 战斗失败
              </p>
              <p className="text-xs text-center max-w-xs" style={{ color: '#7a5a70' }}>
                你陷入了昏迷……
                <br />
                客栈老板发现了你，将你带回了晨曦村。
                <br />
                <span style={{ color: '#cc8888' }}>HP/MP 恢复至 50%，装备与道具保留。</span>
              </p>
              <button
                onClick={handleClose}
                className="mt-1 px-8 py-2.5 text-sm tracking-widest border cursor-pointer hover:brightness-125 transition-all"
                style={{ borderColor: '#5a1a1a', background: 'rgba(100,10,10,0.3)', color: '#e2c8c8' }}
              >
                重回晨曦村
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 小组件 ──────────────────────────────────────────────────────────────────

function MiniBar({
  label,
  pct,
  color,
  reverse = false,
}: {
  label: string
  pct: number
  color: string
  reverse?: boolean
}) {
  return (
    <div className={`flex items-center gap-1.5 ${reverse ? 'flex-row-reverse' : ''}`}>
      <span className="text-[9px] w-4" style={{ color: '#5a4070' }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 4px ${color}`,
            float: reverse ? 'right' : 'left',
          }}
        />
      </div>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  disabled,
  color,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  color: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs tracking-wider border transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
      style={{
        background: `rgba(${hexToRgb(color)}, 0.1)`,
        borderColor: `rgba(${hexToRgb(color)}, 0.4)`,
        color: '#e2d8f0',
      }}
    >
      {children}
    </button>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
