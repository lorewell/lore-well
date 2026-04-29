import type { Item } from '../types'

export const ITEMS: Record<string, Item> = {
  health_potion: {
    id: 'health_potion',
    name: '生命药水',
    description: '恢复 50 点 HP。',
    type: 'consumable',
    effect: { hp: 50 },
    stackable: true,
  },
  mana_potion: {
    id: 'mana_potion',
    name: '魔法药水',
    description: '恢复 30 点 MP。',
    type: 'consumable',
    effect: { mp: 30 },
    stackable: true,
  },
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    description: '一把普通的铁剑，锋利而耐用。',
    type: 'equipment',
    equipSlot: 'weapon',
    statBonus: { atk: 10 },
    stackable: false,
  },
  leather_armor: {
    id: 'leather_armor',
    name: '皮甲',
    description: '轻便的皮革护甲。',
    type: 'equipment',
    equipSlot: 'armor',
    statBonus: { def: 8 },
    stackable: false,
  },
  ancient_key: {
    id: 'ancient_key',
    name: '古代钥匙',
    description: '一把刻有神秘符文的钥匙，不知通向何处。',
    type: 'quest',
    stackable: false,
  },
}
