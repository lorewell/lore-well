import type { NPC } from '../../types'

// ── 旅行商人奥斯（客栈，贩卖补给品）──────────────────────────────────────────
export const merchantVossNPC: NPC = {
  id: 'npc_merchant_voss',
  name: '旅行商人 奥斯',
  locationId: 'zone_village',
  subLocationId: 'space_village_inn',
  interactionLabel: '旅行商人 奥斯',
  shopId: 'shop_merchant',
  dialogues: [
    {
      id: 'greeting',
      text: '哟，新面孔！奥斯·维奥，行商二十年，走遍帝国每个角落，甚至到过影月海的尽头。这里……（他扫视了一眼客栈）……确实是我见过最僻静的地方了。需要点什么？',
      options: [
        { text: '想看看你有什么东西卖。', next: 'shop', action: { type: 'openShop', shopId: 'shop_merchant' } },
        { text: '帝国最近有什么消息？', next: 'empire_news' },
        { text: '路上有什么见闻？', next: 'road_news' },
        { text: '你打算在这里待多久？', next: 'stay_long' },
      ],
    },
    {
      id: 'shop',
      text: '行，来看看老奥斯的好货——质量保证，价格公道，童叟无欺。',
    },
    {
      id: 'empire_news',
      text: '帝国？（他压低声音）……东境的矿税又涨了三成，好几个小城的矿主联合上书，都被压下去了。北方传来些奇怪的消息，说是有人在旧战场附近发现了大批魔纹石的踪迹，惹了些不该惹的人出动。你要是有心思往北走，多准备几件保命的东西。',
      options: [
        { text: '魔纹石……是什么？', next: 'about_rune_stone' },
        { text: '谢谢你的情报。' },
      ],
    },
    {
      id: 'about_rune_stone',
      text: '一种能储存魔法的特殊矿石，理论上可以用来制造强力法器。帝国魔法学院一直对这东西虎视眈眈，但矿石的分布极不规律，很难大规模开采。……不过嘛，这跟你一个在小村子里养伤的人也没什么关系，哈哈。',
      options: [
        { text: '也许有关系。' },
        { text: '嗯，你说得对，告辞。' },
      ],
    },
    {
      id: 'road_news',
      text: '路上见闻？（他乐了）向南的主干道最近不太平，有一伙自称"灰烬兄弟"的人在劫商队，不过我走的是山路，绕远了但安全。哦对了，在隘口集市遇到一个卖"治百病圣水"的骗子，被愤怒的村民追出了五里地，我也在旁边乐了半天。',
      options: [
        { text: '哈。这里附近的路呢？', next: 'local_road' },
        { text: '听着挺有意思的。' },
      ],
    },
    {
      id: 'local_road',
      text: '这里往南的森林我绕过去了，当地猎人说里面最近出没的哥布林越来越多，而且行动越来越有组织——这不太对劲。普通哥布林不会有什么纪律的，如果有人在指挥它们……',
      options: [
        { text: '我知道了，会留意的。谢谢。' },
      ],
    },
    {
      id: 'stay_long',
      text: '打算再留三四天。等脚上的水泡好一些，补好货，就继续上路了。下一站是矿镇卡格伦，那里的铁匠据说用一种古老的锻造法，我想看看能不能买几件压箱底的好货。',
      options: [
        { text: '路上多保重。', next: 'about_hero' },
        { text: '好，那先不打扰你了。' },
      ],
    },
    {
      id: 'about_hero',
      text: '你也是，兄弟。（他叹了口气）……其实我听玛格提过你的事。失忆、浑身是伤地被发现在瀑布边……说实话，这听起来不像是普通的意外。（他直视着你）你打算怎么办？',
      options: [
        { text: '把失去的东西都找回来。', next: 'brave_fool' },
        { text: '我也不知道……先走一步看一步。', next: 'brave_fool' },
      ],
    },
    {
      id: 'brave_fool',
      text: '（他看了你一眼，哈哈一笑）……是个勇敢的傻瓜，或者是个有勇气的人，这两者的区别往往要走完才能知道。总之——祝你好运，朋友。',
    },
  ],
}
