import type { Item } from '../../types'

export const CONSUMABLES: Record<string, Item> = {
  cons_health_potion: {
    id: 'cons_health_potion',
    name: '生命药水',
    description: '恢复 50 点 HP。',
    type: 'consumable',
    effect: { hp: 50 },
    stackable: true,
  },
  cons_mana_potion: {
    id: 'cons_mana_potion',
    name: '魔法药水',
    description: '恢复 30 点 MP。',
    type: 'consumable',
    effect: { mp: 30 },
    stackable: true,
  },
  cons_elixir: {
    id: 'cons_elixir',
    name: '高级药剂',
    description: '同时恢复 100 点 HP 和 50 点 MP。',
    type: 'consumable',
    effect: { hp: 100, mp: 50 },
    stackable: true,
  },
}
