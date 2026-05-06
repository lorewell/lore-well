import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { ENEMIES } from '../data/enemies'
import { ITEMS } from '../data/items'
import type { Interaction, Location, SubLocation } from '../types'
import { GameManager } from '../game/GameManager'

interface LocationPanelProps {
  onStartBattle: () => void
  onOpenPanel: (panel: 'inventory' | 'quests' | 'status') => void
}

type PanelMode = 'scene' | 'menu'
type SubMap = NonNullable<Location['subMap']>

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

  const [mode, setMode] = useState<PanelMode>('scene')

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
      case 'portal':
        break
    }
  }

  const subMap = location.subMap
  const effectiveSubId =
    subMap && currentSubLocationId && subMap.nodes[currentSubLocationId]
      ? currentSubLocationId
      : subMap?.startNodeId
  const subLoc = subMap && effectiveSubId ? subMap.nodes[effectiveSubId] : undefined

  if (subMap && subLoc && effectiveSubId) {
    const map = buildSubMapLayout(subMap, effectiveSubId)

    return (
      <div className="pixel-bottom-shell">
        <div className="pixel-panel pixel-bottom-grid overflow-hidden">
          <MapColumn
            locationName={location.name}
            subMap={subMap}
            layout={map}
            currentNodeId={effectiveSubId}
            onMove={travelToSubLocation}
          />

          <section className="pixel-scene-column min-w-0 border-x-2 px-3 py-3 sm:px-5" style={{ borderColor: '#172025' }}>
            {mode === 'scene' ? (
              <SceneColumn
                subLoc={subLoc}
                interactions={subLoc.interactions}
                exits={subLoc.exits ?? []}
                consumedInteractions={consumedInteractions}
                onInteraction={handleInteraction}
                onTravel={(exitId) => {
                  const dest = LOCATIONS[exitId]
                  if (!dest) return
                  travelTo(exitId)
                  GameManager.changeLocation(dest.backgroundKey)
                }}
              />
            ) : (
              <MenuColumn
                onOpenPanel={(panel) => {
                  onOpenPanel(panel)
                  setMode('scene')
                }}
              />
            )}
          </section>

          <ModeColumn mode={mode} onToggle={() => setMode((prev) => (prev === 'scene' ? 'menu' : 'scene'))} />
        </div>
      </div>
    )
  }

  return (
    <div className="pixel-bottom-shell">
      <div className="pixel-panel p-4 sm:p-5">
        <div className="mb-4">
          <div className="pixel-label mb-2">CURRENT AREA</div>
          <h2 className="text-lg font-bold tracking-[0.14em]" style={{ color: '#f8e7b7' }}>
            {location.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-xs leading-6" style={{ color: '#c9aa76' }}>
            {location.description}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {location.interactions.map((inter) => (
            <InteractionButton
              key={inter.id}
              interaction={inter}
              consumed={consumedInteractions.includes(inter.id)}
              onClick={() => handleInteraction(inter)}
            />
          ))}
        </div>

        {location.exits.length > 0 && (
          <ExitButtons
            exits={location.exits}
            onTravel={(exitId) => {
              const dest = LOCATIONS[exitId]
              if (!dest) return
              travelTo(exitId)
              GameManager.changeLocation(dest.backgroundKey)
            }}
          />
        )}
      </div>
    </div>
  )
}

function buildSubMapLayout(
  subMap: SubMap,
  currentNodeId: string,
) {
  const nodeCoords: Record<string, { col: number; row: number }> = {}
  const dirDelta = {
    north: { dc: 0, dr: -1 },
    south: { dc: 0, dr: 1 },
    west: { dc: -1, dr: 0 },
    east: { dc: 1, dr: 0 },
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

  if (!nodeCoords[currentNodeId]) {
    nodeCoords[currentNodeId] = nodeCoords[subMap.startNodeId]
  }

  const cols = Object.values(nodeCoords).map((c) => c.col)
  const rows = Object.values(nodeCoords).map((c) => c.row)
  const minCol = Math.min(...cols)
  const maxCol = Math.max(...cols)
  const minRow = Math.min(...rows)
  const maxRow = Math.max(...rows)
  const gridW = maxCol - minCol + 1
  const gridH = maxRow - minRow + 1
  const gap = 4
  const cellByW = Math.floor((112 - (gridW - 1) * gap) / gridW)
  const cellByH = Math.floor((132 - (gridH - 1) * gap) / gridH)
  const cell = Math.max(18, Math.min(31, cellByW, cellByH))

  return {
    nodeCoords,
    minCol,
    minRow,
    cell,
    gap,
    width: gridW * cell + (gridW - 1) * gap,
    height: gridH * cell + (gridH - 1) * gap,
  }
}

interface MapColumnProps {
  locationName: string
  subMap: SubMap
  layout: ReturnType<typeof buildSubMapLayout>
  currentNodeId: string
  onMove: (nodeId: string) => void
}

function MapColumn({ locationName, subMap, layout, currentNodeId, onMove }: MapColumnProps) {
  const { nodeCoords, minCol, minRow, cell, gap, width, height } = layout

  return (
    <aside className="pixel-map-column flex min-w-0 flex-col items-center justify-center px-3 py-3">
      <div className="pixel-label mb-3 text-center">{locationName}</div>
      <div className="relative" style={{ width, height }}>
        <svg className="absolute inset-0 pointer-events-none" width={width} height={height} style={{ overflow: 'visible' }}>
          {Object.entries(subMap.nodes).map(([id, node]) => {
            const from = nodeCoords[id]
            if (!from) return null
            return (['east', 'south'] as const).map((dir) => {
              const toId = node[dir]
              if (!toId) return null
              const to = nodeCoords[toId]
              if (!to) return null
              const x1 = (from.col - minCol) * (cell + gap) + cell / 2
              const y1 = (from.row - minRow) * (cell + gap) + cell / 2
              const x2 = (to.col - minCol) * (cell + gap) + cell / 2
              const y2 = (to.row - minRow) * (cell + gap) + cell / 2
              return (
                <line
                  key={`${id}-${dir}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#73613e"
                  strokeWidth="2"
                  shapeRendering="crispEdges"
                />
              )
            })
          })}
        </svg>

        {Object.entries(subMap.nodes).map(([id, node]) => {
          const coord = nodeCoords[id]
          if (!coord) return null
          const isCurrent = id === currentNodeId
          const isPortalNode = node.interactions.some((i) => i.type === 'portal')
          const left = (coord.col - minCol) * (cell + gap)
          const top = (coord.row - minRow) * (cell + gap)

          return (
            <button
              key={id}
              onClick={() => onMove(id)}
              title={node.name}
              className={`pixel-map-node absolute flex items-center justify-center text-[9px] font-bold ${
                isCurrent ? 'is-current' : ''
              } ${isPortalNode ? 'is-portal' : ''}`}
              style={{ left, top, width: cell, height: cell }}
            >
              {node.exits && node.exits.length > 0 ? '>' : isPortalNode ? '<>' : node.name.slice(0, 1)}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

interface SceneColumnProps {
  subLoc: SubLocation
  interactions: Interaction[]
  exits: string[]
  consumedInteractions: string[]
  onInteraction: (interaction: Interaction) => void
  onTravel: (exitId: string) => void
}

function SceneColumn({
  subLoc,
  interactions,
  exits,
  consumedInteractions,
  onInteraction,
  onTravel,
}: SceneColumnProps) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="mb-3">
        <div className="pixel-label mb-2">SCENE</div>
        <h2 className="truncate text-sm font-bold tracking-[0.13em] sm:text-base" style={{ color: '#f8e7b7' }}>
          {subLoc.name}
        </h2>
        <p className="mt-1 line-clamp-2 text-[11px] leading-5 sm:text-xs" style={{ color: '#c9aa76' }}>
          {subLoc.description}
        </p>
      </div>

      {interactions.length > 0 ? (
        <div className="pixel-interactions-grid grid gap-2 sm:grid-cols-2">
          {interactions.map((inter) => {
            const consumed = consumedInteractions.includes(inter.id)
            const disabled = consumed || inter.disabled || inter.type === 'portal'
            return (
              <InteractionButton
                key={inter.id}
                interaction={inter}
                consumed={consumed}
                disabled={disabled}
                onClick={() => onInteraction(inter)}
              />
            )
          })}
        </div>
      ) : (
        <p className="border-2 px-3 py-2 text-xs" style={{ borderColor: '#2e3938', color: '#7b6242' }}>
          此处暂时没有可交互之物。
        </p>
      )}

      {exits.length > 0 && <ExitButtons exits={exits} onTravel={onTravel} />}
    </div>
  )
}

interface InteractionButtonProps {
  interaction: Interaction
  consumed: boolean
  disabled?: boolean
  onClick: () => void
}

function InteractionButton({ interaction, consumed, disabled, onClick }: InteractionButtonProps) {
  const isDisabled = disabled ?? consumed
  const typeClass =
    interaction.type === 'enemy'
      ? 'pixel-interaction--enemy'
      : interaction.type === 'portal'
        ? 'pixel-interaction--portal'
        : ''

  return (
    <button
      onClick={() => !isDisabled && onClick()}
      disabled={isDisabled}
      className={`pixel-interaction ${typeClass} flex min-w-0 items-center gap-2 px-2 py-2 text-left text-[11px] sm:px-3 sm:text-xs`}
    >
      <span className="shrink-0 text-[10px] font-bold" style={{ color: markerColor(interaction.type) }}>
        {markerText(interaction.type)}
      </span>
      <span className="truncate">{interaction.label}</span>
      {consumed && (
        <span className="ml-auto shrink-0 text-[10px]" style={{ color: '#7b6242' }}>
          已完成
        </span>
      )}
      {interaction.type === 'portal' && (
        <span className="ml-auto shrink-0 text-[10px]" style={{ color: '#8a78bd' }}>
          未激活
        </span>
      )}
    </button>
  )
}

interface ExitButtonsProps {
  exits: string[]
  onTravel: (exitId: string) => void
}

function ExitButtons({ exits, onTravel }: ExitButtonsProps) {
  return (
    <div className="pixel-exit-row mt-auto flex flex-wrap gap-2 pt-3">
      {exits.map((exitId) => {
        const dest = LOCATIONS[exitId]
        if (!dest) return null
        return (
          <button
            key={exitId}
            onClick={() => onTravel(exitId)}
            className="pixel-button pixel-button--secondary px-2 py-1.5 text-[10px] font-bold tracking-[0.08em] sm:px-3 sm:text-[11px] sm:tracking-[0.12em]"
          >
            前往 {dest.name}
          </button>
        )
      })}
    </div>
  )
}

interface MenuColumnProps {
  onOpenPanel: (panel: 'inventory' | 'quests' | 'status') => void
}

function MenuColumn({ onOpenPanel }: MenuColumnProps) {
  const menuItems = [
    { id: 'inventory', marker: 'BAG', label: '背包', key: 'B' },
    { id: 'quests', marker: 'LOG', label: '任务', key: 'Q' },
    { id: 'status', marker: 'STAT', label: '状态', key: 'C' },
  ] as const

  return (
    <div className="pixel-menu-column flex h-full flex-col justify-center gap-2">
      <div className="pixel-label mb-1">ADVENTURE MENU</div>
      {menuItems.map(({ id, marker, label, key }) => (
        <button
          key={id}
          onClick={() => onOpenPanel(id)}
          className="pixel-interaction flex items-center gap-2 px-2 py-2 text-[11px] font-bold sm:gap-3 sm:px-3 sm:text-xs"
        >
          <span className="shrink-0" style={{ color: '#d6a845' }}>{marker}</span>
          <span>{label}</span>
          <span className="ml-auto text-[10px]" style={{ color: '#9b7b50' }}>[{key}]</span>
        </button>
      ))}
    </div>
  )
}

interface ModeColumnProps {
  mode: PanelMode
  onToggle: () => void
}

function ModeColumn({ mode, onToggle }: ModeColumnProps) {
  return (
    <aside className="pixel-mode-column flex flex-col items-center justify-end gap-2 px-2 py-3">
      <button
        onClick={onToggle}
        title={mode === 'scene' ? '打开菜单' : '返回场景'}
        className="pixel-button flex h-10 w-10 items-center justify-center text-[10px] font-black sm:h-11 sm:w-11 sm:text-sm"
      >
        {mode === 'scene' ? 'MENU' : 'BACK'}
      </button>
      <span className="text-[9px]" style={{ color: '#9b7b50' }}>
        {mode === 'scene' ? '菜单' : '场景'}
      </span>
    </aside>
  )
}

function markerText(type: Interaction['type']) {
  switch (type) {
    case 'npc':
      return 'NPC'
    case 'building':
      return 'SITE'
    case 'enemy':
      return 'FOE'
    case 'item':
      return 'LOOT'
    case 'portal':
      return 'GATE'
  }
}

function markerColor(type: Interaction['type']) {
  switch (type) {
    case 'npc':
      return '#d6a845'
    case 'building':
      return '#9fc08a'
    case 'enemy':
      return '#ff8b7b'
    case 'item':
      return '#74c2a8'
    case 'portal':
      return '#8a78bd'
  }
}
