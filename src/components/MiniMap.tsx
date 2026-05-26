import { useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import type { Location } from '../types'

type SubMap = NonNullable<Location['subMap']>

interface MiniMapProps {
  onOpenMap: () => void
}

export default function MiniMap({ onOpenMap }: MiniMapProps) {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const currentSubLocationId = useGameStore((s) => s.currentSubLocationId)

  const handleClick = useCallback(() => {
    onOpenMap()
  }, [onOpenMap])

  const location = LOCATIONS[currentLocationId]
  const subMap = location?.subMap
  if (!subMap) return null

  const effectiveId =
    currentSubLocationId && subMap.nodes[currentSubLocationId]
      ? currentSubLocationId
      : subMap.startNodeId

  const currentNode = subMap.nodes[effectiveId]
  if (!currentNode) return null

  const neighbors = getNeighbors(subMap, effectiveId)
  const cell = 28
  const gap = 4
  const size = cell * 3 + gap * 2

  return (
    <div className="pixel-minimap">
      <button
        type="button"
        onClick={handleClick}
        title="打开地图 (M)"
        className="pixel-panel flex shrink-0 items-center justify-center cursor-pointer hover:brightness-110 transition-[filter] duration-150"
        style={{
          width: size + 14,
          height: size + 14,
          borderColor: '#2e3938',
          background: 'rgba(0,0,0,0.6)',
        }}
      >
      <div className="relative" style={{ width: size, height: size }}>
        {/* 网格连线 */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          style={{ overflow: 'visible' }}
        >
          {neighbors.lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#3b4a4c"
              strokeWidth="1.5"
              shapeRendering="crispEdges"
            />
          ))}
        </svg>

        {/* 所有可见节点 */}
        {neighbors.nodes.map((n) => {
          const isCurrent = n.id === effectiveId
          const isExit = n.exits && n.exits.length > 0
          return (
            <div
              key={n.id}
              className="absolute flex flex-col items-center justify-center text-center leading-none pointer-events-none"
              style={{
                left: n.x,
                top: n.y,
                width: cell,
                height: cell,
              }}
            >
              {/* 节点圆点/箭头 */}
              <span
                className="block shrink-0 rounded-full"
                style={{
                  width: isCurrent ? 10 : 6,
                  height: isCurrent ? 10 : 6,
                  background: isCurrent ? '#d6a845' : isExit ? '#8a78bd' : '#3b4a4c',
                  boxShadow: isCurrent ? '0 0 6px rgba(214,168,69,0.6)' : 'none',
                }}
              />
              {/* 名称 */}
              <span
                className="mt-0.5 w-full truncate"
                style={{
                  fontSize: '8px',
                  color: isCurrent ? '#f8e7b7' : '#7b6242',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                }}
              >
                {n.name.length > 3 ? n.name.slice(0, 3) : n.name}
              </span>
            </div>
          )
        })}
      </div>
    </button>
    </div>
  )
}

interface NeighborNode {
  id: string
  name: string
  x: number
  y: number
  exits?: string[]
}

interface NeighborLine {
  x1: number
  y1: number
  x2: number
  y2: number
}

function getNeighbors(subMap: SubMap, centerId: string) {
  const dirs = [
    { key: 'north' as const, col: 1, row: 0 },
    { key: 'south' as const, col: 1, row: 2 },
    { key: 'west' as const, col: 0, row: 1 },
    { key: 'east' as const, col: 2, row: 1 },
  ]
  const cell = 28
  const gap = 4
  const halfCell = cell / 2
  const cx = cell + gap + halfCell
  const cy = cell + gap + halfCell

  const nodes: NeighborNode[] = []
  const lines: NeighborLine[] = []

  // 中心节点
  const center = subMap.nodes[centerId]
  nodes.push({
    id: centerId,
    name: center.name,
    x: cell + gap,
    y: cell + gap,
    exits: center.exits,
  })

  for (const { key, col, row } of dirs) {
    const neighborId = center[key]
    if (neighborId && subMap.nodes[neighborId]) {
      const neighbor = subMap.nodes[neighborId]
      const nx = col * (cell + gap)
      const ny = row * (cell + gap)
      nodes.push({
        id: neighborId,
        name: neighbor.name,
        x: nx,
        y: ny,
        exits: neighbor.exits,
      })
      // 连线：从中心到邻居
      const tx = nx + halfCell
      const ty = ny + halfCell
      lines.push({
        x1: cx,
        y1: cy,
        x2: tx,
        y2: ty,
      })
    }
  }

  return { nodes, lines }
}
