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
        text: '啊，你回来了！客栈里暖和些吧？你要是有哪里不明白，就直接问我。',
        options: [
          { text: '艾尔文爷爷和村长那边怎么说？', next: 'hint' },
          { text: '村里还有谁能帮我？', next: 'villagers' },
          { text: '村外现在安全吗？', next: 'outskirts' },
          { text: '只是来看看你。' },
        ],
      },
      {
        id: 'hint',
        text: '村长之屋在中心广场那边，艾尔文爷爷家就在旁边。要是你怕走错，先去广场看看告示板和石井也行，村里人经常在那里碰面。',
        options: [
          { text: '知道了，谢谢莉娜。' },
        ],
      },
      {
        id: 'villagers',
        text: '玛格阿姨最会照顾旅人，梅娜阿姨总能打听到消息，托尔叔叔虽然说话硬邦邦的，但人其实很好。你要出村的话，最好都先去见一面。',
        options: [
          { text: '我会去认识他们的。' },
        ],
      },
      {
        id: 'outskirts',
        text: '白天还好，可村子外围最近总有史莱姆在晃。大家都说先别一个人往更远的地方跑，至少要先备点药水。',
        options: [
          { text: '我会小心。' },
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
          { text: '查看乱石间的痕迹。', next: 'tracks' },
        ],
      },
      {
        id: 'memory',
        text: '水雾中，一幅幅破碎的画面一闪而过——黑色的尖塔，漫天的战火，还有无数模糊的面孔……随即又消散殆尽。也许，答案就藏在某处等待着你。',
      },
      {
        id: 'tracks',
        text: '湿滑的石面上早已看不清当日留下的痕迹，只剩几道被拖拽过的浅印，一直通向村子的方向。有人确实把你从这里背了回去。',
      },
    ],
  },

  village_well: {
    id: 'village_well',
    name: '古老石井',
    dialogues: [
      {
        id: 'greeting',
        text: '石井的井沿被岁月磨得发亮，木桶绳索却仍旧结实。几名村民曾在这里打水，如今四周只剩下风吹过槐树叶的沙沙声。',
        options: [
          { text: '俯身望向井水。', next: 'reflection' },
          { text: '查看井沿刻痕。', next: 'carving' },
        ],
      },
      {
        id: 'reflection',
        text: '水面映出一张仍有些苍白的脸。陌生，却又隐约带着一种曾经久经奔波的疲惫。你盯着它看了片刻，依旧想不起自己的名字从何而来。',
      },
      {
        id: 'carving',
        text: '井沿一角刻着几道歪歪斜斜的小字，大概是孩子们练字留下的。最新的一行写着：“瀑布边捡到一个睡很久的人。”',
      },
    ],
  },

  village_notice_board: {
    id: 'village_notice_board',
    name: '告示板',
    dialogues: [
      {
        id: 'greeting',
        text: '木制告示板被风吹得吱呀作响，上面钉着几张新旧不一的纸。墨迹有深有浅，能看出村里最近添了不少麻烦。',
        options: [
          { text: '查看最新告示。', next: 'latest' },
          { text: '翻看旧纸条。', next: 'old' },
        ],
      },
      {
        id: 'latest',
        text: '最新的三张告示分别写着：夜间宵禁、矿洞失踪者登记，以及“村子外围发现史莱姆，请勿让孩子靠近”。纸角都还很新，显然是这几天才贴上的。',
      },
      {
        id: 'old',
        text: '最底下压着一张褪色的节庆通知，写着去年的丰收祭安排。村里的日子显然曾经比现在轻松得多。',
      },
    ],
  },

  elder_bookshelf: {
    id: 'elder_bookshelf',
    name: '旧书架',
    dialogues: [
      {
        id: 'greeting',
        text: '书架上摆满了翻旧的皮面古籍，书脊上布满了细小裂纹。最上层还压着几卷被反复展开过的地图。',
        options: [
          { text: '抽出一本与神殿有关的旧书。', next: 'ruins' },
          { text: '翻看村史册。', next: 'annals' },
        ],
      },
      {
        id: 'ruins',
        text: '泛黄的书页上提到：古代神殿的外门早已坍塌，但真正通往深处的封锁仍在。若想继续前进，往往需要钥匙与正确的路。',
      },
      {
        id: 'annals',
        text: '村史册记着落瀑村曾凭借瀑布和矿脉兴盛一时，后来矿脉衰竭、神殿封闭，村子才慢慢安静下来。艾尔文显然把这些旧事一直保留到了今天。',
      },
    ],
  },

  chief_map: {
    id: 'chief_map',
    name: '墙上地图',
    dialogues: [
      {
        id: 'greeting',
        text: '墙上挂着一张简陋却实用的手绘地图，边角处用木钉仔细固定。森林、矿洞、神殿遗迹和村庄之间的路径都被标了出来。',
        options: [
          { text: '查看巡逻标记。', next: 'patrol' },
          { text: '查看村路草图。', next: 'routes' },
        ],
      },
      {
        id: 'patrol',
        text: '几枚炭笔画出的叉记落在村子外围、矿洞入口和森林边缘，代表最近出事最多的地方。神殿方向则被画了一个空心圆，旁边写着“夜见异光”。',
      },
      {
        id: 'routes',
        text: '地图把村内路线画得很清楚：客栈在西，铁匠铺与杂货铺在东，艾尔文与格雷的石屋在北侧一带，南边则是离村的主路。',
      },
    ],
  },

  inn_hearth: {
    id: 'inn_hearth',
    name: '壁炉',
    dialogues: [
      {
        id: 'greeting',
        text: '壁炉里的火烧得正旺，木柴发出轻微的噼啪声。你隐约想起自己刚醒时，就是被这种暖意从寒冷的黑暗里拉了回来。',
        options: [
          { text: '把手伸向火边。', next: 'warmth' },
          { text: '看看壁炉架上的杂物。', next: 'mantle' },
        ],
      },
      {
        id: 'warmth',
        text: '热意透过掌心慢慢渗进身体，连肩背的僵硬都被驱散了些。至少此刻，这里确实像个可以暂时停留的地方。',
      },
      {
        id: 'mantle',
        text: '壁炉架上摆着几只干净的木杯、备用钥匙和一只缝补到一半的布偶。客栈不大，却被打理得井井有条。',
      },
    ],
  },

  smith_anvil: {
    id: 'smith_anvil',
    name: '铁砧',
    dialogues: [
      {
        id: 'greeting',
        text: '铁砧上还留着刚刚敲打过的火星和铁屑，旁边搁着一柄尚未开刃的剑胚。空气里满是炭火与铁锈混在一起的味道。',
        options: [
          { text: '观察冷却中的剑胚。', next: 'blade' },
          { text: '翻看矿石账本。', next: 'ledger' },
        ],
      },
      {
        id: 'blade',
        text: '剑胚厚重而朴实，看得出托尔习惯做结实耐用的家伙。边缘还没磨开，但已经能想象它最终握在手里时的分量。',
      },
      {
        id: 'ledger',
        text: '账本上记着“铁矿不足”“矿洞运料延误”“先补村卫装备”。托尔最近缺矿石，并不是一句客套话。',
      },
    ],
  },

  grocer_herbs: {
    id: 'grocer_herbs',
    name: '草药架',
    dialogues: [
      {
        id: 'greeting',
        text: '木架上挂着干燥药草和小布包，几只贴着标签的陶罐被摆得整整齐齐。空气里有股苦中带甜的草木气味。',
        options: [
          { text: '辨认常用药草。', next: 'herbs' },
          { text: '翻看旅行包样品。', next: 'packs' },
        ],
      },
      {
        id: 'herbs',
        text: '其中几种药草被标成“止血”“提神”“驱虫”。梅娜卖的不只是杂货，她显然也懂得怎么让人活着走得更远。',
      },
      {
        id: 'packs',
        text: '样品袋里装着干粮、火绒和绷带，旁边还压着一张便签：“第一次离村，先买药。”这条建议朴素，但大概从不出错。',
      },
    ],
  },

  south_signpost: {
    id: 'south_signpost',
    name: '风化路牌',
    dialogues: [
      {
        id: 'greeting',
        text: '路牌上的字迹被风雨磨蚀得有些模糊，但仍能勉强辨出三条主要去向。每一个方向，都像在催促你尽快做出选择。',
        options: [
          { text: '查看森林方向。', next: 'forest' },
          { text: '查看矿洞方向。', next: 'mine' },
          { text: '查看神殿方向。', next: 'temple' },
        ],
      },
      {
        id: 'forest',
        text: '“西南：幽暗森林。”字下多了几道新刻上去的提醒：“夜里勿入”“留意狼嚎”。',
      },
      {
        id: 'mine',
        text: '“东南：废弃矿洞。”下方的木面上钉着一枚生锈铁钉，像是曾挂过什么警告，如今只剩下空洞。',
      },
      {
        id: 'temple',
        text: '“正南：古代神殿遗迹。”这行字被额外划了一道粗粗的墨线，旁边写着“未经允许，不得靠近”。',
      },
    ],
  },

  outskirts_fence: {
    id: 'outskirts_fence',
    name: '破损栅栏',
    dialogues: [
      {
        id: 'greeting',
        text: '木栅栏有几根被撞得歪斜，地上散着碎木屑和干掉的泥痕。显然，最近确实有什么东西频繁从这里靠近村子。',
        options: [
          { text: '查看栅栏上的抓痕。', next: 'marks' },
          { text: '朝村外张望。', next: 'lookout' },
        ],
      },
      {
        id: 'marks',
        text: '抓痕不深，间距却很乱，更像是没什么脑子的黏滑小怪一路乱撞留下的。史莱姆在这里出没的说法并不像夸张。',
      },
      {
        id: 'lookout',
        text: '再往前就是渐渐荒下去的小路，草丛在风里轻轻晃动。现在看似安静，但谁都知道这种安静不会持续太久。',
      },
    ],
  },

  innkeeper: {
    id: 'innkeeper',
    name: '老板娘 玛格',
    dialogues: [
      {
        id: 'greeting',
        text: '欢迎来到暮光客栈，旅行者。脸色比刚醒那会儿好多了。想要休息、买点东西，还是打听消息？',
        options: [
          { text: '我想休息（回复满血）', next: 'rest' },
          { text: '我想买些物资。', next: 'shop' },
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
        text: '矿洞那边最近不太平，有探矿的人失踪了。森林边上也总听得到怪响。还有，神殿方向昨晚又有奇怪的光……总之，最近的落瀑村不比往常。',
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
          { text: '新手该准备什么装备？', next: 'starter_gear' },
          { text: '矿洞最近怎么了？', next: 'mine_trouble' },
          { text: '我有铁矿石。', next: 'has_ore' },
          { text: '随便看看。' },
        ],
      },
      {
        id: 'shop',
        text: '行，你自己选吧。好货不便宜，便宜没好货。',
      },
      {
        id: 'starter_gear',
        text: '如果你只是先在村子附近活动，别一上来就想着最贵的东西。弄把像样的武器，再备件轻甲，能活着回来比什么都强。',
      },
      {
        id: 'mine_trouble',
        text: '矿洞深处这几天老有震动声，运矿的人也少了。我缺矿石，可更缺的是敢往里走、还能把东西带回来的人。',
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
          { text: '村里还有谁值得我去见见？', next: 'village_people' },
          { text: '是你救了我？谢谢你。', next: 'thanks' },
        ],
      },
      {
        id: 'thanks',
        text: '举手之劳而已。那天我一早在瀑布边散步，就看见你倒在乱石丛里。不把你带回来，我怎么放得下心呢。你既然来到了落瀑村，这里就是你的家。',
      },
      {
        id: 'memory_lost',
        text: '失忆……这确实令人担忧。不过，身体会记得你曾经历过什么。先在村子里住下来，多看看、多问问，也许记忆会被熟悉的片段慢慢牵回来。',
        options: [
          { text: '那我接下来该先做什么？', next: 'village_people' },
          { text: '村子现在还安全吗？', next: 'village_danger' },
        ],
      },
      {
        id: 'village_people',
        text: '格雷掌管村务，玛格照顾往来的旅人，梅娜知道村里的消息，托尔则关心武器和矿石。你若打算离开村子，先去和他们聊聊，总不会有坏处。',
        options: [
          { text: '我明白了。' },
        ],
      },
      {
        id: 'village_danger',
        text: '黑暗正在蔓延，我们需要一个勇敢的人去探索古老神殿。我老了，无法亲自前往，但你……我总觉得你不是普通的旅人。',
        options: [
          { text: '告诉我更多关于神殿的事。', next: 'more' },
          { text: '我想先在村里做些准备。', next: 'prepare_first' },
        ],
      },
      {
        id: 'prepare_first',
        text: '谨慎是好事。先在村里熟悉路径、备好补给，再去面对外面的危险。落瀑村虽然小，却足够让你重新站稳脚跟。',
      },
      {
        id: 'more',
        text: '传说森林深处的石台匣子里藏着一把古代钥匙，它也许能帮你继续深入神殿。那里封印着某种古老的力量——若你真要去，就先做好准备。',
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
          { text: '村子里都有哪些地方？', next: 'directions' },
          { text: '你们发现我时是什么情况？', next: 'rescue_report' },
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
          { text: '听起来很危险……' },
        ],
      },
      {
        id: 'help',
        text: '如果你真的愿意帮忙，就先在村里认认人。玛格照看客栈，梅娜消息最灵，托尔虽然嘴硬，但打交道实在。去和他们聊聊，对你有好处。',
      },
      {
        id: 'directions',
        text: '中心广场往西是暮光客栈，往东是铁匠铺和杂货铺，往北能找到我和艾尔文的屋子，南路口则通往村外。要是怕记不住，看看我墙上那张地图也行。',
      },
      {
        id: 'rescue_report',
        text: '艾尔文把你带回来后，村里的人轮流照看了你两夜。谁也说不清你从哪儿来，但既然你在落瀑村醒了，我们就不会把你丢下不管。',
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
        text: '嗐，说起来吓人！听说北边矿洞有个采矿的汉子没回来，他老婆哭得可惨了。还有啊，托尔昨晚说他打铁的时候感觉地在抖……总之现在大伙儿都不安心，晚上谁都不敢出门咯！',
        options: [
          { text: '我明白了，谢谢你。' },
        ],
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
  },
}
