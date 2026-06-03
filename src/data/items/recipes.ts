import type { CraftRecipe } from '../../types'

export const CRAFT_RECIPES: CraftRecipe[] = [
  // ── Tier 1：初级合成（LV 1，常见材料） ──────────────────────────────────
  {
    id: 'recipe_hunters_blade',
    resultItemId: 'equip_hunters_blade',
    goldCost: 30,
    requiredLevel: 1,
    description: '均衡武器，攻击与速度兼备，适合初期探索。',
    ingredients: [
      { itemId: 'mat_wolf_fang', qty: 2 },
      { itemId: 'mat_goblin_tooth', qty: 2 },
      { itemId: 'mat_iron_ore', qty: 3 },
    ],
  },
  {
    id: 'recipe_venom_edge',
    resultItemId: 'equip_venom_edge',
    goldCost: 30,
    requiredLevel: 1,
    description: '高速武器，适合速攻流派。',
    ingredients: [
      { itemId: 'mat_spider_silk', qty: 2 },
      { itemId: 'mat_slime_jelly', qty: 3 },
      { itemId: 'mat_iron_ore', qty: 2 },
    ],
  },
  {
    id: 'recipe_silk_armor',
    resultItemId: 'equip_silk_armor',
    goldCost: 40,
    requiredLevel: 1,
    description: '防御与速度兼备的轻型护甲。',
    ingredients: [
      { itemId: 'mat_spider_silk', qty: 3 },
      { itemId: 'mat_slime_jelly', qty: 2 },
    ],
  },
  {
    id: 'recipe_wolf_mask',
    resultItemId: 'equip_wolf_mask',
    goldCost: 25,
    requiredLevel: 1,
    description: '攻击与速度兼备的头盔，适合速攻流派。',
    ingredients: [
      { itemId: 'mat_wolf_fang', qty: 3 },
      { itemId: 'mat_iron_ore', qty: 2 },
    ],
  },
  {
    id: 'recipe_tracker_boots',
    resultItemId: 'equip_tracker_boots',
    goldCost: 25,
    requiredLevel: 1,
    description: '速度与防御均衡的鞋子，森林追踪者必备。',
    ingredients: [
      { itemId: 'mat_wolf_fang', qty: 2 },
      { itemId: 'mat_goblin_tooth', qty: 3 },
    ],
  },

  // ── Tier 2：中级合成（LV 3，稀有材料） ──────────────────────────────────
  {
    id: 'recipe_runic_staff',
    resultItemId: 'equip_runic_staff',
    goldCost: 60,
    requiredLevel: 3,
    description: '同时造成物理与魔法双重伤害的强力符文法杖。',
    ingredients: [
      { itemId: 'mat_stone_core', qty: 1 },
      { itemId: 'mat_cursed_ash', qty: 2 },
      { itemId: 'mat_iron_ore', qty: 3 },
    ],
  },
  {
    id: 'recipe_cursed_talisman',
    resultItemId: 'equip_cursed_talisman',
    goldCost: 50,
    requiredLevel: 3,
    description: '攻击与法力双重强化的饰品。',
    ingredients: [
      { itemId: 'mat_cursed_ash', qty: 3 },
      { itemId: 'mat_stone_core', qty: 1 },
    ],
  },
  {
    id: 'recipe_shadow_hood',
    resultItemId: 'equip_shadow_hood',
    goldCost: 45,
    requiredLevel: 3,
    description: '防御与法力兼备的暗影兜帽。',
    ingredients: [
      { itemId: 'mat_cursed_ash', qty: 2 },
      { itemId: 'mat_spider_silk', qty: 3 },
    ],
  },
  {
    id: 'recipe_cursed_greaves',
    resultItemId: 'equip_cursed_greaves',
    goldCost: 45,
    requiredLevel: 3,
    description: '攻防兼备的诅咒胫甲，适合正面硬抗。',
    ingredients: [
      { itemId: 'mat_cursed_ash', qty: 2 },
      { itemId: 'mat_stone_core', qty: 1 },
      { itemId: 'mat_iron_ore', qty: 3 },
    ],
  },

  // ── Tier 3：高级合成（LV 5，顶级材料） ──────────────────────────────────
  {
    id: 'recipe_stone_plate',
    resultItemId: 'equip_stone_plate',
    goldCost: 80,
    requiredLevel: 5,
    description: '防御最强，HP 大幅提升，重甲坦克之选。',
    ingredients: [
      { itemId: 'mat_stone_core', qty: 2 },
      { itemId: 'mat_iron_ore', qty: 5 },
      { itemId: 'mat_goblin_tooth', qty: 2 },
      { itemId: 'mat_slime_jelly', qty: 2 },
    ],
  },
]
