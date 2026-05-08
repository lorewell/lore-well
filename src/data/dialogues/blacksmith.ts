import type { NPC } from '../../types'

export const blacksmithNPC: NPC = {
  id: 'blacksmith',
  name: '铁匠 托尔',
  locationId: 'village',
  subLocationId: 'village_blacksmith',
  interactionLabel: '铁匠 托尔',
  onOpen: [
    { type: 'activateQuest', questId: 'quest_blacksmith' },
  ],
  dialogues: [
    {
      id: 'greeting',
      text: '哦，又来了个冒险者。我这儿有上好的武器和护甲，你需要什么？',
      options: [
        {
          text: '我想看看你的商品。',
          next: 'shop',
          action: { type: 'openShop' },
        },
        {
          text: '我想打造特殊装备。',
          next: 'craft',
          action: { type: 'openCraft' },
        },
        { text: '新手该准备什么装备？', next: 'starter_gear' },
        { text: '矿洞最近怎么了？', next: 'mine_trouble' },
        { text: '你听说哥布林的事了吗？', next: 'goblin_news' },
        {
          text: '我有铁矿石。',
          next: 'has_ore',
          condition: { type: 'hasItem', itemId: 'iron_ore' },
        },
        { text: '随便看看。' },
      ],
    },
    {
      id: 'shop',
      text: '行，你自己选吧。好货不便宜，便宜没好货。',
    },
    {
      id: 'craft',
      text: '合成装备需要特定材料，把材料备齐了拿来找我。材料都是野外怪物身上掉的，多打打就有了。',
    },
    {
      id: 'starter_gear',
      text: '如果你只是先在村子附近活动，别一上来就想着最贵的东西。弄把像样的武器，再备件轻甲，能活着回来比什么都强。',
    },
    {
      id: 'mine_trouble',
      text: '矿洞深处这几天老有震动声，运矿的人也少了。但最烦人的不是这个——有矿工说在洞口附近看到过哥布林的身影。那帮绿皮矮子以前根本不靠近矿洞这一带，现在居然敢在人类地盘上探头探脑的。我缺矿石，可更缺的是敢往里走、还能把东西带回来的人。',
    },
    {
      id: 'goblin_news',
      text: '听说了。如果外面真的有个领头的家伙在组织它们……那你光拿把普通铁剑可不够看。先把装备弄扎实了再说。',
      options: [{ text: '我明白了。' }],
    },
    {
      id: 'has_ore',
      text: '不错，带了铁矿石。我下次给你多留几件好货。',
    },
  ],
}
