import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { ENEMIES } from '../data/enemies'
import { ITEMS } from '../data/items'
import type { Interaction, SubLocation } from '../types'
import { GameManager } from '../game/GameManager'

interface LocationPanelProps {
  onStartBattle: () => void
}

export default function LocationPanel({ onStartBattle }: LocationPanelProps) {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const currentSubLocationId = useGameStore((s) => s.currentSubLocationId)
  const travelTo = useGameStore((s) => s.travelTo)
  const travelToSubLocation = useGameStore((s) => s.travelToSubLocation)
  const openDialogue = useGameStore((s) => s.openDialogue)
  const startBattle = useGameStore((s) => s.startBattle)
  const addItem = useGameStore((s) => s.addItem)
  const consumeInteraction = useGameStore((s) => s.consumeInteraction)
  const consumedInteractions = useGameStore((s) => s.consumedInteractions)

  const location = LOCATIONS[currentLocationId]
  if (!location) return null

  const handleInteraction = (interaction: Interaction) => {
    if (consumedInteractions.includes(interaction.id)) return

    switch (interaction.type) {
      case 'npc':
      case 'building':
        openDialogue(interaction.targetId)
        break
      case 'enemy': {
        const enemy = ENEMIES[interaction.targetId]
        if (enemy) {
          startBattle(enemy)
          GameManager.enterCombat(enemy.sprite ?? 'enemy_slime')
          onStartBattle()
        }
        break
      }
      case 'item': {
        const item = ITEMS[interaction.targetId]
        if (item) {
          addItem(item, 1)
          consumeInteraction(interaction.id)
        }
        break
      }
    }
  }

  const iconMap: Record<string, string> = {
    npc: '👤',
    building: '🏛',
    enemy: '⚔️',
    item: '📦',
  }

  // ── 小地图模式 ────────────────────────────────────────────────────────────
  const subMap = location.subMap
  const subLoc: SubLocation | undefined =
    subMap && currentSubLocationId ? subMap.nodes[currentSubLocationId] : undefined

  if (subMap && subLoc) {
    const directions = [
      { key: 'north', arrow: '↑', label: '北' },
      { key: 'south', arrow: '↓', label: '南' },
      { key: 'west',  arrow: '←', label: '西' },
      { key: 'east',  arrow: '→', label: '东' },
    ] as const

    return (
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 60%, transparent 100%)' }}
      >
        <div className="px-6 pb-6 pt-12">
          {/* 面包屑 + 地点标题 */}
          <div className="mb-3">
            <span className="text-[10px] tracking-widest" style={{ color: '#5a4070' }}>
              {location.name}
            </span>
            <span className="text-[10px] mx-1.5" style={{ color: '#3a2050' }}>›</span>
            <h2
              className="inline text-base font-semibold tracking-widest"
              style={{ color: '#e2d8f0', textShadow: '0 0 15px rgba(170,85,255,0.5)' }}
            >
              {subLoc.name}
            </h2>
            <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: '#9070b0' }}>
              {subLoc.description}
            </p>
          </div>

          <div className="flex gap-4 items-end">
            {/* 左侧：交互列表 */}
            <div className="flex-1 min-w-0">
              {subLoc.interactions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-0">
                  {subLoc.interactions.map((inter) => {
                    const consumed = consumedInteractions.includes(inter.id)
                    return (
                      <button
                        key={inter.id}
                        onClick={() => handleInteraction(inter)}
                        disabled={consumed}
                        className="flex items-center gap-2 px-3 py-2.5 text-left text-xs tracking-wider border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: consumed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                          borderColor: inter.type === 'enemy' ? '#440022' : '#2a1840',
                          color: consumed ? '#5a4070' : inter.type === 'enemy' ? '#cc6688' : '#c0a0e0',
                        }}
                        onMouseEnter={(e) => {
                          if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.12)'
                        }}
                        onMouseLeave={(e) => {
                          if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <span className="text-base">{iconMap[inter.type]}</span>
                        <span className="truncate">{inter.label}</span>
                        {consumed && (
                          <span className="ml-auto text-[10px] shrink-0" style={{ color: '#5a4070' }}>已完成</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: '#3a2858' }}>此处无可交互之物。</p>
              )}

              {/* 世界地图出口 */}
              {subLoc.exits && subLoc.exits.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-[10px] tracking-widest self-center" style={{ color: '#5a4070' }}>前往：</span>
                  {subLoc.exits.map((exitId) => {
                    const dest = LOCATIONS[exitId]
                    return (
                      <button
                        key={exitId}
                        onClick={() => {
                          travelTo(exitId)
                          GameManager.changeLocation(dest.backgroundKey)
                        }}
                        className="px-3 py-1 text-xs tracking-wider border cursor-pointer transition-all duration-200 hover:brightness-125"
                        style={{ borderColor: '#3a2050', background: 'rgba(255,255,255,0.03)', color: '#9070b0' }}
                      >
                        ↗ {dest.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 右侧：方向导航 */}
            <div className="shrink-0">
              <p className="text-[9px] text-center mb-1.5 tracking-widest" style={{ color: '#3a2858' }}>移动</p>
              {/* 3×3 方向键盘 */}
              <div className="grid grid-cols-3 gap-1" style={{ width: '108px' }}>
                {/* 行1：空 ↑ 空 */}
                <div />
                {(() => {
                  const targetId = subLoc.north
                  const dest = targetId ? subMap.nodes[targetId] : undefined
                  return (
                    <button
                      onClick={() => targetId && travelToSubLocation(targetId)}
                      disabled={!targetId}
                      title={dest?.name}
                      className="h-8 w-full flex flex-col items-center justify-center text-sm border transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: targetId ? '#4a2870' : '#1e1030',
                        background: targetId ? 'rgba(170,85,255,0.08)' : 'rgba(0,0,0,0)',
                        color: '#c0a0e0',
                      }}
                      onMouseEnter={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.2)' }}
                      onMouseLeave={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.08)' }}
                    >↑</button>
                  )
                })()}
                <div />

                {/* 行2：← · → */}
                {(() => {
                  const targetId = subLoc.west
                  const dest = targetId ? subMap.nodes[targetId] : undefined
                  return (
                    <button
                      onClick={() => targetId && travelToSubLocation(targetId)}
                      disabled={!targetId}
                      title={dest?.name}
                      className="h-8 w-full flex items-center justify-center text-sm border transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: targetId ? '#4a2870' : '#1e1030',
                        background: targetId ? 'rgba(170,85,255,0.08)' : 'rgba(0,0,0,0)',
                        color: '#c0a0e0',
                      }}
                      onMouseEnter={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.2)' }}
                      onMouseLeave={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.08)' }}
                    >←</button>
                  )
                })()}
                <div
                  className="h-8 w-full flex items-center justify-center text-[10px]"
                  style={{ color: '#5a4070', border: '1px solid #1e1030' }}
                >
                  ·
                </div>
                {(() => {
                  const targetId = subLoc.east
                  const dest = targetId ? subMap.nodes[targetId] : undefined
                  return (
                    <button
                      onClick={() => targetId && travelToSubLocation(targetId)}
                      disabled={!targetId}
                      title={dest?.name}
                      className="h-8 w-full flex items-center justify-center text-sm border transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: targetId ? '#4a2870' : '#1e1030',
                        background: targetId ? 'rgba(170,85,255,0.08)' : 'rgba(0,0,0,0)',
                        color: '#c0a0e0',
                      }}
                      onMouseEnter={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.2)' }}
                      onMouseLeave={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.08)' }}
                    >→</button>
                  )
                })()}

                {/* 行3：空 ↓ 空 */}
                <div />
                {(() => {
                  const targetId = subLoc.south
                  const dest = targetId ? subMap.nodes[targetId] : undefined
                  return (
                    <button
                      onClick={() => targetId && travelToSubLocation(targetId)}
                      disabled={!targetId}
                      title={dest?.name}
                      className="h-8 w-full flex flex-col items-center justify-center text-sm border transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: targetId ? '#4a2870' : '#1e1030',
                        background: targetId ? 'rgba(170,85,255,0.08)' : 'rgba(0,0,0,0)',
                        color: '#c0a0e0',
                      }}
                      onMouseEnter={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.2)' }}
                      onMouseLeave={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.08)' }}
                    >↓</button>
                  )
                })()}
                <div />
              </div>

              {/* 相邻节点名称提示 */}
              <div className="mt-1 text-center text-[9px] leading-tight" style={{ color: '#4a3060', width: '108px' }}>
                {directions.map(({ key, arrow, label }) => {
                  const targetId = subLoc[key]
                  const dest = targetId ? subMap.nodes[targetId] : undefined
                  if (!dest) return null
                  return (
                    <span key={key} className="block truncate">
                      {arrow} {dest.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── 兼容模式（无 subMap 的地点）────────────────────────────────────────────
  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent 100%)' }}
    >
      <div className="px-6 pb-6 pt-12">
        <div className="mb-4">
          <h2
            className="text-xl font-semibold tracking-widest"
            style={{ color: '#e2d8f0', textShadow: '0 0 15px rgba(170,85,255,0.5)' }}
          >
            {location.name}
          </h2>
          <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: '#9070b0' }}>
            {location.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {location.interactions.map((inter) => {
            const consumed = consumedInteractions.includes(inter.id)
            return (
              <button
                key={inter.id}
                onClick={() => handleInteraction(inter)}
                disabled={consumed}
                className="flex items-center gap-2 px-3 py-2.5 text-left text-xs tracking-wider border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: consumed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                  borderColor: inter.type === 'enemy' ? '#440022' : '#2a1840',
                  color: consumed ? '#5a4070' : inter.type === 'enemy' ? '#cc6688' : '#c0a0e0',
                }}
                onMouseEnter={(e) => {
                  if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.12)'
                }}
                onMouseLeave={(e) => {
                  if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                <span className="text-base">{iconMap[inter.type]}</span>
                <span>{inter.label}</span>
                {consumed && (
                  <span className="ml-auto text-[10px]" style={{ color: '#5a4070' }}>已完成</span>
                )}
              </button>
            )
          })}
        </div>

        {location.exits.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] tracking-widest self-center" style={{ color: '#5a4070' }}>前往：</span>
            {location.exits.map((exitId) => {
              const dest = LOCATIONS[exitId]
              return (
                <button
                  key={exitId}
                  onClick={() => {
                    travelTo(exitId)
                    GameManager.changeLocation(dest.backgroundKey)
                  }}
                  className="px-3 py-1 text-xs tracking-wider border cursor-pointer transition-all duration-200 hover:brightness-125"
                  style={{ borderColor: '#3a2050', background: 'rgba(255,255,255,0.03)', color: '#9070b0' }}
                >
                  → {dest.name}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
