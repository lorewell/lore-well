import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { GameManager } from '../game/GameManager'
import HUD from '../components/HUD'
import LocationPanel from '../components/LocationPanel'
import DialogBox from '../components/DialogBox'
import CombatPanel from '../components/CombatPanel'
import InventoryPanel from '../components/InventoryPanel'
import QuestLog from '../components/QuestLog'
import PauseMenu from '../components/PauseMenu'
import ShopPanel from '../components/ShopPanel'
import { LOCATIONS } from '../data/locations'
import { getShopByNpc } from '../data/shops'

// ── 角色状态面板（内联，轻量） ──────────────────────────────────────────────
function StatusPanel({ onClose }: { onClose: () => void }) {
  const player = useGameStore((s) => s.player)
  const gold = useGameStore((s) => s.gold)
  const { stats, baseStats, equipment, level, exp, expToNext } = player

  const statRows = [
    { label: 'ATK 攻击',  value: stats.atk,  base: baseStats.atk },
    { label: 'DEF 防御',  value: stats.def,  base: baseStats.def },
    { label: 'SPD 速度',  value: stats.spd,  base: baseStats.spd },
    { label: 'HP 上限',   value: stats.maxHp, base: baseStats.maxHp },
    { label: 'MP 上限',   value: stats.maxMp, base: baseStats.maxMp },
  ]

  const equipSlots = [
    { key: 'weapon' as const, label: '武器' },
    { key: 'armor'  as const, label: '防具' },
    { key: 'accessory' as const, label: '饰品' },
  ]

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative p-6 min-w-72 max-w-sm w-full mx-4"
        style={{ background: 'rgba(12,6,24,0.97)', border: '1px solid #3a2050' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-widest" style={{ color: '#e2d8f0' }}>
              {player.name}
            </h2>
            <span className="text-[11px] tracking-widest" style={{ color: '#6a5080' }}>
              Lv.{level} · {gold} G
            </span>
          </div>
          <button onClick={onClose} className="text-lg cursor-pointer" style={{ color: '#5a4070' }}>✕</button>
        </div>

        {/* EXP 条 */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] mb-0.5" style={{ color: '#6a5080' }}>
            <span>EXP</span><span>{exp} / {expToNext}</span>
          </div>
          <div className="h-1 w-full" style={{ background: '#1e1030' }}>
            <div className="h-full" style={{ width: `${(exp / expToNext) * 100}%`, background: '#6040a0' }} />
          </div>
        </div>

        {/* 属性 */}
        <div className="mb-4">
          <p className="text-[9px] tracking-widest mb-2" style={{ color: '#4a3060' }}>基础属性</p>
          <div className="flex flex-col gap-1">
            {statRows.map(({ label, value, base }) => {
              const bonus = value - base
              return (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span style={{ color: '#7a5898' }}>{label}</span>
                  <span style={{ color: '#c0a0e0' }}>
                    {value}
                    {bonus > 0 && <span style={{ color: '#80c080', fontSize: '10px' }}> (+{bonus})</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 装备 */}
        <div>
          <p className="text-[9px] tracking-widest mb-2" style={{ color: '#4a3060' }}>当前装备</p>
          <div className="flex flex-col gap-1">
            {equipSlots.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span style={{ color: '#4a3060' }}>{label}</span>
                <span style={{ color: equipment[key] ? '#c0a0e0' : '#2a1840' }}>
                  {equipment[key]?.name ?? '— 未装备 —'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type ActivePanel = 'none' | 'inventory' | 'quests' | 'status'

export default function GameScreen() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const started = useGameStore((s) => s.started)
  const currentLocationId = useGameStore((s) => s.currentLocationId)

  const [inCombat, setInCombat] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>('none')
  const [paused, setPaused] = useState(false)

  const activeShopNpcId = useGameStore((s) => s.activeShopNpcId)
  const closeShop = useGameStore((s) => s.closeShop)
  const activeShop = activeShopNpcId ? getShopByNpc(activeShopNpcId) : undefined

  const togglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? 'none' : panel))
  }, [])

  // 未开始游戏则跳回菜单
  useEffect(() => {
    if (!started) {
      navigate('/')
    }
  }, [started, navigate])

  // 键盘快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (paused) { setPaused(false); return }
        if (activePanel !== 'none') { setActivePanel('none'); return }
        if (!inCombat) setPaused(true)
      }
      if (inCombat || paused) return
      if (e.key === 'b' || e.key === 'B') togglePanel('inventory')
      if (e.key === 'q' || e.key === 'Q') togglePanel('quests')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inCombat, paused, activePanel, togglePanel])

  // 初始化 Phaser
  useEffect(() => {
    if (!canvasRef.current) return
    GameManager.init(canvasRef.current)

    const waitForScene = () => {
      const scene = GameManager.getLocationScene()
      if (scene) {
        const loc = LOCATIONS[currentLocationId]
        if (loc) GameManager.changeLocation(loc.backgroundKey)
      } else {
        setTimeout(waitForScene, 200)
      }
    }
    waitForScene()

    return () => {
      GameManager.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 地点变化时通知 Phaser
  useEffect(() => {
    const loc = LOCATIONS[currentLocationId]
    if (loc) GameManager.changeLocation(loc.backgroundKey)
  }, [currentLocationId])

  if (!started) return null

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Phaser 画布容器 */}
      <div ref={canvasRef} className="absolute inset-0" />

      {/* React UI 层 */}
      {!inCombat ? (
        <>
          <HUD />
          <LocationPanel
            onStartBattle={() => setInCombat(true)}
            onOpenPanel={(panel) => setActivePanel(panel)}
          />
          <DialogBox />

          {/* 面板覆盖层 */}
          {activePanel === 'inventory' && (
            <InventoryPanel onClose={() => setActivePanel('none')} />
          )}
          {activePanel === 'quests' && (
            <QuestLog onClose={() => setActivePanel('none')} />
          )}
          {activePanel === 'status' && (
            <StatusPanel onClose={() => setActivePanel('none')} />
          )}
        </>
      ) : (
        <CombatPanel onBattleEnd={() => setInCombat(false)} />
      )}

      {/* 返回主菜单 → 改为暂停按钮 */}
      {!inCombat && (
        <button
          onClick={() => setPaused(true)}
          className="absolute top-3 right-4 text-[10px] tracking-widest opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: '#9070b0' }}
        >
          ≡ MENU
        </button>
      )}

      {/* 暂停菜单 */}
      {paused && <PauseMenu onClose={() => setPaused(false)} />}

      {/* 商店面板 */}
      {activeShop && <ShopPanel shop={activeShop} onClose={closeShop} />}
    </div>
  )
}
