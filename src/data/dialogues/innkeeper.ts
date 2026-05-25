import type { NPC } from '../../types'

export const innkeeperNPC: NPC = {
  id: 'npc_innkeeper',
  name: '老板娘 玛格',
  locationId: 'zone_village',
  subLocationId: 'space_village_inn',
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
        {
          text: '我来帮你砸柴火的。',
          next: 'firewood_quest_start',
          action: { type: 'activateQuest', questId: 'quest_mag_firewood' },
        },
        {
          text: '我想问问你弟弟的事。',
          condition: { type: 'questStatus', questId: 'quest_mag_brother', status: ['locked'] },
          next: 'brother_talk',
          action: { type: 'activateQuest', questId: 'quest_mag_brother' },
        },
        {
          text: '关于你弟弟——我找到了一些东西。',
          condition: { type: 'questStatus', questId: 'quest_mag_brother', status: ['active', 'completed'] },
          next: 'brother_thanks',
        },
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
    {
      id: 'firewood_quest_start',
      text: '哪——真的？（她抹了抹手。）那太好了，苦死我了。我需要一批材料，是天干的泊山松木，长约四尺。平时就在圆琥山谷口那边连着，但最近路被哥布林堵住了。你要是能帮我把路清斷一下就太感激了。',
    },
    {
      id: 'brother_talk',
      text: '（她停顿了很久才开口。）……我弟弟罗格，三周前跟着首批进矿道的矿工就失联系了。官府说是矿道崩塌，但……但我不知道。我——你下次进矿道的时候，能帮我一起找找吗？哪怕只是一个迃息。',
    },
    {
      id: 'brother_thanks',
      text: '（她接过号牌，长久地没有说话。）……是罗格的。我认得出来，这是她用燒子刻上去的字。……谢谢你。至少我现在知道了。（她把号牌紧紧拡在手心里，转身回到柜台后面。）',
    },
  ],
}
