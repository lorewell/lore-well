import type { Abilities, Stats, Talent } from '../types'

/**
 * 能力值 → 战斗属性映射
 * 力量→物攻+物防，敏捷→暴击+闪避，智力→魔攻+魔防，体质→生命+魔力
 */
export function calcBaseStats(
  abilities: Abilities,
  level: number,
  talent: Talent,
): Omit<Stats, 'hp' | 'mp'> {
  const lvl = level - 1
  return {
    maxHp: Math.round(100 + abilities.con * 8 + lvl * talent.maxHp),
    maxMp: Math.round(40 + abilities.con * 3 + lvl * talent.maxMp),
    atk: Math.round(10 + abilities.str * 2 + lvl * talent.atk),
    matk: Math.round(5 + abilities.int * 2 + lvl * talent.matk),
    def: Math.round(5 + abilities.str * 0.5 + lvl * talent.def),
    mdef: Math.round(3 + abilities.int * 0.5 + lvl * talent.mdef),
    crit: Math.round((5 + abilities.agi * 0.4 + lvl * talent.crit) * 10) / 10,
    dodge: Math.round((3 + abilities.agi * 0.4 + lvl * talent.dodge) * 10) / 10,
  }
}

/** 勇者天赋：均衡型，各项都有加成 */
export const HERO_TALENT: Talent = {
  maxHp: 4,
  maxMp: 2,
  atk: 0.8,
  matk: 0.8,
  def: 0.6,
  mdef: 0.6,
  crit: 0.1,
  dodge: 0.1,
}
