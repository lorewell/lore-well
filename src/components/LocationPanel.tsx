import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { ENEMIES } from '../data/enemies'
import { ITEMS } from '../data/items'
import type { Interaction, SubLocation } from '../types'
import { GameManager } from '../game/GameManager'

interface LocationPanelProps {
  onStartBattle: () => void
  onOpenPanel: (panel: 'inventory' | 'quests' | 'status') => void
}

export default function LocationPanel({ onStartBattle, onOpenPanel }: LocationPanelProps) {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const currentSubLocationId = useGameStore((s) => s.currentSubLocationId)
  const travelTo = useGameStore((s) => s.travelTo)
  const travelToSubLocation = useGameStore((s) => s.travelToSubLocation)
  const openDialogue = useGameStore((s) => s.openDialogue)
  const startBattle = useGameStore((s) => s.startBattle)
  const addItem = useGameStore((s) => s.addItem)
  const consumeInteraction = useGameStore((s) => s.consumeInteraction)
  const consumedInteractions = useGameStore((s) => s.consumedInteractions)

  /** true = 显示地点交互，false = 显示快捷菜单 */
  const [showMenu, setShowMenu] = useState(false)

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
    // ── 小地图：计算所有节点的相对坐标用于可视化 ────────────────────────────
    // BFS 从 startNode 扩散，给每个节点分配 (col, row)
    const nodeCoords: Record<string, { col: number; row: number }> = {}
    const dirDelta: Record<string, { dc: number; dr: number }> = {
      north: { dc: 0, dr: -1 },
      south: { dc: 0, dr: 1 },
      west:  { dc: -1, dr: 0 },
      east:  { dc: 1, dr: 0 },
    }
    const queue: Array<{ id: string; col: number; row: number }> = [
      { id: subMap.startNodeId, col: 0, row: 0 },
    ]
    nodeCoords[subMap.startNodeId] = { col: 0, row: 0 }
    while (queue.length > 0) {
      const cur = queue.shift()!
      const node = subMap.nodes[cur.id]
      for (const dir of ['north', 'south', 'east', 'west'] as const) {
        const nextId = node[dir]
        if (nextId && !nodeCoords[nextId]) {
          const { dc, dr } = dirDelta[dir]
          nodeCoords[nextId] = { col: cur.col + dc, row: cur.row + dr }
          queue.push({ id: nextId, col: cur.col + dc, row: cur.row + dr })
        }
      }
    }
    const cols = Object.values(nodeCoords).map((c) => c.col)
    const rows = Object.values(nodeCoords).map((c) => c.row)
    const minCol = Math.min(...cols), maxCol = Math.max(...cols)
    const minRow = Math.min(...rows), maxRow = Math.max(...rows)
    const gridW = maxCol - minCol + 1
    const gridH = maxRow - minRow + 1
    const CELL = 32   // px per cell
    const GAP  = 6    // px gap
    const mapW = gridW * CELL + (gridW - 1) * GAP
    const mapH = gridH * CELL + (gridH - 1) * GAP

    const menuItems = [
      { id: 'inventory', icon: '🎒', label: '背包', key: 'B' },
      { id: 'quests',    icon: '📜', label: '任务', key: 'Q' },
      { id: 'status',    icon: '⚔️', label: '状态', key: 'C' },
    ] as const

    return (
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 55%, transparent 100%)' }}
      >
        {/* ── 主内容行 ── */}
        <div className="flex items-end gap-0" style={{ minHeight: '140px' }}>

          {/* ── 左栏：可视化小地图 ──────────────────────────────────────────── */}
          <div
            className="shrink-0 flex flex-col items-center justify-end pb-5 pl-5 pr-3"
            style={{ width: '160px' }}
          >
            <p className="text-[9px] tracking-widest mb-2 w-full text-center" style={{ color: '#4a3060' }}>
              {location.name}
            </p>

            {/* 节点网格 */}
            <div
              className="relative"
              style={{ width: mapW, height: mapH }}
            >
              {/* 连接线（SVG） */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={mapW}
                height={mapH}
                style={{ overflow: 'visible' }}
              >
                {Object.entries(subMap.nodes).map(([id, node]) => {
                  const from = nodeCoords[id]
                  if (!from) return null
                  return (['east', 'south'] as const).map((dir) => {
                    const toId = node[dir]
                    if (!toId) return null
                    const to = nodeCoords[toId]
                    if (!to) return null
                    const x1 = (from.col - minCol) * (CELL + GAP) + CELL / 2
                    const y1 = (from.row - minRow) * (CELL + GAP) + CELL / 2
                    const x2 = (to.col - minCol) * (CELL + GAP) + CELL / 2
                    const y2 = (to.row - minRow) * (CELL + GAP) + CELL / 2
                    return (
                      <line
                        key={`${id}-${dir}`}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#3a2050" strokeWidth="1.5"
                      />
                    )
                  })
                })}
              </svg>

              {/* 节点按钮 */}
              {Object.entries(subMap.nodes).map(([id, node]) => {
                const coord = nodeCoords[id]
                if (!coord) return null
                const isCurrent = id === currentSubLocationId
                const left = (coord.col - minCol) * (CELL + GAP)
                const top  = (coord.row - minRow) * (CELL + GAP)
                return (
                  <button
                    key={id}
                    onClick={() => travelToSubLocation(id)}
                    title={node.name}
                    className="absolute flex items-center justify-center transition-all duration-150 cursor-pointer"
                    style={{
                      left, top,
                      width: CELL, height: CELL,
                      border: `1.5px solid ${isCurrent ? '#aa55ff' : '#3a2050'}`,
                      background: isCurrent
                        ? 'rgba(170,85,255,0.25)'
                        : 'rgba(30,16,48,0.8)',
                      borderRadius: '3px',
                      boxShadow: isCurrent ? '0 0 8px rgba(170,85,255,0.5)' : 'none',
                      color: isCurrent ? '#e2d8f0' : '#6a5080',
                      fontSize: '9px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.borderColor = '#6a3890'
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a2050'
                    }}
                  >
                    {/* 出口标记 */}
                    {node.exits && node.exits.length > 0 && (
                      <span style={{ position: 'absolute', top: 1, right: 2, fontSize: '7px', color: '#7a50a0' }}>↗</span>
                    )}
                    <span className="truncate px-0.5 text-center leading-tight" style={{ maxWidth: CELL - 4, fontSize: '7px' }}>
                      {node.name.length > 4 ? node.name.slice(0, 4) : node.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 方向键盘 */}
            <div className="mt-3 grid grid-cols-3 gap-0.5" style={{ width: '72px' }}>
              {(['north', 'south', 'west', 'east'] as const).map((dir, i) => {
                const arrows = { north: '↑', south: '↓', west: '←', east: '→' }
                const targetId = subLoc[dir]
                const positions = [
                  'col-start-2',           // ↑ 中间
                  'col-start-2',           // ↓ 中间
                  'col-start-1 row-start-2', // ←
                  'col-start-3 row-start-2', // →
                ]
                return (
                  <button
                    key={dir}
                    onClick={() => targetId && travelToSubLocation(targetId)}
                    disabled={!targetId}
                    title={targetId ? subMap.nodes[targetId]?.name : undefined}
                    className={`h-6 w-6 flex items-center justify-center text-xs border transition-all duration-100
                      disabled:opacity-15 disabled:cursor-not-allowed cursor-pointer ${positions[i]}`}
                    style={{
                      borderColor: targetId ? '#4a2870' : '#1e1030',
                      background: targetId ? 'rgba(170,85,255,0.1)' : 'transparent',
                      color: '#c0a0e0',
                      borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.25)' }}
                    onMouseLeave={(e) => { if (targetId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.1)' }}
                  >
                    {arrows[dir]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 中栏：地点信息 / 快捷菜单 ──────────────────────────────────── */}
          <div className="flex-1 min-w-0 py-5 pr-2" style={{ borderLeft: '1px solid #2a1840' }}>
            {!showMenu ? (
              /* 地点信息 + 交互 */
              <div className="pl-4">
                {/* 标题 */}
                <div className="mb-2">
                  <h2
                    className="text-sm font-semibold tracking-widest leading-tight"
                    style={{ color: '#e2d8f0', textShadow: '0 0 12px rgba(170,85,255,0.4)' }}
                  >
                    {subLoc.name}
                  </h2>
                  <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: '#7a5898' }}>
                    {subLoc.description}
                  </p>
                </div>

                {/* 交互列表 */}
                {subLoc.interactions.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {subLoc.interactions.map((inter) => {
                      const consumed = consumedInteractions.includes(inter.id)
                      return (
                        <button
                          key={inter.id}
                          onClick={() => handleInteraction(inter)}
                          disabled={consumed}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-left text-xs tracking-wider border transition-all duration-150 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                          style={{
                            background: consumed ? 'transparent' : 'rgba(255,255,255,0.04)',
                            borderColor: inter.type === 'enemy' ? '#440022' : '#2a1840',
                            color: consumed ? '#4a3060' : inter.type === 'enemy' ? '#cc6688' : '#c0a0e0',
                          }}
                          onMouseEnter={(e) => {
                            if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.12)'
                          }}
                          onMouseLeave={(e) => {
                            if (!consumed) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                          }}
                        >
                          <span>{iconMap[inter.type]}</span>
                          <span className="truncate">{inter.label}</span>
                          {consumed && <span className="ml-auto text-[9px] shrink-0" style={{ color: '#3a2050' }}>已完成</span>}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] italic" style={{ color: '#3a2858' }}>此处无可交互之物。</p>
                )}

                {/* 世界出口 */}
                {subLoc.exits && subLoc.exits.length > 0 && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {subLoc.exits.map((exitId) => {
                      const dest = LOCATIONS[exitId]
                      return (
                        <button
                          key={exitId}
                          onClick={() => { travelTo(exitId); GameManager.changeLocation(dest.backgroundKey) }}
                          className="px-2.5 py-1 text-[11px] tracking-wider border cursor-pointer transition-all duration-150 hover:brightness-125"
                          style={{ borderColor: '#3a2050', background: 'rgba(255,255,255,0.02)', color: '#8060a0' }}
                        >
                          ↗ 前往 {dest.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* 快捷菜单 */
              <div className="pl-4 flex flex-col gap-2">
                <p className="text-[9px] tracking-widest mb-1" style={{ color: '#4a3060' }}>快捷操作</p>
                {menuItems.map(({ id, icon, label, key }) => (
                  <button
                    key={id}
                    onClick={() => { onOpenPanel(id); setShowMenu(false) }}
                    className="flex items-center gap-3 px-3 py-2 text-xs tracking-wider border cursor-pointer transition-all duration-150 hover:brightness-125"
                    style={{ borderColor: '#2a1840', background: 'rgba(255,255,255,0.04)', color: '#c0a0e0' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.12)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
                  >
                    <span className="text-base">{icon}</span>
                    <span>{label}</span>
                    <span className="ml-auto text-[9px]" style={{ color: '#4a3060' }}>[{key}]</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── 右侧切换按钮 ────────────────────────────────────────────────── */}
          <div className="shrink-0 flex flex-col items-center justify-end pb-5 px-3" style={{ borderLeft: '1px solid #1e1030' }}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              title={showMenu ? '返回地点' : '快捷菜单'}
              className="w-9 h-9 flex items-center justify-center border transition-all duration-150 cursor-pointer"
              style={{
                borderColor: showMenu ? '#aa55ff' : '#3a2050',
                background: showMenu ? 'rgba(170,85,255,0.2)' : 'rgba(255,255,255,0.04)',
                color: showMenu ? '#e2d8f0' : '#6a5080',
                borderRadius: '4px',
                fontSize: '16px',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6a3890' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = showMenu ? '#aa55ff' : '#3a2050' }}
            >
              {showMenu ? '✕' : '☰'}
            </button>
            <span className="mt-1 text-[8px]" style={{ color: '#3a2050' }}>
              {showMenu ? '返回' : '菜单'}
            </span>
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
