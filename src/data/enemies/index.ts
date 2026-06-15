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

  // ── 森林浅层新怪物 ─────────────────────────────────────────────────────
  mob_swamp_frog: {
    id: 'mob_swamp_frog',
    name: '泥沼蛙',
    stats: { hp: 85, maxHp: 85, mp: 0, maxMp: 0, atk: 9, matk: 0, def: 12, mdef: 3, crit: 2, dodge: 2 },
    skills: [
      {
        id: 'skill_tongue_lash',
        name: '舌鞭',
        description: '弹出长舌抽打，造成 1.6 倍攻击伤害。',
        mpCost: 0,
        damage: 1.6,
      },
    ],
    expReward: 50,
    goldReward: 12,
    dropTable: [
      { item: ITEMS.mat_slime_jelly,    chance: 0.85, minQty: 1, maxQty: 2 },
      { item: ITEMS.cons_health_potion, chance: 0.25 },
      { item: ITEMS.mat_iron_ore,       chance: 0.30, minQty: 1, maxQty: 2 },
    ],
    sprite: 'enemy_frog',
  },

  // ── 森林深处新怪物 ─────────────────────────────────────────────────────
  mob_shadow_vine: {
    id: 'mob_shadow_vine',
    name: '暗影妖藤',
    stats: { hp: 65, maxHp: 65, mp: 30, maxMp: 30, atk: 8, matk: 16, def: 4, mdef: 6, crit: 3, dodge: 1 },
    skills: [
      {
        id: 'skill_vine_whip',
        name: '藤蔓抽打',
        description: '以暗影藤蔓抽打敌人，造成 1.8 倍魔法伤害。',
        mpCost: 8,
        damage: 1.8,
        isMagical: true,
      },
    ],
    expReward: 55,
    goldReward: 15,
    dropTable: [
      { item: ITEMS.mat_cursed_ash,   chance: 0.60, minQty: 1, maxQty: 2 },
      { item: ITEMS.cons_mana_potion, chance: 0.35 },
      { item: ITEMS.mat_spider_silk,  chance: 0.40, minQty: 1, maxQty: 2 },
    ],
    sprite: 'enemy_vine',
  },

  mob_corrupted_treant: {
    id: 'mob_corrupted_treant',
    name: '腐化树灵',
    stats: { hp: 130, maxHp: 130, mp: 0, maxMp: 0, atk: 22, matk: 0, def: 15, mdef: 8, crit: 0, dodge: 0 },
    skills: [
      {
        id: 'skill_root_smash',
        name: '根须重击',
        description: '以粗壮根须猛击地面，造成 2.0 倍攻击伤害。',
        mpCost: 0,
        damage: 2.0,
      },
    ],
    expReward: 120,
    goldReward: 35,
    dropTable: [
      { item: ITEMS.mat_stone_core,    chance: 0.40, minQty: 1, maxQty: 1 },
      { item: ITEMS.mat_wolf_fang,     chance: 0.50, minQty: 1, maxQty: 2 },
      { item: ITEMS.cons_elixir,       chance: 0.20 },
      { item: ITEMS.mat_iron_ore,      chance: 0.45, minQty: 1, maxQty: 3 },
    ],
    sprite: 'enemy_treant',
  },

  // ── 矿洞新怪物 ─────────────────────────────────────────────────────────
  mob_cave_bat: {
    id: 'mob_cave_bat',
    name: '矿洞蝠群',
    stats: { hp: 30, maxHp: 30, mp: 0, maxMp: 0, atk: 12, matk: 0, def: 3, mdef: 2, crit: 8, dodge: 12 },
    skills: [
      {
        id: 'skill_sonic_screech',
        name: '音波尖啸',
        description: '发出刺耳音波，造成 1.5 倍攻击伤害。',
        mpCost: 0,
        damage: 1.5,
      },
    ],
    expReward: 30,
    goldReward: 8,
    dropTable: [
      { item: ITEMS.mat_goblin_tooth,  chance: 0.40, minQty: 1, maxQty: 1 },
      { item: ITEMS.cons_health_potion, chance: 0.20 },
      { item: ITEMS.mat_iron_ore,      chance: 0.25, minQty: 1, maxQty: 1 },
    ],
    sprite: 'enemy_bat',
  },
}
