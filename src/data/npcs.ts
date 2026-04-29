import type { NPC } from '../types'

export const NPCS: Record<string, NPC> = {
  innkeeper: {
    id: 'innkeeper',
    name: '老板娘 玛格',
    dialogues: [
      {
        id: 'greeting',
        text: '欢迎来到暮光客栈，旅行者！想要休息一下吗？',
        options: [
          { text: '我想休息（回复满血）', next: 'rest' },
          { text: '最近有什么消息吗？', next: 'news' },
          { text: '不了，谢谢。' },
        ],
      },
      {
        id: 'rest',
        text: '好的，请在这里休息吧。（HP/MP 已恢复）',
      },
      {
        id: 'news',
        text: '听说森林里最近出现了异常活动，村民们都不敢靠近……小心点吧。',
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
        text: '哦，又来了个冒险者。我这儿有好东西，不过你得先给我带些铁矿石。',
        options: [
          { text: '我有铁矿石。', next: 'has_ore' },
          { text: '我去找找看。' },
        ],
      },
      {
        id: 'has_ore',
        text: '不错！我来给你打造点好东西。（功能待完善）',
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
