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
  qitem_meteor_fragment: {
    id: 'qitem_meteor_fragment',
    name: '流星碎石',
    description: '碎月祭台附近发现的古老陨石碎片，表面呈深灰色并隐约泛着暗金色光泽。即使历经岁月，依然保有某种亘古的余温。',
    type: 'quest',
    stackable: false,
  },
  qitem_miner_tag: {
    id: 'qitem_miner_tag',
    name: '矿工号牌',
    description: '锈齿矿道深处发现的铁质号牌，编号"M-017"，背面刻着名字：罗格。这是玛格失踪的弟弟的遗物。',
    type: 'quest',
    stackable: false,
  },
  qitem_torn_map: {
    id: 'qitem_torn_map',
    name: '残破地图',
    description: '一张半烧毁的地图碎片，上面有莉娜看不懂的文字和某座城堡的轮廓。艾尔文认出地图上标注的方向——那是魔王城所在的位置。',
    type: 'quest',
    stackable: false,
  },
}
