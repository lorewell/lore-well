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
}
