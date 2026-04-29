import type { Item } from '../types'

export const ITEMS: Record<string, Item> = {
  // ── 消耗品 ──────────────────────────────────────────────────────────────────
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
  elixir: {
    id: 'elixir',
    name: '高级药剂',
    description: '同时恢复 100 点 HP 和 50 点 MP。',
    type: 'consumable',
    effect: { hp: 100, mp: 50 },
    stackable: true,
  },

  // ── 武器 ────────────────────────────────────────────────────────────────────
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    description: '一把普通的铁剑，锋利而耐用。',
    type: 'equipment',
    equipSlot: 'weapon',
    statBonus: { atk: 10 },
    stackable: false,
  },
  steel_sword: {
    id: 'steel_sword',
    name: '钢剑',
    description: '精炼钢铁打造，攻击力远胜铁剑。',
    type: 'equipment',
    equipSlot: 'weapon',
    statBonus: { atk: 20 },
    stackable: false,
  },
  magic_staff: {
    id: 'magic_staff',
    name: '法术手杖',
    description: '蕴含古老魔力，可增强法术并扩充法力上限。',
    type: 'equipment',
    equipSlot: 'weapon',
    statBonus: { atk: 8, maxMp: 30 },
    stackable: false,
  },

  // ── 护甲 ────────────────────────────────────────────────────────────────────
  leather_armor: {
    id: 'leather_armor',
    name: '皮甲',
    description: '轻便的皮革护甲。',
    type: 'equipment',
    equipSlot: 'armor',
    statBonus: { def: 8 },
    stackable: false,
  },
  chain_mail: {
    id: 'chain_mail',
    name: '锁子甲',
    description: '由铁环编织而成，防御出色。',
    type: 'equipment',
    equipSlot: 'armor',
    statBonus: { def: 18 },
    stackable: false,
  },

  // ── 饰品 ────────────────────────────────────────────────────────────────────
  swift_ring: {
    id: 'swift_ring',
    name: '疾风戒指',
    description: '戴上后脚步轻盈，逃跑成功率大幅提升。',
    type: 'equipment',
    equipSlot: 'accessory',
    statBonus: { spd: 8 },
    stackable: false,
  },
  vitality_amulet: {
    id: 'vitality_amulet',
    name: '生命护符',
    description: '镶嵌着红色宝石的护符，大幅提升生命上限。',
    type: 'equipment',
    equipSlot: 'accessory',
    statBonus: { maxHp: 50 },
    stackable: false,
  },

  // ── 材料 ────────────────────────────────────────────────────────────────────
  iron_ore: {
    id: 'iron_ore',
    name: '铁矿石',
    description: '从矿洞中开采的铁矿，铁匠托尔需要这种材料。',
    type: 'misc',
    stackable: true,
  },

  // ── 任务道具 ─────────────────────────────────────────────────────────────────
  ancient_key: {
    id: 'ancient_key',
    name: '古代钥匙',
    description: '一把刻有神秘符文的钥匙，不知通向何处。',
    type: 'quest',
    stackable: false,
  },
  goblin_emblem: {
    id: 'goblin_emblem',
    name: '哥布林徽章',
    description: '从哥布林头领身上取下的徽章，证明威胁已被清除。',
    type: 'quest',
    stackable: false,
  },
}
