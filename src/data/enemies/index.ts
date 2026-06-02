import type { Enemy } from '../../types'
import { ITEMS } from '../items'

/**
 * 掉落表判定规则：
 * 每个 drop 条目是《独立》模拟的，chance 表示该条目单独掉落的概率。
 * 各条目概率相加可超过 1.0，这是预期行为而非错误。
 */
export const ENEMIES: Record<string, Enemy> = {
  mob_slime: {
    id: 'mob_slime',
    name: '史莱姆',
    stats: { hp: 40, maxHp: 40, mp: 0, maxMp: 0, atk: 8, matk: 2, def: 3, mdef: 1, crit: 1, dodge: 0 },
    skills: [],
    expReward: 20,
    goldReward: 5,
    dropTable: [
      { item: ITEMS.mat_slime_jelly,      chance: 0.92, minQty: 1, maxQty: 3 },
      { item: ITEMS.cons_health_potion,   chance: 0.22 },
    ],
    sprite: 'enemy_slime',
  },
  mob_goblin: {
    id: 'mob_goblin',
    name: '哥布林',
    stats: { hp: 60, maxHp: 60, mp: 10, maxMp: 10, atk: 14, matk: 4, def: 5, mdef: 2, crit: 3, dodge: 2 },
    skills: [
      {
        id: 'skill_stab',
        name: '刺击',
        description: '快速刺出，造成 1.5 倍攻击伤害。',
        mpCost: 5,
        damage: 1.5,
      },
    ],
    expReward: 45,
    goldReward: 15,
    dropTable: [
      { item: ITEMS.mat_goblin_tooth,    chance: 0.82, minQty: 1, maxQty: 2 },
      { item: ITEMS.cons_health_potion,  chance: 0.38 },
      { item: ITEMS.equip_iron_sword,    chance: 0.1 },
      { item: ITEMS.qitem_goblin_emblem, chance: 0.28 },
    ],
    sprite: 'enemy_goblin',
  },
  mob_forest_wolf: {
    id: 'mob_forest_wolf',
    name: '森林狼',
    stats: { hp: 80, maxHp: 80, mp: 0, maxMp: 0, atk: 18, matk: 0, def: 8, mdef: 4, crit: 5, dodge: 5 },
    skills: [
      {
        id: 'skill_bite',
        name: '撕咬',
        description: '凶猛地撕咬，造成 1.8 倍攻击伤害。',
        mpCost: 0,
        damage: 1.8,
      },
    ],
    expReward: 70,
    goldReward: 20,
    dropTable: [
      { item: ITEMS.mat_wolf_fang,       chance: 0.78, minQty: 1, maxQty: 2 },
      { item: ITEMS.equip_leather_armor, chance: 0.15 },
      { item: ITEMS.cons_health_potion,  chance: 0.35 },
    ],
    sprite: 'enemy_wolf',
  },
  mob_cave_spider: {
    id: 'mob_cave_spider',
    name: '洞穴蜘蛛',
    stats: { hp: 55, maxHp: 55, mp: 0, maxMp: 0, atk: 15, matk: 0, def: 4, mdef: 3, crit: 4, dodge: 8 },
    skills: [
      {
        id: 'skill_poison_bite',
        name: '毒牙撕咬',
        description: '注入毒液，造成 1.6 倍伤害。',
        mpCost: 0,
        damage: 1.6,
      },
    ],
    expReward: 40,
    goldReward: 10,
    dropTable: [
      { item: ITEMS.mat_spider_silk,    chance: 0.87, minQty: 1, maxQty: 3 },
      { item: ITEMS.cons_mana_potion,   chance: 0.32 },
      { item: ITEMS.mat_iron_ore,       chance: 0.42, minQty: 1, maxQty: 2 },
    ],
    sprite: 'enemy_spider',
  },
  mob_goblin_mage: {
    id: 'mob_goblin_mage',
    name: '哥布林法师',
    stats: { hp: 50, maxHp: 50, mp: 40, maxMp: 40, atk: 6, matk: 18, def: 3, mdef: 8, crit: 2, dodge: 1 },
    skills: [
      {
        id: 'skill_fire_bolt',
        name: '火焰箭',
        description: '召唤火焰箭矢，造成 2.0 倍魔法伤害。',
        mpCost: 10,
        damage: 2.0,
        isMagical: true,
      },
    ],
    expReward: 60,
    goldReward: 18,
    dropTable: [
      { item: ITEMS.mat_cursed_ash,    chance: 0.82, minQty: 1, maxQty: 2 },
      { item: ITEMS.cons_mana_potion,  chance: 0.48 },
      { item: ITEMS.equip_magic_staff, chance: 0.05 },
    ],
    sprite: 'enemy_goblin_mage',
  },
  mob_stone_golem: {
    id: 'mob_stone_golem',
    name: '石像鬼',
    stats: { hp: 150, maxHp: 150, mp: 0, maxMp: 0, atk: 25, matk: 0, def: 20, mdef: 12, crit: 0, dodge: 0 },
    skills: [
      {
        id: 'skill_smash',
        name: '重锤碾压',
        description: '举起巨拳猛砸，造成 2.2 倍攻击伤害。',
        mpCost: 0,
        damage: 2.2,
      },
    ],
    expReward: 150,
    goldReward: 50,
    dropTable: [
      { item: ITEMS.mat_stone_core,     chance: 0.65, minQty: 1, maxQty: 2 },
      { item: ITEMS.equip_chain_mail,   chance: 0.12 },
      { item: ITEMS.cons_elixir,        chance: 0.38 },
      { item: ITEMS.mat_iron_ore,       chance: 0.72, minQty: 2, maxQty: 4 },
    ],
    sprite: 'enemy_golem',
  },
}
