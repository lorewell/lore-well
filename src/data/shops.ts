import type { Shop } from '../types'

/**
 * 所有商店定义
 * 扩展点：在此添加新商店，并在对应 NPC 的对话 / LocationPanel 中触发 openShop
 */
export const SHOPS: Record<string, Shop> = {
  blacksmith_shop: {
    id: 'blacksmith_shop',
    npcId: 'blacksmith',
    name: '托尔的铁匠铺',
    entries: [
      { itemId: 'iron_sword',    price: 80  },
      { itemId: 'steel_sword',   price: 200 },
      { itemId: 'leather_armor', price: 60  },
      { itemId: 'chain_mail',    price: 180 },
      { itemId: 'magic_staff',   price: 220 },
      { itemId: 'swift_ring',    price: 120 },
      { itemId: 'vitality_amulet', price: 150 },
    ],
  },

  inn_shop: {
    id: 'inn_shop',
    npcId: 'innkeeper',
    name: '暮光客栈·小卖部',
    entries: [
      { itemId: 'health_potion', price: 30  },
      { itemId: 'mana_potion',   price: 25  },
      { itemId: 'elixir',        price: 80  },
    ],
  },

  grocer_shop: {
    id: 'grocer_shop',
    npcId: 'grocer',
    name: '梅娜的杂货铺',
    entries: [
      { itemId: 'health_potion', price: 25  },
      { itemId: 'mana_potion',   price: 20  },
      { itemId: 'iron_ore',      price: 15  },
    ],
  },
}

/** 根据 NPC id 查找商店（找不到返回 undefined） */
export function getShopByNpc(npcId: string): Shop | undefined {
  return Object.values(SHOPS).find((s) => s.npcId === npcId)
}
