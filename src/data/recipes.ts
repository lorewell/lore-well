import type { CraftRecipe } from '../types'

/**
 * 合成配方列表（托尔铁匠铺）
 *
 * 设计原则：
 * - Tier 1（LV1）：常见材料 + 少量铁矿石，低金币费用
 * - Tier 2（LV3）：稀有材料 + 更多铁矿石，中等费用，属性更强
 * - Tier 3（LV5）：精英材料 + 多种组合，较高费用，多属性特化
 *
 * 合成装备与商店装备的差异：
 * - 商店：单一高属性（iron_sword ATK+10 / steel_sword ATK+20）
 * - 合成：双属性混合，适合不同战斗风格
 */
export const CRAFT_RECIPES: CraftRecipe[] = [
  // ── Tier 1：初级合成（LV 1，常见材料） ──────────────────────────────────────
  {
    id: 'recipe_hunters_blade',
    resultItemId: 'hunters_blade',
    goldCost: 30,
    requiredLevel: 1,
    description: '攻击与速度兼备，适合速攻流。',
    ingredients: [
      { itemId: 'wolf_fang', qty: 3 },
      { itemId: 'goblin_tooth', qty: 2 },
      { itemId: 'iron_ore', qty: 2 },
    ],
  },
  {
    id: 'recipe_venom_edge',
    resultItemId: 'venom_edge',
    goldCost: 25,
    requiredLevel: 1,
    description: '速度极高，擅长先手连击。',
    ingredients: [
      { itemId: 'spider_silk', qty: 3 },
      { itemId: 'slime_jelly', qty: 3 },
      { itemId: 'goblin_tooth', qty: 1 },
      { itemId: 'iron_ore', qty: 2 },
    ],
  },
  {
    id: 'recipe_silk_armor',
    resultItemId: 'silk_armor',
    goldCost: 30,
    requiredLevel: 1,
    description: '防御与速度均衡，轻甲首选。',
    ingredients: [
      { itemId: 'spider_silk', qty: 5 },
      { itemId: 'slime_jelly', qty: 4 },
      { itemId: 'iron_ore', qty: 1 },
    ],
  },

  // ── Tier 2：中级合成（LV 3，需要稀有材料） ──────────────────────────────────
  {
    id: 'recipe_runic_staff',
    resultItemId: 'runic_staff',
    goldCost: 60,
    requiredLevel: 3,
    description: '法力大幅提升，法师专属。',
    ingredients: [
      { itemId: 'stone_core', qty: 1 },
      { itemId: 'cursed_ash', qty: 4 },
      { itemId: 'spider_silk', qty: 2 },
      { itemId: 'iron_ore', qty: 2 },
    ],
  },
  {
    id: 'recipe_cursed_talisman',
    resultItemId: 'cursed_talisman',
    goldCost: 50,
    requiredLevel: 3,
    description: '攻击与法力双提升，攻法流最爱。',
    ingredients: [
      { itemId: 'cursed_ash', qty: 3 },
      { itemId: 'stone_core', qty: 1 },
      { itemId: 'wolf_fang', qty: 2 },
    ],
  },

  // ── Tier 3：高级合成（LV 5，顶级材料） ──────────────────────────────────────
  {
    id: 'recipe_stone_plate',
    resultItemId: 'stone_plate',
    goldCost: 80,
    requiredLevel: 5,
    description: '防御最强，HP 大幅提升，重甲坦克之选。',
    ingredients: [
      { itemId: 'stone_core', qty: 2 },
      { itemId: 'iron_ore', qty: 5 },
      { itemId: 'goblin_tooth', qty: 2 },
      { itemId: 'slime_jelly', qty: 2 },
    ],
  },
]
