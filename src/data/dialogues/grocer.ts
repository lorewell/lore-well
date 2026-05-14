import type { NPC } from '../../types'

export const grocerNPC: NPC = {
  id: 'npc_grocer',
  name: '梅娜',
  locationId: 'zone_village',
  subLocationId: 'space_village_grocer',
  interactionLabel: '杂货商 梅娜',
  dialogues: [
    {
      id: 'greeting',
      text: '哎，是那个瀑布边被救回来的旅人！快进来快进来，我这儿什么都有——药水、干粮、杂货，保证比城里便宜！你刚醒过来没多久吧？身子肯定还虚着呢——出门前至少备瓶生命药水，别嫌我啰嗦，这荒郊野岭的，有个万一连哭的地方都没有。',
      options: [
        {
          text: '让我看看你的货。',
          next: 'shop',
          action: { type: 'openShop' },
        },
        { text: '村子里最近有什么动静？', next: 'gossip' },
        { text: '第一次出门该带什么？', next: 'starter_pack' },
        { text: '你这儿什么最实惠？', next: 'cheap_tip' },
        { text: '不了，随便逛逛。' },
      ],
    },
    {
      id: 'shop',
      text: '瞧好吧，这些都是我亲自进的货，绝对实惠！',
    },
    {
      id: 'gossip',
      text: '矿洞那边好几天没运矿来了，托尔铺子里的材料快见底了。森林那边更吓人——我家小孩前两天捡回来一根折断的哥布林矛，就在村边上！以前哪有这种事啊，哥布林根本不敢靠近村子这么近。矛身上刻着些奇怪的纹路，跟普通哥布林用的破烂武器不太一样……你出去的话千万小心，感觉它们像是在集结什么。',
      options: [{ text: '我明白了，谢谢你。' }],
    },
    {
      id: 'starter_pack',
      text: '第一次离村？那就先备药，再带点能应急的小东西。你要是会用技能，就顺手带瓶魔法药水；要是只打算先在村口转转，一瓶生命药水也够撑一阵了。',
    },
    {
      id: 'cheap_tip',
      text: '如果你单纯想买药，我这儿的生命药水通常比客栈便宜五枚金币。铁矿石我也会少量进货，不过那玩意儿常常刚摆出来就被托尔惦记上。',
    },
  ],
}
