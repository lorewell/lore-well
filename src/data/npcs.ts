import type { NPC } from '../types'

export const NPCS: Record<string, NPC> = {
  // ── 序章：小莉娜（一次性开场对话，由 startNewGame 自动触发）────────────────
  lina_prologue: {
    id: 'lina_prologue',
    name: '小莉娜',
    dialogues: [
      {
        id: 'greeting',
        text: '迷迷糊糊中，好像做了一个非常漫长的梦……待你睁开眼睛，眼前出现了一张小女孩充满担忧的脸。「你终于醒了！我还以为你会一直睡下去呢。」',
        options: [
          { text: '……我在哪里？', next: 'where' },
          { text: '（努力回忆，却什么都想不起来。）', next: 'confused' },
        ],
      },
      {
        id: 'where',
        text: '这里是落瀑村，暮光客栈的客房里。三天前，艾尔文爷爷在村北的瀑布边发现了你，把你背回来的。你身上有不少伤……',
        options: [
          { text: '艾尔文？那位老先生现在在哪里？', next: 'find_elder' },
        ],
      },
      {
        id: 'confused',
        text: '没关系，你刚醒来，先别急着想。我叫莉娜，就住在这村子里。你是在村北瀑布边被艾尔文爷爷发现的——他说你身上有伤，就把你背回来了。',
        options: [
          { text: '艾尔文……那位老先生现在在哪里？', next: 'find_elder' },
        ],
      },
      {
        id: 'find_elder',
        text: '爷爷昨天去格雷村长那儿商量事情了，应该还在村长之屋。从中心广场往西北走就能找到，那栋最旧的石屋就是。你去找他吧，他肯定有话想跟你说。',
        options: [
          { text: '好，我去找他。谢谢你，莉娜。' },
        ],
      },
    ],
  },

  // ── 莉娜（客栈可重复对话）──────────────────────────────────────────────────
  lina: {
    id: 'lina',
    name: '小莉娜',
    dialogues: [
      {
        id: 'greeting',
        text: '啊，你回来了！客栈很安全的，有什么不明白的尽管来问我。',
        options: [
          { text: '艾尔文爷爷和村长那边怎么说？', next: 'hint' },
          { text: '只是来看看你。' },
        ],
      },
      {
        id: 'hint',
        text: '村长之屋在中心广场西北边，艾尔文爷爷家在村长之屋旁边再往东一点。你多保重，别一个人乱跑。',
        options: [
          { text: '知道了，谢谢莉娜。' },
        ],
      },
    ],
  },

  waterfall: {
    id: 'waterfall',
    name: '隐秘瀑布',
    dialogues: [
      {
        id: 'greeting',
        text: '一道银白色的瀑布从山间石缝中倾泻而下，水声如鼓，雾气弥漫。据村民所说，就是在这片乱石丛中，艾尔文老人发现了昏迷的你……脚下的苔藓，飞溅的水珠，一切都显得如此熟悉，却又想不起任何记忆。',
        options: [
          { text: '凝视瀑布，尝试回忆。', next: 'memory' },
          { text: '（离开）', },
        ],
      },
      {
        id: 'memory',
        text: '水雾中，一幅幅破碎的画面一闪而过——黑色的尖塔，漫天的战火，还有无数模糊的面孔……随即又消散殆尽。也许，答案就藏在某处等待着你。',
      },
    ],
  },
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
    name: '艾尔文',
    dialogues: [
      {
        id: 'greeting',
        text: '你来了，太好了。莉娜跑来告诉我你醒了，我这心里总算放下了。你在昏睡的这几天，我一直悬着心……你现在感觉怎么样？',
        options: [
          { text: '我的记忆全部消失了。', next: 'memory_lost' },
          { text: '村子现在还安全吗？', next: 'village_danger' },
          { text: '是你救了我？谢谢你。', next: 'thanks' },
        ],
      },
      {
        id: 'thanks',
        text: '举手之劳而已。那天我一早在瀑布边散步，就看见你倒在乱石丛里。不把你带回来，我怎么放得下心呢。你既然来到了落瀑村，这里就是你的家。',
      },
      {
        id: 'memory_lost',
        text: '失忆……这确实令人担忧。不过，身体会记得你曾经历过什么。先在村子里住下来，也许记忆会慢慢回来的。',
        options: [
          { text: '村子现在还安全吗？', next: 'village_danger' },
        ],
      },
      {
        id: 'village_danger',
        text: '黑暗正在蔓延，我们需要一个勇敢的人去探索古老神殿。我老了，无法亲自前往，但你……我总觉得你不是普通的旅人。',
        options: [
          { text: '告诉我更多关于神殿的事。', next: 'more' },
          { text: '我还没准备好。' },
        ],
      },

      {
        id: 'more',
        text: '带上这把古代钥匙，也许它能打开神殿的大门。那里封印着某种古老的力量……小心为上，祝你好运。',
      },
    ],
  },
  village_chief: {
    id: 'village_chief',
    name: '村长 格雷',
    dialogues: [
      {
        id: 'greeting',
        text: '你就是艾尔文从瀑布边救回来的那个旅人？你总算醒了。艾尔文刚刚还在这里，商量完事情便回他家去了——他让我转告你，说有重要的事情想告诉你，让你去找他。',
        options: [
          { text: '村子最近出了什么事？', next: 'trouble' },
          { text: '我能帮上什么忙吗？', next: 'help' },
          { text: '好，我去找艾尔文。谢谢村长。', next: 'chief_farewell' },
        ],
      },
      {
        id: 'chief_farewell',
        text: '保重，有事随时来找我。艾尔文的家就在我这往东走，那栋摆着古籍的石屋就是。',
      },
      {
        id: 'trouble',
        text: '矿洞那边有村民失踪，森林边缘每到夜晚都有怪响。更奇怪的是神殿方向偶尔会有诡异的光。我已经让大伙儿天黑后不许出门了，可这终究不是办法。',
        options: [
          { text: '我会调查这件事的。', next: 'grateful' },
          { text: '听起来很危险……', },
        ],
      },
      {
        id: 'help',
        text: '如果你真的愿意帮忙，就去找艾尔文老头问问，他对这片土地了解最深。另外，铁匠托尔和客栈的玛格也是可靠的人。',
      },
      {
        id: 'grateful',
        text: '如果你真的查清楚了，我代表全村感谢你。去找艾尔文，他知道的比我多。保重。',
      },
    ],
  },
  grocer: {
    id: 'grocer',
    name: '梅娜',
    dialogues: [
      {
        id: 'greeting',
        text: '哎，是那个瀑布边被救回来的旅人！快进来快进来，我这儿什么都有——药水、干粮、杂货，保证比城里便宜！你要买点什么吗？',
        options: [
          { text: '让我看看你的货。', next: 'shop' },
          { text: '村子里最近有什么动静？', next: 'gossip' },
          { text: '不了，随便逛逛。' },
        ],
      },
      {
        id: 'shop',
        text: '瞧好吧，这些都是我亲自进的货，绝对实惠！',
      },
      {
        id: 'gossip',
        text: '嗐，说起来吓人！听说北边矿洞有个采矿的汉子没回来，他老婆哭得可惨了。还有啊，托尔昨晚说他打铁的时候感觉地在抖……总之现在大伙儿都不安心，晚上谁都不敢出门咯！',
        options: [
          { text: '我明白了，谢谢你。' },
        ],
      },
    ],
  },
}
