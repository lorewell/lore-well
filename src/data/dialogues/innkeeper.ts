import type { NPC } from '../../types'

export const innkeeperNPC: NPC = {
  id: 'innkeeper',
  name: '老板娘 玛格',
  locationId: 'village',
  subLocationId: 'village_inn',
  interactionLabel: '老板娘 玛格',
  dialogues: [
    {
      id: 'greeting',
      text: '欢迎来到暮光客栈，旅行者。脸色比刚醒那会儿好多了。想要休息、买点东西，还是打听消息？对了——你身子还没完全恢复吧？出门的话最好带瓶药水防身，我这儿有卖，梅娜那边也行，反正别空着手往村外跑。',
      options: [
        {
          text: '我想休息（回复满血）',
          next: 'rest',
          action: { type: 'restoreHpMp' },
        },
        {
          text: '我想买些物资。',
          next: 'shop',
          action: { type: 'openShop' },
        },
        { text: '最近有什么消息吗？', next: 'news' },
        { text: '是谁把我带回客栈的？', next: 'rescue' },
        { text: '离村前有什么建议？', next: 'advice' },
        { text: '不了，谢谢。' },
      ],
    },
    {
      id: 'rest',
      text: '好的，请在这里休息吧。（HP/MP 已恢复）',
    },
    {
      id: 'shop',
      text: '药水和补给，都在柜台上，你自己挑吧。要是只打算先在村口活动，备一两瓶药就够了。',
    },
    {
      id: 'news',
      text: '矿洞那边最近不太平，有探矿的人失踪了。森林边上也总听得到怪响——而且不只是狼嚎，有时候是哥布林的叫声，比从前近了好多。还有，神殿方向昨晚又有奇怪的光……自从勇者消失之后，外面的魔物就越来越放肆了，大家都说落瀑村迟早也会被盯上。',
      options: [{ text: '我知道了，谢谢。' }],
    },
    {
      id: 'rescue',
      text: '艾尔文把你从瀑布边背回来时，全身都是伤。还是莉娜第一个发现你醒过来了。你这条命啊，算是被全村一起看住了。',
    },
    {
      id: 'advice',
      text: '先把村里的人认一圈，再决定往哪边走。要是只想买药，梅娜那边通常比我便宜一点；要是想换装备，就去找托尔。别什么都没准备就冲出南路口。',
    },
  ],
}
