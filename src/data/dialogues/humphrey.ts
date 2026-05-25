import type { NPC } from '../../types'

// ── 老渔夫汉弗（隐秘瀑布，quest_ring_origin 线索人）──────────────────────────
export const humphreyNPC: NPC = {
  id: 'npc_ring_mystery_contact',
  name: '老渔夫 汉弗',
  locationId: 'zone_village',
  subLocationId: 'space_village_waterfall',
  interactionLabel: '老渔夫 汉弗',
  dialogues: [
    {
      id: 'greeting',
      text: '嗯？来这里的年轻人不多见呐。老汉我每天早上来这里钓鱼，几十年了，风雨不改。你……是那个被救回来的旅人？瀑布边那个？',
      options: [
        { text: '是的，我是被艾尔文救回来的那个人。', next: 'introduce' },
        { text: '你每天都来这里钓鱼？', next: 'fishing' },
        { text: '你知道三年前这里发生了什么吗？', next: 'three_years_ago' },
      ],
    },
    {
      id: 'introduce',
      text: '哦，是你啊……艾尔文把你背回村的时候我正好在钓鱼。那时候你浑身是伤，我还以为……唉，年轻人，你这条命算是捡回来了。',
      options: [
        { text: '谢谢你关心。三年前……这里有没有发生什么异常？', next: 'three_years_ago' },
        { text: '谢谢。' },
      ],
    },
    {
      id: 'fishing',
      text: '是呀，几十年了，这瀑布的鱼比以前少多了。不过我不是为了鱼才来，就是习惯了。安静，清净，想事情……',
      options: [
        { text: '三年前这里有没有发生什么特别的事？', next: 'three_years_ago' },
        { text: '那不打扰你了。' },
      ],
    },
    {
      id: 'three_years_ago',
      text: '三年前……（他沉默了一会儿，看着瀑布）……三年前的那个秋夜，我在这里钓夜鱼。突然天上有一道白光——不是闪电，不是流星——是一道像人形状的白光，从很高很高的地方坠下来，直接落进了这片潭里。我以为有人掉进去了，急忙去捞，但什么都没捞到。只有……只有一枚戒指，压在水底的碎石里。',
      options: [
        { text: '戒指？你把戒指怎么处置了？', next: 'about_ring' },
        { text: '那道光……你没有告诉其他人吗？', next: 'why_silent' },
      ],
    },
    {
      id: 'about_ring',
      text: '我捡起来看了看——金色的，花纹像藤蔓缠着星星，内圈好像还有什么字，磨得看不清了。……我觉得这不是我该拿的东西，就又放回水底了。后来……（他看了看你的手）……后来也就忘了。',
      options: [
        {
          text: '（取出神秘戒指）……是这枚吗？',
          condition: { type: 'hasItem', itemId: 'qitem_mysterious_ring' },
          next: 'ring_reaction',
        },
        { text: '……我明白了，谢谢你。' },
      ],
    },
    {
      id: 'ring_reaction',
      text: '（他的眼睛睁大了，盯着戒指看了很久，手微微颤抖。）……是这个。就是这个。你……你是从那道光里来的？（他声音沙哑地说）……那年，落进瀑布的……是你。',
      options: [
        { text: '（握紧戒指，沉默。）……谢谢你告诉我。', next: 'ring_farewell' },
      ],
    },
    {
      id: 'ring_farewell',
      text: '……我也不知道你是谁，从哪里来。但能活着，就是好事。戒指是你的，是你的就要带着它。（他转回去看着水面，不再说话。）',
    },
    {
      id: 'why_silent',
      text: '告诉谁呢？说我看见一道人形的光从天上掉下来？村里人会把我当老糊涂。……只有艾尔文，他大概知道些什么，但他从来不主动问我，我也没有主动说过。',
      options: [
        { text: '那枚戒指……你把它放回哪里了？', next: 'about_ring' },
      ],
    },
  ],
}
