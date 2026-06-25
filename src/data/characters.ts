import type { Character } from '../types'
import { HERO_TALENT, calcBaseStats } from '../game/stats'

/** 勇者初始能力值（均衡分配） */
const HERO_ABILITIES = { str: 5, agi: 5, int: 5, con: 5 }

const heroBase = calcBaseStats(HERO_ABILITIES, 1, HERO_TALENT)

export const PLAYER_TEMPLATE: Character = {
  id: 'player',
  name: '勇者',
  level: 1,
  exp: 0,
  expToNext: 100,
  abilities: { ...HERO_ABILITIES },
  abilityPoints: 0,
  talent: { ...HERO_TALENT },
  baseStats: {
    ...heroBase,
    hp: heroBase.maxHp,
    mp: heroBase.maxMp,
  },
  stats: {
    ...heroBase,
    hp: heroBase.maxHp,
    mp: heroBase.maxMp,
  },
  skills: [
    {
      id: 'skill_slash',
      name: '斩击',
      description: '一次有力的斩击，造成 1.4 倍攻击伤害。',
      mpCost: 8,
      damage: 1.4,
    },
    {
      id: 'skill_heal_self',
      name: '恢复术',
      description: '恢复自身 20% 最大 HP。',
      mpCost: 12,
      heal: 0.2,
      targetSelf: true,
    },
  ],
  equipment: {},
}
