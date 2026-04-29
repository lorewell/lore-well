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
import { LOCATIONS } from '../data/locations'

type ActivePanel = 'none' | 'inventory' | 'quests'

export default function GameScreen() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const started = useGameStore((s) => s.started)
  const currentLocationId = useGameStore((s) => s.currentLocationId)

  const [inCombat, setInCombat] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>('none')

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
      if (inCombat) return
      if (e.key === 'b' || e.key === 'B') togglePanel('inventory')
      if (e.key === 'q' || e.key === 'Q') togglePanel('quests')
      if (e.key === 'Escape') setActivePanel('none')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inCombat, togglePanel])

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
          <LocationPanel onStartBattle={() => setInCombat(true)} />
          <DialogBox />

          {/* 右侧工具栏 */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
            <button
              onClick={() => togglePanel('inventory')}
              title="背包 (B)"
              className={`w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${
                activePanel === 'inventory'
                  ? 'bg-yellow-600 border-yellow-500 text-white'
                  : 'bg-gray-900/80 border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-300'
              }`}
            >
              包
            </button>
            <button
              onClick={() => togglePanel('quests')}
              title="任务 (Q)"
              className={`w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${
                activePanel === 'quests'
                  ? 'bg-yellow-600 border-yellow-500 text-white'
                  : 'bg-gray-900/80 border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-300'
              }`}
            >
              任
            </button>
          </div>

          {/* 面板覆盖层 */}
          {activePanel === 'inventory' && (
            <InventoryPanel onClose={() => setActivePanel('none')} />
          )}
          {activePanel === 'quests' && (
            <QuestLog onClose={() => setActivePanel('none')} />
          )}
        </>
      ) : (
        <CombatPanel onBattleEnd={() => setInCombat(false)} />
      )}

      {/* 返回主菜单 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-3 right-4 text-[10px] tracking-widest opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: '#9070b0' }}
      >
        ← MENU
      </button>
    </div>
  )
}
