import type { Shop } from '../../types'

export const SHOPS: Record<string, Shop> = {
  shop_blacksmith: {
    id: 'shop_blacksmith',
    npcId: 'npc_blacksmith',
    name: '托尔的铁匠铺',
    entries: [
      { itemId: 'equip_iron_sword',      price: 80  },
      { itemId: 'equip_steel_sword',     price: 200 },
      { itemId: 'equip_leather_armor',   price: 60  },
      { itemId: 'equip_chain_mail',      price: 180 },
      { itemId: 'equip_magic_staff',     price: 220 },
      { itemId: 'equip_swift_ring',      price: 120 },
      { itemId: 'equip_vitality_amulet', price: 150 },
    ],
  },

  shop_inn: {
    id: 'shop_inn',
    npcId: 'npc_innkeeper',
    name: '暮光客栈·小卖部',
    entries: [
      { itemId: 'cons_health_potion', price: 30 },
      { itemId: 'cons_mana_potion',   price: 25 },
      { itemId: 'cons_elixir',        price: 80 },
    ],
  },

  shop_grocer: {
    id: 'shop_grocer',
    npcId: 'npc_grocer',
    name: '梅娜的杂货铺',
    entries: [
      { itemId: 'cons_health_potion', price: 25 },
      { itemId: 'cons_mana_potion',   price: 20 },
      { itemId: 'mat_iron_ore',       price: 15 },
    ],
  },

  shop_merchant: {
    id: 'shop_merchant',
    npcId: 'npc_merchant_voss',
    name: '奥斯的行商包',
    entries: [
      { itemId: 'equip_vitality_amulet', price: 200 },
      { itemId: 'cons_elixir',           price: 120 },
      { itemId: 'equip_magic_staff',     price: 280 },
    ],
  },
}

/** 根据 NPC id 查找商店（找不到返回 undefined） */
export function getShopByNpc(npcId: string): Shop | undefined {
  return Object.values(SHOPS).find((s) => s.npcId === npcId)
}
