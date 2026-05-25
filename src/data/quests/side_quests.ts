import type { Quest } from '../../types'

export const SIDE_QUESTS: Quest[] = [
  {
    id: 'quest_supplies',
    title: '补给短缺',
    description: '旅途中需要储备足够的物资，以应对未知的危险。',
    status: 'active',
    objectives: [
      {
        id: 'get_potion',
        description: '获得至少 1 瓶生命药水',
        completed: false,
        trigger: { type: 'have_item', itemId: 'cons_health_potion' },
      },
    ],
    reward: { exp: 50 },
  },
  {
    id: 'quest_blacksmith',
    title: '铁匠的请托',
    description: '铁匠托尔需要铁矿石来打造更好的武器。前往废弃矿洞采集铁矿石，带回给他。',
    status: 'locked',
    objectives: [
      {
        id: 'get_ore',
        description: '获得铁矿石',
        completed: false,
        trigger: { type: 'have_item', itemId: 'mat_iron_ore' },
      },
    ],
    reward: { exp: 120, gold: 80, items: [{ itemId: 'equip_steel_sword', qty: 1 }] },
  },

  // ── 猎人支线：同伴的下落 ─────────────────────────────────────────────────
  {
    id: 'quest_hunter_companion',
    title: '同伴的下落',
    description:
      '猎人营地中，诺拉独自守候着丈夫托比的归来。托比和同伴进入锈齿矿洞调查异变，三周未归。她的儿子凯恩执意同去，誓要找回父亲——这片森林，他比任何人都熟悉。',
    status: 'locked',
    objectives: [
      {
        id: 'join_kain',
        description: '凯恩（猎人之子）加入队伍',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_hunter_son' },
      },
      {
        id: 'visit_mine_pit',
        description: '前往矿壁深坑寻找托比的踪迹',
        completed: false,
        trigger: { type: 'visit_location', subLocationId: 'space_mine_pit' },
      },
      {
        id: 'find_toby',
        description: '在矿壁深坑找到猎人托比',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_hunter_toby' },
      },
      {
        id: 'return_to_camp',
        description: '与托比和凯恩一同返回猎人营地',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_hunter_wife' },
      },
    ],
    reward: { exp: 150, gold: 50, items: [{ itemId: 'cons_elixir', qty: 2 }] },
  },

  // ── 彩蛋支线：戒指的秘密（后期任务，仅第一步可见）────────────────────────
  {
    id: 'quest_ring_origin',
    title: '戒指的秘密',
    description:
      '在瀑布下的水池中，你捡到了一枚陌生却莫名熟悉的戒指。某个人曾经将它交到你手中——但那个人是谁，身在何处，你全都想不起来。',
    status: 'locked',
    objectives: [
      {
        id: 'investigate_origin',
        description: '调查戒指的来源',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_ring_mystery_contact' },
      },
    ],
    reward: { exp: 0 },
  },

  // ── 森林任务链：哥布林的密谋 ─────────────────────────────────────────────
  {
    id: 'quest_goblin_conspiracy',
    title: '哥布林的密谋',
    description:
      '族徽上奇异的纹路让梅娜起了疑心——她在矿洞附近发现的哥布林武器上见过类似图案。如果有某个更高智慧的存在在幕后操控这些哥布林……',
    status: 'locked',
    objectives: [
      {
        id: 'talk_grocer_emblem',
        description: '把族徽的事告诉梅娜',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_grocer' },
      },
      {
        id: 'defeat_goblin_mage',
        description: '在乌雾林道击败哥布林法师',
        completed: false,
        trigger: { type: 'defeat_enemy', enemyId: 'mob_goblin_mage' },
      },
    ],
    reward: { exp: 200, gold: 100, items: [{ itemId: 'cons_elixir', qty: 1 }] },
  },

  // ── 森林任务链：古林的低语 ────────────────────────────────────────────────
  {
    id: 'quest_rune_whisper',
    title: '古林的低语',
    description:
      '艾尔文在古籍中读到，幽暗森林深处的界石与符文古树是某种远古传承系统的节点。也许从它们那里，你能获得关于这片土地的片段记忆。',
    status: 'locked',
    objectives: [
      {
        id: 'talk_boundary_stone',
        description: '寻找并检视刻字的界石',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'point_boundary_stone' },
      },
      {
        id: 'talk_rune_tree',
        description: '感应符文古树的低语',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'point_rune_tree' },
      },
    ],
    reward: { exp: 180, gold: 60 },
  },

  // ── 简单支线：客栈的柴火 ──────────────────────────────────────────────────
  {
    id: 'quest_mag_firewood',
    title: '客栈的柴火',
    description:
      '玛格告诉你，村南的路被哥布林堵住了，客栈的柴火眼看就要用完。她请你帮忙清一清前往灰烬谷口的路。',
    status: 'locked',
    objectives: [
      {
        id: 'enter_forest',
        description: '前往幽暗森林（灰烬谷口）',
        completed: false,
        trigger: { type: 'visit_location', locationId: 'zone_forest' },
      },
      {
        id: 'defeat_goblin_firewood',
        description: '击败挡路的哥布林',
        completed: false,
        trigger: { type: 'defeat_enemy', enemyId: 'mob_goblin' },
      },
    ],
    reward: { exp: 70, gold: 25 },
  },

  // ── 简单支线：蛛网订单 ────────────────────────────────────────────────────
  {
    id: 'quest_blacksmith_silk',
    title: '蛛网订单',
    description:
      '铁匠托尔接到了外地商人的订单，需要蜘蛛丝来完成一批蛛丝软甲。他请你帮忙从矿洞里收集材料。',
    status: 'locked',
    objectives: [
      {
        id: 'collect_silk',
        description: '收集蜘蛛丝（前往锈齿矿道）',
        completed: false,
        trigger: { type: 'have_item', itemId: 'mat_spider_silk' },
      },
    ],
    reward: { exp: 100, gold: 60, items: [{ itemId: 'equip_silk_armor', qty: 1 }] },
  },

  // ── 简单支线：村界巡逻 ────────────────────────────────────────────────────
  {
    id: 'quest_chief_patrol',
    title: '村界巡逻',
    description:
      '村长格雷请你帮忙检查村子外围的破损栅栏，并清除附近出没的哥布林，确认村界安全。',
    status: 'locked',
    objectives: [
      {
        id: 'check_fence',
        description: '查看破损的栅栏',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'point_outskirts_fence' },
      },
      {
        id: 'defeat_outskirts_goblin',
        description: '击败村外围的哥布林',
        completed: false,
        trigger: { type: 'defeat_enemy', enemyId: 'mob_goblin' },
      },
    ],
    reward: { exp: 90, gold: 50 },
  },

  // ── 故事支线：爷爷的礼物 ──────────────────────────────────────────────────
  {
    id: 'quest_lina_gift',
    title: '爷爷的礼物',
    description:
      '艾尔文的生辰快到了，莉娜想送爷爷一件有意义的礼物。据她所说，碎月祭台附近的祭台裂缝旁有一块艾尔文年轻时心心念念的流星碎石。',
    status: 'locked',
    objectives: [
      {
        id: 'visit_broken_moon_altar',
        description: '前往碎月祭台',
        completed: false,
        trigger: { type: 'visit_location', subLocationId: 'space_broken_moon_altar' },
      },
      {
        id: 'get_meteor_fragment',
        description: '找到流星碎石',
        completed: false,
        trigger: { type: 'have_item', itemId: 'qitem_meteor_fragment' },
      },
    ],
    reward: { exp: 100 },
  },

  // ── 故事支线：弟弟的下落 ──────────────────────────────────────────────────
  {
    id: 'quest_mag_brother',
    title: '弟弟的下落',
    description:
      '玛格鼓起勇气告诉你，她的弟弟罗格是三周前第一批进矿道失踪的矿工。她请你进入锈齿矿道，设法找到弟弟的消息。',
    status: 'locked',
    objectives: [
      {
        id: 'visit_mine_road',
        description: '进入锈齿矿道',
        completed: false,
        trigger: { type: 'visit_location', subLocationId: 'space_rusty_mine_road' },
      },
      {
        id: 'find_miner_tag',
        description: '找到矿工号牌',
        completed: false,
        trigger: { type: 'have_item', itemId: 'qitem_miner_tag' },
      },
    ],
    reward: { exp: 140, gold: 80 },
  },

  // ── 身份谜题：莉娜的小秘密 ────────────────────────────────────────────────
  {
    id: 'quest_torn_map',
    title: '莉娜的小秘密',
    description:
      '莉娜藏了一件事很久了——在艾尔文发现你的那天，她在乱石旁捡到了一张半烧毁的地图碎片。地图上有她看不懂的文字和一座城堡的轮廓。',
    status: 'locked',
    objectives: [
      {
        id: 'get_torn_map',
        description: '听莉娜说出秘密，获得残破地图',
        completed: false,
        trigger: { type: 'have_item', itemId: 'qitem_torn_map' },
      },
      {
        id: 'show_map_elder',
        description: '让艾尔文鉴定残破地图',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_elder' },
      },
    ],
    reward: { exp: 120 },
  },

  // ── 身份谜题：废旧传送阵的秘密 ───────────────────────────────────────────
  {
    id: 'quest_broken_portal',
    title: '废旧传送阵的秘密',
    description:
      '村南的废旧传送阵三年前骤然失效——时间与勇者卡尔失踪的夜晚完全吻合。这究竟是巧合，还是某种隐藏的联系？',
    status: 'locked',
    objectives: [
      {
        id: 'inspect_portal',
        description: '检查废旧传送阵',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'point_broken_portal' },
      },
      {
        id: 'ask_chief_portal',
        description: '询问格雷传送阵的历史',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_village_chief' },
      },
      {
        id: 'ask_elder_portal',
        description: '向艾尔文打听传送阵的异动',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_elder' },
      },
    ],
    reward: { exp: 80 },
  },
]
