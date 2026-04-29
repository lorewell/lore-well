import type { NPC } from '../types'

export const NPCS: Record<string, NPC> = {
  innkeeper: {
    id: 'innkeeper',
    name: '老板娘 玛格',
    dialogues: [
      {
        id: 'greeting',
        text: '欢迎来到暮光客栈，旅行者！想要休息，还是买点什么？',
        options: [
          { text: '我想休息（回复满血）', next: 'rest' },
          { text: '我想买些物资。', next: 'shop' },
          { text: '最近有什么消息吗？', next: 'news' },
          { text: '不了，谢谢。' },
        ],
      },
      {
        id: 'rest',
        text: '好的，请在这里休息吧。（HP/MP 已恢复）',
      },
      {
        id: 'shop',
        text: '药水和补给，都在柜台上，你自己挑吧。',
      },
      {
        id: 'news',
        text: '听说矿洞那边最近不太平，有探矿的人失踪了。还有，神殿方向昨晚又有奇怪的光……小心点吧。',
        options: [{ text: '我知道了，谢谢。' }],
      },
    ],
  },
  blacksmith: {
    id: 'blacksmith',
    name: '铁匠 托尔',
    dialogues: [
      {
        id: 'greeting',
        text: '哦，又来了个冒险者。我这儿有上好的武器和护甲，你需要什么？',
        options: [
          { text: '我想看看你的商品。', next: 'shop' },
          { text: '我有铁矿石。', next: 'has_ore' },
          { text: '随便看看。' },
        ],
      },
      {
        id: 'shop',
        text: '行，你自己选吧。好货不便宜，便宜没好货。',
      },
      {
        id: 'has_ore',
        text: '不错，带了铁矿石。我下次给你多留几件好货。',
      },
    ],
  },
  elder: {
    id: 'elder',
    name: '长老 艾尔文',
    dialogues: [
      {
        id: 'greeting',
        text: '年轻人，你来得正好。黑暗正在蔓延，我们需要一个勇敢的人去探索古老神殿。',
        options: [
          { text: '告诉我更多。', next: 'more' },
          { text: '我还没准备好。' },
        ],
      },
      {
        id: 'more',
        text: '带上这把古代钥匙，也许它能打开神殿的大门。祝你好运。',
      },
    ],
  },
}
