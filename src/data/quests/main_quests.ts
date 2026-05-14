import type { Quest } from '../../types'

export const MAIN_QUESTS: Quest[] = [
  // ── 序章任务（游戏开始后自动激活） ──────────────────────────────────────────
  {
    id: 'quest_arrive',
    title: '初来乍到',
    description:
      '你在一个陌生的地方醒来，身边是一个叫莉娜的小女孩。据她所说，一位叫艾尔文的老先生将你救回了落瀑村——而他现在在村长之屋。你需要去找他了解更多情况。',
    status: 'locked',
    objectives: [
      {
        id: 'visit_chief',
        description: '前往村长之屋，打听艾尔文的下落',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_village_chief' },
      },
      {
        id: 'talk_elder_first',
        description: '前往艾尔文的家，与他交谈',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_elder' },
      },
    ],
    reward: { exp: 80 },
  },
  {
    id: 'quest_village_intro',
    title: '村中的面孔',
    description:
      '在离开落瀑村前，先认识几位能帮助旅人的村民。玛格熟悉休整与补给，梅娜消息灵通，托尔则掌管武器与护甲。',
    status: 'locked',
    objectives: [
      {
        id: 'talk_innkeeper',
        description: '去暮光客栈与老板娘玛格聊聊',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_innkeeper' },
      },
      {
        id: 'talk_grocer',
        description: '去杂货铺向梅娜打听消息',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_grocer' },
      },
      {
        id: 'talk_blacksmith',
        description: '去铁匠铺和托尔打个照面',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_blacksmith' },
      },
    ],
    reward: { exp: 70, gold: 30, items: [{ itemId: 'cons_mana_potion', qty: 1 }] },
  },
  {
    id: 'quest_elder',
    title: '长老的委托',
    description: '落瀑村的长老艾尔文托付给你一项重要任务——探索古代神殿遗迹，解开笼罩村庄的黑暗之谜。',
    status: 'locked',
    objectives: [
      {
        id: 'talk_elder',
        description: '与长老艾尔文交谈',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'npc_elder' },
      },
      {
        id: 'find_key',
        description: '在森林深处找到古代钥匙',
        completed: false,
        trigger: { type: 'have_item', itemId: 'qitem_ancient_key' },
      },
      {
        id: 'visit_temple',
        description: '前往古代神殿遗迹',
        completed: false,
        trigger: { type: 'visit_location', locationId: 'zone_temple_ruins' },
      },
    ],
    reward: { exp: 200, gold: 100 },
  },
  {
    id: 'quest_forest',
    title: '森林的威胁',
    description: '幽暗森林中的哥布林开始骚扰附近的村民，需要有人去清除威胁。',
    status: 'locked',
    objectives: [
      {
        id: 'defeat_goblin',
        description: '击败哥布林',
        completed: false,
        trigger: { type: 'defeat_enemy', enemyId: 'mob_goblin' },
      },
      {
        id: 'defeat_wolf',
        description: '击败森林狼',
        completed: false,
        trigger: { type: 'defeat_enemy', enemyId: 'mob_forest_wolf' },
      },
    ],
    reward: { exp: 150, gold: 60 },
  },
]
