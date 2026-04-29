import type { Character } from '../types'

export const PLAYER_TEMPLATE: Character = {
  id: 'player',
  name: '旅行者',
  level: 1,
  exp: 0,
  expToNext: 100,
  baseStats: {
    hp: 100,
    maxHp: 100,
    mp: 40,
    maxMp: 40,
    atk: 20,
    def: 10,
    spd: 12,
  },
  stats: {
    hp: 100,
    maxHp: 100,
    mp: 40,
    maxMp: 40,
    atk: 20,
    def: 10,
    spd: 12,
  },
  skills: [
    {
      id: 'slash',
      name: '斩击',
      description: '一次有力的斩击，造成 1.4 倍攻击伤害。',
      mpCost: 8,
      damage: 1.4,
    },
    {
      id: 'heal_self',
      name: '恢复术',
      description: '恢复自身 20% 最大 HP。',
      mpCost: 12,
      heal: 0.2,
      targetSelf: true,
    },
  ],
  equipment: {},
}
