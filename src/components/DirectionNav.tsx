import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'

interface DirEntry {
  dir: 'north' | 'south' | 'east' | 'west'
  icon: string
  className: string
}

const DIRS: DirEntry[] = [
  { dir: 'north', icon: '▲', className: 'top-0 left-1/2 -translate-x-1/2' },
  { dir: 'south', icon: '▼', className: 'bottom-0 left-1/2 -translate-x-1/2' },
  { dir: 'east',  icon: '▶', className: 'right-0 top-1/2 -translate-y-1/2' },
  { dir: 'west',  icon: '◀', className: 'left-0 top-1/2 -translate-y-1/2' },
]

export default function DirectionNav() {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const currentSubLocationId = useGameStore((s) => s.currentSubLocationId)
  const travelToSubLocation = useGameStore((s) => s.travelToSubLocation)

  const location = LOCATIONS[currentLocationId]
  const subMap = location?.subMap
  if (!subMap) return null

  const effectiveId =
    currentSubLocationId && subMap.nodes[currentSubLocationId]
      ? currentSubLocationId
      : subMap.startNodeId

  const currentNode = subMap.nodes[effectiveId]
  if (!currentNode) return null

  const availableDirs = DIRS.filter((d) => {
    const neighborId = currentNode[d.dir]
    return neighborId && subMap.nodes[neighborId]
  })

  if (availableDirs.length === 0) return null

  return (
    <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none" style={{ paddingTop: '80px', paddingBottom: '170px' }}>
      <div className="relative w-full h-full" style={{ maxWidth: 460, maxHeight: 460 }}>
        {availableDirs.map(({ dir, icon, className }) => {
          const neighborId = currentNode[dir]!
          const neighbor = subMap.nodes[neighborId]

          return (
            <button
              key={dir}
              type="button"
              onClick={() => travelToSubLocation(neighborId)}
              className={`absolute flex flex-col items-center gap-1 pointer-events-auto cursor-pointer transition-all duration-150 hover:scale-105 hover:brightness-125 ${className}`}
            >
              <span
                className="text-lg leading-none drop-shadow-lg"
                style={{ color: '#d6a845' }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-bold tracking-wider px-2 py-0.5 border text-center leading-tight"
                style={{
                  borderColor: '#59442a',
                  color: '#f8e7b7',
                  background: 'rgba(0,0,0,0.55)',
                  whiteSpace: 'nowrap',
                }}
              >
                {neighbor.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
