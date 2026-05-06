import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
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

function StatusPanel({ onClose }: { onClose: () => void }) {
  const player = useGameStore((s) => s.player)
  const gold = useGameStore((s) => s.gold)
  const { stats, baseStats, equipment, level, exp, expToNext } = player
  const expPct = Math.max(0, Math.min(100, (exp / expToNext) * 100))

  const statRows = [
    { label: '攻击', value: stats.atk, base: baseStats.atk },
    { label: '防御', value: stats.def, base: baseStats.def },
    { label: '速度', value: stats.spd, base: baseStats.spd },
    { label: '生命上限', value: stats.maxHp, base: baseStats.maxHp },
    { label: '魔力上限', value: stats.maxMp, base: baseStats.maxMp },
  ]

  const equipSlots = [
    { key: 'weapon' as const, label: '武器' },
    { key: 'armor' as const, label: '护甲' },
    { key: 'accessory' as const, label: '饰品' },
  ]

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.64)' }}
      onClick={onClose}
    >
      <div className="pixel-panel w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="pixel-label mb-2">CHARACTER</div>
            <h2 className="truncate text-lg font-bold tracking-[0.14em]" style={{ color: '#f8e7b7' }}>
              {player.name}
            </h2>
            <p className="mt-1 text-xs" style={{ color: '#b68f59' }}>
              LV {level} · {gold} G
            </p>
          </div>
          <button onClick={onClose} className="pixel-button px-3 py-2 text-xs font-bold">
            CLOSE
          </button>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex justify-between text-[10px]" style={{ color: '#b68f59' }}>
            <span>EXP</span>
            <span>{exp} / {expToNext}</span>
          </div>
          <div className="pixel-meter h-3">
            <div
              className="pixel-meter__fill"
              style={{ width: `${expPct}%`, '--meter-color': 'var(--pixel-gold)' } as CSSProperties}
            />
          </div>
        </div>

        <div className="mb-5">
          <div className="pixel-label mb-3">ATTRIBUTES</div>
          <div className="grid gap-2">
            {statRows.map(({ label, value, base }) => {
              const bonus = value - base
              return (
                <div
                  key={label}
                  className="grid grid-cols-[88px_1fr] border-2 px-3 py-2 text-xs"
                  style={{ borderColor: '#2e3938', background: 'rgba(8, 10, 10, 0.5)' }}
                >
                  <span style={{ color: '#b68f59' }}>{label}</span>
                  <span className="text-right font-bold" style={{ color: '#f8e7b7' }}>
                    {value}
                    {bonus > 0 && <span style={{ color: '#73c66d' }}> +{bonus}</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="pixel-label mb-3">EQUIPMENT</div>
          <div className="grid gap-2">
            {equipSlots.map(({ key, label }) => (
              <div
                key={key}
                className="grid grid-cols-[64px_1fr] border-2 px-3 py-2 text-xs"
                style={{ borderColor: '#3d3324', background: 'rgba(25, 17, 10, 0.46)' }}
              >
                <span style={{ color: '#b68f59' }}>{label}</span>
                <span
                  className="truncate text-right font-bold"
                  style={{ color: equipment[key] ? '#f8e7b7' : '#6d5434' }}
                >
                  {equipment[key]?.name ?? '未装备'}
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
  const activeDialogue = useGameStore((s) => s.activeDialogue)

  const togglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? 'none' : panel))
  }, [])

  useEffect(() => {
    if (!started) {
      navigate('/')
    }
  }, [started, navigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (paused) {
          setPaused(false)
          return
        }
        if (activePanel !== 'none') {
          setActivePanel('none')
          return
        }
        if (!inCombat) setPaused(true)
      }
      if (inCombat || paused) return
      if (e.key === 'b' || e.key === 'B') togglePanel('inventory')
      if (e.key === 'q' || e.key === 'Q') togglePanel('quests')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inCombat, paused, activePanel, togglePanel])

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

  useEffect(() => {
    const loc = LOCATIONS[currentLocationId]
    if (loc) GameManager.changeLocation(loc.backgroundKey)
  }, [currentLocationId])

  if (!started) return null

  return (
    <div className="pixel-root relative h-full w-full overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="pixel-ui absolute inset-0">
        {!inCombat ? (
          <>
            <HUD />
            {!activeDialogue && (
              <LocationPanel
                onStartBattle={() => setInCombat(true)}
                onOpenPanel={(panel) => setActivePanel(panel)}
              />
            )}
            <DialogBox />

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

        {!inCombat && (
          <button
            onClick={() => setPaused(true)}
            className="pixel-button absolute right-4 top-32 z-30 px-3 py-2 text-[10px] font-bold tracking-[0.14em] opacity-80"
          >
            PAUSE
          </button>
        )}

        {paused && <PauseMenu onClose={() => setPaused(false)} />}
        {activeShop && <ShopPanel shop={activeShop} onClose={closeShop} />}
      </div>
    </div>
  )
}
