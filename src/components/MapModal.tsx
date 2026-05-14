import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import type { Location } from '../types'

type SubMap = NonNullable<Location['subMap']>

interface MapModalProps {
  onClose: () => void
}

export default function MapModal({ onClose }: MapModalProps) {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const currentSubLocationId = useGameStore((s) => s.currentSubLocationId)
  const travelToSubLocation = useGameStore((s) => s.travelToSubLocation)

  const location = LOCATIONS[currentLocationId]
  const subMap = location?.subMap
  const effectiveSubId =
    subMap && currentSubLocationId && subMap.nodes[currentSubLocationId]
      ? currentSubLocationId
      : subMap?.startNodeId

  function handleMove(nodeId: string) {
    travelToSubLocation(nodeId)
    onClose()
  }

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.64)' }}
      onClick={onClose}
    >
      <div className="pixel-panel w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="pixel-label mb-1">MAP</div>
            <h2 className="text-sm font-bold tracking-[0.14em]" style={{ color: '#f8e7b7' }}>
              {location?.name ?? '未知区域'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="pixel-button px-3 py-2 text-xs font-bold">
            CLOSE
          </button>
        </div>

        {subMap && effectiveSubId ? (
          <MapDisplay
            subMap={subMap}
            currentNodeId={effectiveSubId}
            onMove={handleMove}
          />
        ) : (
          <p
            className="border-2 px-4 py-6 text-center text-xs"
            style={{ borderColor: '#2e3938', color: '#7b6242' }}
          >
            当前区域没有可用的子地图。
          </p>
        )}
      </div>
    </div>
  )
}

interface MapDisplayProps {
  subMap: SubMap
  currentNodeId: string
  onMove: (nodeId: string) => void
}

function MapDisplay({ subMap, currentNodeId, onMove }: MapDisplayProps) {
  const layout = buildSubMapLayout(subMap, currentNodeId)
  const { nodeCoords, minCol, minRow, cell, gap, width, height } = layout

  return (
    <div className="flex items-center justify-center overflow-auto py-2">
      <div className="relative" style={{ width, height }}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width={width}
          height={height}
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
              type="button"
              key={id}
              onClick={() => onMove(id)}
              title={node.name}
              className={`pixel-map-node absolute flex flex-col items-center justify-center gap-0.5 px-1 text-[9px] font-bold leading-tight ${
                isCurrent ? 'is-current' : ''
              } ${isPortalNode ? 'is-portal' : ''}`}
              style={{ left, top, width: cell, height: cell }}
            >
              <span className="text-[8px]">
                {node.exits && node.exits.length > 0 ? '▶' : isPortalNode ? '⬡' : '●'}
              </span>
              <span className="w-full truncate text-center" style={{ fontSize: '7px' }}>
                {node.name.slice(0, 4)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function buildSubMapLayout(subMap: SubMap, currentNodeId: string) {
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
  const gap = 10
  const cell = 40

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
