import type { Quest } from '../types'

/**
 * 初始任务列表
 * 扩展点：直接在此数组中添加新任务，系统自动展示
 *
 * status 说明：
 *   'locked'    — 未触发，任务日志中不显示
 *   'active'    — 进行中
 *   'completed' — 已完成
 */
export const INITIAL_QUESTS: Quest[] = [
  // ── 序章任务（游戏开始后自动激活） ──────────────────────────────────────────
  {
    id: 'quest_arrive',
    title: '初来乍到',
    description: '你在一个陌生的地方醒来，身边是一个叫莉娜的小女孩。据她所说，一位叫艾尔文的老先生将你救回了落瀑村——而他现在在村长之屋。你需要去找他了解更多情况。',
    status: 'locked',
    objectives: [
      {
        id: 'visit_chief',
        description: '前往村长之屋，打听艾尔文的下落',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'village_chief' },
      },
      {
        id: 'talk_elder_first',
        description: '前往艾尔文的家，与他交谈',
        completed: false,
        trigger: { type: 'talk_npc', npcId: 'elder' },
      },
    ],
    reward: { exp: 80 },
  },
  {
    id: 'quest_elder',
    title: '长老的委托',
    description: '晨曦村的长老艾尔文托付给你一项重要任务——探索古代神殿遗迹，解开笼罩村庄的黑暗之谜。',
    status: 'locked',
    objectives: [
      { id: 'talk_elder', description: '与长老艾尔文交谈', completed: false, trigger: { type: 'talk_npc', npcId: 'elder' } },
      { id: 'find_key', description: '在森林深处找到古代钥匙', completed: false, trigger: { type: 'have_item', itemId: 'ancient_key' } },
      { id: 'visit_temple', description: '前往古代神殿遗迹', completed: false, trigger: { type: 'visit_location', locationId: 'temple_ruins' } },
    ],
    reward: { exp: 200, gold: 100 },
  },
  {
    id: 'quest_forest',
    title: '森林的威胁',
    description: '幽暗森林中的哥布林开始骚扰附近的村民，需要有人去清除威胁。',
    status: 'locked',
    objectives: [
      { id: 'defeat_goblin', description: '击败哥布林', completed: false, trigger: { type: 'defeat_enemy', enemyId: 'goblin' } },
      { id: 'defeat_wolf', description: '击败森林狼', completed: false, trigger: { type: 'defeat_enemy', enemyId: 'forest_wolf' } },
    ],
    reward: { exp: 150, gold: 60 },
  },
  {
    id: 'quest_supplies',
    title: '补给短缺',
    description: '旅途中需要储备足够的物资，以应对未知的危险。',
    status: 'active',
    objectives: [
      { id: 'get_potion', description: '获得至少 1 瓶生命药水', completed: false, trigger: { type: 'have_item', itemId: 'health_potion' } },
    ],
    reward: { exp: 50 },
  },
  {
    id: 'quest_blacksmith',
    title: '铁匠的请托',
    description: '铁匠托尔需要铁矿石来打造更好的武器。前往废弃矿洞采集铁矿石，带回给他。',
    status: 'locked',
    objectives: [
      { id: 'get_ore', description: '获得铁矿石', completed: false, trigger: { type: 'have_item', itemId: 'iron_ore' } },
      { id: 'return_to_smith', description: '带铁矿石回去找铁匠托尔', completed: false, trigger: { type: 'talk_npc', npcId: 'blacksmith' } },
    ],
    reward: { exp: 120, gold: 80, items: [{ itemId: 'steel_sword', qty: 1 }] },
  },
]
