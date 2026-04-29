import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { ENEMIES } from '../data/enemies'
import { ITEMS } from '../data/items'
import type { Interaction } from '../types'
import { GameManager } from '../game/GameManager'

interface LocationPanelProps {
  onStartBattle: () => void
}

export default function LocationPanel({ onStartBattle }: LocationPanelProps) {
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const travelTo = useGameStore((s) => s.travelTo)
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

  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent 100%)' }}
    >
      <div className="px-6 pb-6 pt-12">
        {/* 地点标题 */}
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

        {/* 交互列表 */}
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
                  background: consumed
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: inter.type === 'enemy' ? '#440022' : '#2a1840',
                  color: consumed ? '#5a4070' : inter.type === 'enemy' ? '#cc6688' : '#c0a0e0',
                }}
                onMouseEnter={(e) => {
                  if (!consumed)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(170,85,255,0.12)'
                }}
                onMouseLeave={(e) => {
                  if (!consumed)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.05)'
                }}
              >
                <span className="text-base">{iconMap[inter.type]}</span>
                <span>{inter.label}</span>
                {consumed && (
                  <span className="ml-auto text-[10px]" style={{ color: '#5a4070' }}>
                    已完成
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 出口 */}
        {location.exits.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] tracking-widest self-center" style={{ color: '#5a4070' }}>
              前往：
            </span>
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
                  style={{
                    borderColor: '#3a2050',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#9070b0',
                  }}
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
