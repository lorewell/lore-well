import type { NPC } from '../../types'

// ── 序章莉娜（一次性开场，由 startNewGame 自动触发）────────────────────────
export const linaPrologueNPC: NPC = {
  id: 'npc_lina_prologue',
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
}

// ── 莉娜（客栈可重复对话）─────────────────────────────────────────────────
export const linaNPC: NPC = {
  id: 'npc_lina',
  name: '小莉娜',
  locationId: 'zone_village',
  subLocationId: 'space_village_inn',
  interactionLabel: '小莉娜',
  dialogues: [
    {
      id: 'greeting',
      text: '啊，你回来了！客栈里暖和些吧？你要是有哪里不明白，就直接问我。',
      options: [
        { text: '艾尔文爷爷和村长那边怎么说？', next: 'hint' },
        { text: '村里还有谁能帮我？', next: 'villagers' },
        { text: '村外现在安全吗？', next: 'outskirts' },
        { text: '村北那个瀑布……我听说我就是在那里被发现的？', next: 'waterfall_question' },
        { text: '只是来看看你。' },
      ],
    },
    {
      id: 'hint',
      text: '村长之屋在中心广场那边，艾尔文爷爷家就在旁边。要是你怕走错，先去广场看看告示板和石井也行，村里人经常在那里碰面。',
      options: [{ text: '知道了，谢谢莉娜。' }],
    },
    {
      id: 'villagers',
      text: '玛格阿姨最会照顾旅人，梅娜阿姨总能打听到消息，托尔叔叔虽然说话硬邦邦的，但人其实很好。你要出村的话，最好都先去见一面。',
      options: [{ text: '我会去认识他们的。' }],
    },
    {
      id: 'outskirts',
      text: '白天还好……但最近村子外围哥布林变多了，以前它们根本不敢靠近这么近。艾尔文爷爷说是因为勇者消失之后魔物才越来越大胆的。大家都说先别一个人往更远的地方跑，至少要先备点药水。',
      options: [{ text: '我会小心。' }],
    },
    {
      id: 'waterfall_question',
      text: '对呀对呀！就是村子北边那个隐秘瀑布——水特别清，潭底的石头都看得一清二楚。平时没什么人去那边，但风景真的很好……你要是想散散心的话可以去看看，说不定还能想起什么来呢。',
      options: [{ text: '嗯，我会去看看的。' }],
    },
  ],
}
