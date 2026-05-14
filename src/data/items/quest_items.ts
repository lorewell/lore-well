import type { Item } from '../../types'

export const QUEST_ITEMS: Record<string, Item> = {
  qitem_ancient_key: {
    id: 'qitem_ancient_key',
    name: '远古钥匙',
    description: '一把刻有神秘符文的古老钥匙，能打开神殿遗址的封印之门。',
    type: 'quest',
    stackable: false,
  },
  qitem_goblin_emblem: {
    id: 'qitem_goblin_emblem',
    name: '哥布林族徽',
    description: '哥布林族长的族徽，证明你已击败哥布林领袖，可用于换取奖励。',
    type: 'quest',
    stackable: false,
  },
  qitem_mysterious_ring: {
    id: 'qitem_mysterious_ring',
    name: '神秘戒指',
    description: '在瀑布水潭中发现的精致戒指，内圈刻有看不懂的铭文，似乎来历不凡。',
    type: 'quest',
    stackable: false,
  },
  qitem_hunter_wristband: {
    id: 'qitem_hunter_wristband',
    name: '猎人腕带',
    description: '托比留下的猎人腕带，作为同伴的信物。交给村长可领取报酬，或留作纪念。',
    type: 'quest',
    stackable: false,
  },
}
