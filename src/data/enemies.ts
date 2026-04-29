import type { Enemy } from '../types'
import { ITEMS } from './items'

export const ENEMIES: Record<string, Enemy> = {
  slime: {
    id: 'slime',
    name: '史莱姆',
    stats: { hp: 40, maxHp: 40, mp: 0, maxMp: 0, atk: 8, def: 3, spd: 5 },
    skills: [],
    expReward: 20,
    dropTable: [{ item: ITEMS.health_potion, chance: 0.4 }],
    sprite: 'enemy_slime',
  },
  goblin: {
    id: 'goblin',
    name: '哥布林',
    stats: { hp: 60, maxHp: 60, mp: 10, maxMp: 10, atk: 14, def: 5, spd: 10 },
    skills: [
      {
        id: 'stab',
        name: '刺击',
        description: '快速刺出，造成 1.5 倍攻击伤害。',
        mpCost: 5,
        damage: 1.5,
      },
    ],
    expReward: 45,
    dropTable: [
      { item: ITEMS.health_potion, chance: 0.3 },
      { item: ITEMS.iron_sword, chance: 0.1 },
      { item: ITEMS.goblin_emblem, chance: 0.2 },
    ],
    sprite: 'enemy_goblin',
  },
  forest_wolf: {
    id: 'forest_wolf',
    name: '森林狼',
    stats: { hp: 80, maxHp: 80, mp: 0, maxMp: 0, atk: 18, def: 8, spd: 16 },
    skills: [
      {
        id: 'bite',
        name: '撕咬',
        description: '凶猛地撕咬，造成 1.8 倍攻击伤害。',
        mpCost: 0,
        damage: 1.8,
      },
    ],
    expReward: 70,
    dropTable: [{ item: ITEMS.leather_armor, chance: 0.15 }],
    sprite: 'enemy_wolf',
  },
  cave_spider: {
    id: 'cave_spider',
    name: '洞穴蜘蛛',
    stats: { hp: 55, maxHp: 55, mp: 0, maxMp: 0, atk: 15, def: 4, spd: 18 },
    skills: [
      {
        id: 'poison_bite',
        name: '毒牙撕咬',
        description: '注入毒液，造成 1.6 倍伤害。',
        mpCost: 0,
        damage: 1.6,
      },
    ],
    expReward: 40,
    dropTable: [
      { item: ITEMS.mana_potion, chance: 0.25 },
      { item: ITEMS.iron_ore, chance: 0.5 },
    ],
    sprite: 'enemy_spider',
  },
  goblin_mage: {
    id: 'goblin_mage',
    name: '哥布林法师',
    stats: { hp: 50, maxHp: 50, mp: 40, maxMp: 40, atk: 12, def: 3, spd: 8 },
    skills: [
      {
        id: 'fire_bolt',
        name: '火焰箭',
        description: '召唤火焰箭矢，造成 2.0 倍魔法伤害。',
        mpCost: 10,
        damage: 2.0,
      },
    ],
    expReward: 60,
    dropTable: [
      { item: ITEMS.mana_potion, chance: 0.4 },
      { item: ITEMS.magic_staff, chance: 0.05 },
    ],
    sprite: 'enemy_goblin_mage',
  },
  stone_golem: {
    id: 'stone_golem',
    name: '石像鬼',
    stats: { hp: 150, maxHp: 150, mp: 0, maxMp: 0, atk: 25, def: 20, spd: 4 },
    skills: [
      {
        id: 'smash',
        name: '重锤碾压',
        description: '举起巨拳猛砸，造成 2.2 倍攻击伤害。',
        mpCost: 0,
        damage: 2.2,
      },
    ],
    expReward: 150,
    dropTable: [
      { item: ITEMS.chain_mail, chance: 0.12 },
      { item: ITEMS.elixir, chance: 0.3 },
    ],
    sprite: 'enemy_golem',
  },
}
