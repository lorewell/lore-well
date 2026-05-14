import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { CRAFT_RECIPES } from '../data/recipes'
import { ITEMS } from '../data/items'
import type { CraftRecipe } from '../types'

interface CraftPanelProps {
  onClose: () => void
}

const TIER_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'TIER I', color: '#9fc08a' },
  3: { label: 'TIER II', color: '#58a6d6' },
  5: { label: 'TIER III', color: '#b07bd4' },
}

export default function CraftPanel({ onClose }: CraftPanelProps) {
  const gold = useGameStore((s) => s.gold)
  const inventory = useGameStore((s) => s.inventory)
  const player = useGameStore((s) => s.player)
  const craftItem = useGameStore((s) => s.craftItem)

  const [selected, setSelected] = useState<CraftRecipe | null>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  // Esc 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // 消息自动消失
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 2200)
    return () => clearTimeout(t)
  }, [message])

  function getHave(itemId: string) {
    return inventory.find((i) => i.item.id === itemId)?.quantity ?? 0
  }

  function canCraft(recipe: CraftRecipe): boolean {
    if ((recipe.requiredLevel ?? 1) > player.level) return false
    if (gold < recipe.goldCost) return false
    return recipe.ingredients.every((ing) => getHave(ing.itemId) >= ing.qty)
  }

  function handleCraft() {
    if (!selected) return
    const err = craftItem(selected.id)
    if (err) {
      setMessage({ text: err, ok: false })
    } else {
      const result = ITEMS[selected.resultItemId]
      setMessage({ text: `合成成功：${result?.name ?? '未知物品'}！`, ok: true })
    }
  }

  const tierGroups = [1, 3, 5] as const

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center px-3 py-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      <div
        className="pixel-panel flex w-full max-w-lg flex-col overflow-hidden"
        style={{ maxHeight: '88dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b-2 px-4 py-3" style={{ borderColor: '#2e3938' }}>
          <div>
            <div className="pixel-label mb-0.5">FORGE</div>
            <h2 className="text-sm font-bold tracking-[0.14em]" style={{ color: '#f8e7b7' }}>
              托尔的锻造台
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: '#f1c45d' }}>
              {gold} G · LV {player.level}
            </span>
            <button type="button" onClick={onClose} className="pixel-button px-3 py-1.5 text-xs font-bold">
              CLOSE
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 sm:flex-row">
          {/* 左侧：配方列表 */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'none' }}>
            {tierGroups.map((tier) => {
              const recipes = CRAFT_RECIPES.filter((r) => (r.requiredLevel ?? 1) === tier)
              if (recipes.length === 0) return null
              const tierInfo = TIER_LABEL[tier]
              return (
                <div key={tier} className="mb-3">
                  <div
                    className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest"
                    style={{ color: tierInfo.color }}
                  >
                    <span>{tierInfo.label}</span>
                    <span style={{ color: '#3b4a4c' }}>— LV {tier}+</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {recipes.map((recipe) => {
                      const result = ITEMS[recipe.resultItemId]
                      const craftable = canCraft(recipe)
                      const locked = (recipe.requiredLevel ?? 1) > player.level
                      const isSelected = selected?.id === recipe.id
                      return (
                        <button
                          type="button"
                          key={recipe.id}
                          onClick={() => setSelected(recipe)}
                          className={`pixel-interaction flex min-w-0 items-center gap-3 px-3 py-2.5 text-left ${
                            isSelected ? 'border-(--pixel-gold)' : ''
                          } ${locked ? 'opacity-40' : ''}`}
                          style={isSelected ? { borderColor: '#d6a845' } : undefined}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="truncate text-xs font-bold"
                                style={{ color: locked ? '#6d5434' : '#f8e7b7' }}
                              >
                                {result?.name ?? recipe.resultItemId}
                              </span>
                              {result?.statBonus && (
                                <span className="shrink-0 text-[10px]" style={{ color: '#7aabcd' }}>
                                  {Object.entries(result.statBonus)
                                    .filter(([, v]) => v)
                                    .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                                    .join(' ')}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[10px]" style={{ color: '#7b6242' }}>
                              {recipe.description}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            {locked ? (
                              <span className="text-[9px]" style={{ color: '#5a4070' }}>
                                LV{recipe.requiredLevel}解锁
                              </span>
                            ) : (
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: craftable ? '#73c66d' : '#c15a5a' }}
                              >
                                {craftable ? '✓ 可合成' : '✗ 缺材料'}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 右侧：配方详情 */}
          <div
            className="w-full border-t-2 p-3 sm:w-52 sm:border-l-2 sm:border-t-0"
            style={{ borderColor: '#172025' }}
          >
            {selected ? (
              <RecipeDetail
                recipe={selected}
                gold={gold}
                playerLevel={player.level}
                getHave={getHave}
                canCraft={canCraft(selected)}
                onCraft={handleCraft}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-[11px]" style={{ color: '#4a5a5c' }}>
                  选择左侧配方<br />查看详情
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 底部消息条 */}
        {message && (
          <div
            className="border-t-2 px-4 py-2 text-center text-xs font-bold"
            style={{
              borderColor: '#2e3938',
              color: message.ok ? '#73c66d' : '#d4564c',
              background: message.ok ? 'rgba(50,90,50,0.3)' : 'rgba(90,30,30,0.3)',
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

interface RecipeDetailProps {
  recipe: CraftRecipe
  gold: number
  playerLevel: number
  getHave: (itemId: string) => number
  canCraft: boolean
  onCraft: () => void
}

function RecipeDetail({ recipe, gold, playerLevel, getHave, canCraft, onCraft }: RecipeDetailProps) {
  const result = ITEMS[recipe.resultItemId]
  const locked = (recipe.requiredLevel ?? 1) > playerLevel

  return (
    <div className="flex flex-col gap-3">
      {/* 产出 */}
      <div>
        <div className="pixel-label mb-2">RESULT</div>
        <div
          className="border-2 px-3 py-2"
          style={{ borderColor: '#3d3324', background: 'rgba(25,17,10,0.5)' }}
        >
          <div className="text-xs font-bold" style={{ color: '#f8e7b7' }}>
            {result?.name}
          </div>
          {result?.statBonus && (
            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              {Object.entries(result.statBonus)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <span key={k} className="text-[10px] font-bold" style={{ color: '#73c66d' }}>
                    +{v} {k.toUpperCase()}
                  </span>
                ))}
            </div>
          )}
          <p className="mt-1 text-[10px] leading-relaxed" style={{ color: '#7b6242' }}>
            {result?.description}
          </p>
        </div>
      </div>

      {/* 材料 */}
      <div>
        <div className="pixel-label mb-2">MATERIALS</div>
        <div className="flex flex-col gap-1">
          {recipe.ingredients.map((ing) => {
            const item = ITEMS[ing.itemId]
            const have = getHave(ing.itemId)
            const enough = have >= ing.qty
            return (
              <div
                key={ing.itemId}
                className="flex items-center justify-between border-2 px-2 py-1 text-[11px]"
                style={{
                  borderColor: enough ? '#3b5a3c' : '#5a3b3b',
                  background: enough ? 'rgba(20,40,20,0.4)' : 'rgba(40,15,15,0.4)',
                }}
              >
                <span style={{ color: enough ? '#a8d4a0' : '#c08080' }}>
                  {item?.name ?? ing.itemId}
                </span>
                <span className="font-bold" style={{ color: enough ? '#73c66d' : '#d4564c' }}>
                  {have}/{ing.qty}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 费用 */}
      {recipe.goldCost > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: '#b68f59' }}>锻造费</span>
          <span
            className="font-bold"
            style={{ color: gold >= recipe.goldCost ? '#f1c45d' : '#d4564c' }}
          >
            {recipe.goldCost} G
          </span>
        </div>
      )}

      {/* 按钮 */}
      <button
        type="button"
        onClick={onCraft}
        disabled={!canCraft || locked}
        className="pixel-button w-full py-2 text-xs font-bold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {locked ? `LV${recipe.requiredLevel} 解锁` : '开始锻造'}
      </button>
    </div>
  )
}
