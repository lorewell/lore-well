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
      '受伤困在残营废地的猎人托比请你前往矿壁深坑，寻找他失踪四天的同伴莱斯的下落。托比递给你一只皮质腕环——莱斯认识它。',
    status: 'locked',
    objectives: [
      {
        id: 'get_wristband',
        description: '接过托比的腕环',
        completed: false,
        trigger: { type: 'have_item', itemId: 'qitem_hunter_wristband' },
      },
      {
        id: 'visit_mine_pit',
        description: '前往矿壁深坑，寻找莱斯的线索',
        completed: false,
        trigger: { type: 'visit_location', subLocationId: 'space_mine_pit' },
      },
      {
        id: 'return_to_toby',
        description: '回到残营废地，向托比汇报',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_hunter_toby' },
      },
    ],
    reward: { exp: 120, gold: 40 },
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
]
