import { useGameStore } from '../store/gameStore'
import type { Shop } from '../types'
import { ITEMS } from '../data/items'

interface Props {
  shop: Shop
  onClose: () => void
}

export default function ShopPanel({ shop, onClose }: Props) {
  const gold = useGameStore((s) => s.gold)
  const buyItem = useGameStore((s) => s.buyItem)

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

        {/* 商品列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {shop.entries.map((entry) => {
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
                {/* 物品信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
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

                {/* 价格 + 购买按钮 */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
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
          })}
        </div>

        <div className="px-4 py-2 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">点击购买后物品会直接放入背包</p>
        </div>
      </div>
    </div>
  )
}
