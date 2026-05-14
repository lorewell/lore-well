import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { InventoryItem } from '../types'

interface Props {
  onClose: () => void
}

export default function InventoryPanel({ onClose }: Props) {
  const inventory = useGameStore((s) => s.inventory)
  const gold = useGameStore((s) => s.gold)
  const equipItem = useGameStore((s) => s.equipItem)
  const consumeItem = useGameStore((s) => s.useItem)

  const [selected, setSelected] = useState<InventoryItem | null>(null)

  const handleUse = (itemId: string) => {
    consumeItem(itemId)
    setSelected(null)
  }

  const handleEquip = (itemId: string) => {
    equipItem(itemId)
    setSelected(null)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-600/40 rounded-xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-600/30">
          <h2 className="text-yellow-300 font-bold text-lg tracking-wider">背包</h2>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-sm">💰 {gold}</span>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
            物品 ({inventory.length})
          </p>
          {inventory.length === 0 ? (
            <p className="text-gray-600 text-sm italic text-center mt-8">背包为空</p>
          ) : (
            <div className="space-y-1">
              {inventory.map((entry) => {
                const isSelected = selected?.item.id === entry.item.id
                const isEquip = entry.item.type === 'equipment'
                const isConsumable = entry.item.type === 'consumable'
                return (
                  <div
                    key={entry.item.id}
                    onClick={() => setSelected(isSelected ? null : entry)}
                    className={`rounded border px-3 py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-900/30'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm font-medium ${
                            isEquip ? 'text-blue-300' : isConsumable ? 'text-green-300' : 'text-gray-300'
                          }`}
                        >
                          {entry.item.name}
                        </span>
                        {entry.quantity > 1 && (
                          <span className="text-gray-500 text-xs ml-1">×{entry.quantity}</span>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {isConsumable && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleUse(entry.item.id) }}
                            className="text-xs bg-green-800 hover:bg-green-700 text-green-200 px-2 py-0.5 rounded"
                          >
                            使用
                          </button>
                        )}
                        {isEquip && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleEquip(entry.item.id) }}
                            className="text-xs bg-blue-800 hover:bg-blue-700 text-blue-200 px-2 py-0.5 rounded"
                          >
                            装备
                          </button>
                        )}
                      </div>
                    </div>
                    {/* 展开详情 */}
                    {isSelected && (
                      <p className="text-gray-400 text-xs mt-1 border-t border-gray-700 pt-1">
                        {entry.item.description}
                        {isEquip && entry.item.statBonus && (
                          <span className="ml-1 text-blue-400">
                            {Object.entries(entry.item.statBonus)
                              .filter(([, v]) => v)
                              .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                              .join('  ')}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
