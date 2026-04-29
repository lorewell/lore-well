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
]
