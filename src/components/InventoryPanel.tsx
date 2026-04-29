import React, { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { applyEquipmentBonuses } from '../store/gameStore'
import type { EquipSlot, InventoryItem } from '../types'

interface Props {
  onClose: () => void
}

const SLOT_LABELS: Record<EquipSlot, string> = {
  weapon: '武器',
  armor: '护甲',
  accessory: '饰品',
}

export default function InventoryPanel({ onClose }: Props) {
  const player = useGameStore((s) => s.player)
  const inventory = useGameStore((s) => s.inventory)
  const gold = useGameStore((s) => s.gold)
  const equipItem = useGameStore((s) => s.equipItem)
  const unequipItem = useGameStore((s) => s.unequipItem)
  const useItem = useGameStore((s) => s.useItem)

  const [selected, setSelected] = useState<InventoryItem | null>(null)

  const effectiveStats = applyEquipmentBonuses(player.baseStats, player.equipment)

  const handleUse = (itemId: string) => {
    useItem(itemId)
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
          <h2 className="text-yellow-300 font-bold text-lg tracking-wider">背包 & 装备</h2>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-sm">💰 {gold}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：装备槽 + 属性 */}
          <div className="w-48 border-r border-yellow-600/20 p-3 flex flex-col gap-3 shrink-0">
            <div>
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">装备栏</p>
              {(Object.keys(SLOT_LABELS) as EquipSlot[]).map((slot) => {
                const item = player.equipment[slot]
                return (
                  <div
                    key={slot}
                    className="mb-2 rounded border border-gray-700 bg-gray-800 p-2 text-xs"
                  >
                    <div className="text-gray-500 mb-1">{SLOT_LABELS[slot]}</div>
                    {item ? (
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-green-300 truncate">{item.name}</span>
                        <button
                          onClick={() => unequipItem(slot)}
                          className="text-red-400 hover:text-red-300 shrink-0"
                          title="卸下"
                        >
                          −
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600 italic">空</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 有效属性 */}
            <div>
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">当前属性</p>
              <div className="text-xs space-y-1 text-gray-300">
                {[
                  ['HP', `${player.stats.hp} / ${effectiveStats.maxHp}`],
                  ['MP', `${player.stats.mp} / ${effectiveStats.maxMp}`],
                  ['ATK', effectiveStats.atk],
                  ['DEF', effectiveStats.def],
                  ['SPD', effectiveStats.spd],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：物品列表 */}
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
                              onClick={(e) => { e.stopPropagation(); handleUse(entry.item.id) }}
                              className="text-xs bg-green-800 hover:bg-green-700 text-green-200 px-2 py-0.5 rounded"
                            >
                              使用
                            </button>
                          )}
                          {isEquip && (
                            <button
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
    </div>
  )
}
