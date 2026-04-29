import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Shop } from '../types'
import { ITEMS } from '../data/items'

interface Props {
  shop: Shop
  onClose: () => void
}

/** 根据物品类型给出兜底出售价格 */
function fallbackSellPrice(type: string): number {
  if (type === 'equipment') return 12
  if (type === 'consumable') return 8
  return 3
}

export default function ShopPanel({ shop, onClose }: Props) {
  const gold = useGameStore((s) => s.gold)
  const inventory = useGameStore((s) => s.inventory)
  const buyItem = useGameStore((s) => s.buyItem)
  const sellItem = useGameStore((s) => s.sellItem)
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')

  // Esc 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  /** 计算单件物品的出售价格 */
  const getSellPrice = (itemId: string): number => {
    const entry = shop.entries.find((e) => e.itemId === itemId)
    if (entry) {
      return entry.sellPrice ?? Math.floor(entry.price * 0.4)
    }
    const item = ITEMS[itemId]
    return fallbackSellPrice(item?.type ?? 'misc')
  }

  // 可出售的物品（quest 类不可售）
  const sellableInventory = inventory.filter((i) => i.item.type !== 'quest')

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-600/40 rounded-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-600/30">
          <h2 className="text-yellow-300 font-bold text-lg tracking-wider">{shop.name}</h2>
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

        {/* 买/卖 切换 */}
        <div className="flex border-b border-gray-700">
          {(['buy', 'sell'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                mode === m
                  ? 'bg-yellow-900/40 text-yellow-300 border-b-2 border-yellow-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {m === 'buy' ? '🛒 购买' : '💴 出售'}
            </button>
          ))}
        </div>

        {/* 内容列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mode === 'buy' ? (
            shop.entries.map((entry) => {
              const item = ITEMS[entry.itemId]
              if (!item) return null
              const canAfford = gold >= entry.price
              const isEquip = item.type === 'equipment'
              const isConsumable = item.type === 'consumable'

              return (
                <div
                  key={entry.itemId}
                  className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          isEquip ? 'text-blue-300' : isConsumable ? 'text-green-300' : 'text-gray-300'
                        }`}
                      >
                        {item.name}
                      </span>
                      {isEquip && item.statBonus && (
                        <span className="text-xs text-blue-500">
                          {Object.entries(item.statBonus)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                            .join('  ')}
                        </span>
                      )}
                      {isConsumable && item.effect && (
                        <span className="text-xs text-green-600">
                          {item.effect.hp ? `HP +${item.effect.hp}` : ''}
                          {item.effect.mp ? `  MP +${item.effect.mp}` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {entry.price} G
                    </span>
                    <button
                      onClick={() => buyItem(entry.itemId, entry.price)}
                      disabled={!canAfford}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                        canAfford
                          ? 'bg-yellow-800 hover:bg-yellow-700 border-yellow-600 text-yellow-100 cursor-pointer'
                          : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      购买
                    </button>
                  </div>
                </div>
              )
            })
          ) : sellableInventory.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">背包里没有可以出售的物品。</p>
          ) : (
            sellableInventory.map(({ item, quantity }) => {
              const price = getSellPrice(item.id)
              const isEquip = item.type === 'equipment'
              const isConsumable = item.type === 'consumable'

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isEquip ? 'text-blue-300' : isConsumable ? 'text-green-300' : 'text-gray-300'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-gray-600 text-xs">×{quantity}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-gray-400">{price} G</span>
                    <button
                      onClick={() => sellItem(item.id, price)}
                      className="text-xs px-2.5 py-1 rounded border bg-gray-700 hover:bg-gray-600 border-gray-500 text-gray-200 cursor-pointer transition-colors"
                    >
                      出售
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">
            {mode === 'buy' ? '点击购买后物品会直接放入背包' : '任务物品无法出售 · ESC 关闭'}
          </p>
        </div>
      </div>
    </div>
  )
}
