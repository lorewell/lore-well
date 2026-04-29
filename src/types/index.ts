// ─── 基础属性 ────────────────────────────────────────────────────────────────

export interface Stats {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  atk: number
  def: number
  spd: number
}

// ─── 物品 ────────────────────────────────────────────────────────────────────

export type ItemType = 'consumable' | 'equipment' | 'quest' | 'misc'
export type EquipSlot = 'weapon' | 'armor' | 'accessory'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  equipSlot?: EquipSlot
  /** 消耗品使用效果（正数回复，负数伤害） */
  effect?: Partial<Stats>
  /** 装备提供的属性加成 */
  statBonus?: Partial<Omit<Stats, 'hp' | 'mp' | 'maxHp' | 'maxMp'>>
  icon?: string
  stackable: boolean
}

export interface InventoryItem {
  item: Item
  quantity: number
}

// ─── 角色 / 敌人 ─────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  description: string
  mpCost: number
  damage?: number       // 基础伤害系数（倍 atk）
  heal?: number         // 治疗量系数（倍 maxHp）
  targetSelf?: boolean
}

export interface Character {
  id: string
  name: string
  /** 当前有效属性（基础 + 装备加成），始终通过 applyEquipmentBonuses 计算 */
  stats: Stats
  /** 纯基础属性（不含装备），用于装备/脱装时重新计算 stats */
  baseStats: Stats
  level: number
  exp: number
  expToNext: number
  skills: Skill[]
  equipment: Partial<Record<EquipSlot, Item>>
  portrait?: string     // 立绘资源 key
}

export interface Enemy {
  id: string
  name: string
  stats: Stats
  skills: Skill[]
  expReward: number
  goldReward: number
  dropTable: Array<{ item: Item; chance: number }>
  sprite?: string       // Phaser 精灵 key
}

// ─── 地点 ────────────────────────────────────────────────────────────────────

export type InteractionType = 'npc' | 'item' | 'building' | 'enemy'

export interface NPC {
  id: string
  name: string
  portrait?: string
  /** 对话节点列表 */
  dialogues: DialogueNode[]
}

export interface DialogueNode {
  id: string
  text: string
  /** 选项为空则自动关闭对话 */
  options?: Array<{ text: string; next?: string }>
}

export interface Interaction {
  id: string
  label: string
  type: InteractionType
  icon?: string
  /** 对应数据 id（NPC id / Item id / Enemy id） */
  targetId: string
  /** 是否已被消耗（如拾取物品后消失） */
  consumed?: boolean
}

export interface Location {
  id: string
  name: string
  description: string
  /** Phaser 背景 texture key */
  backgroundKey: string
  /** 可前往的地点 id */
  exits: string[]
  interactions: Interaction[]
}

// ─── 任务系统 ────────────────────────────────────────────────────────────────

export type QuestStatus = 'locked' | 'active' | 'completed'

/**
 * 自动完成触发器 —— 满足条件时自动勾选目标
 * 扩展点：添加新 type 后在 gameStore 的 autoCompleteObjectives 中处理即可
 */
export type ObjectiveTrigger =
  | { type: 'have_item'; itemId: string }
  | { type: 'defeat_enemy'; enemyId: string }
  | { type: 'visit_location'; locationId: string }
  | { type: 'talk_npc'; npcId: string }

export interface QuestObjective {
  id: string
  description: string
  completed: boolean
  trigger?: ObjectiveTrigger
}

export interface QuestReward {
  exp?: number
  gold?: number
  items?: Array<{ itemId: string; qty: number }>
}

export interface Quest {
  id: string
  title: string
  description: string
  status: QuestStatus
  objectives: QuestObjective[]
  reward?: QuestReward
}

// ─── 战斗 ────────────────────────────────────────────────────────────────────

export type BattleActionType = 'attack' | 'skill' | 'item' | 'flee'

export interface BattleAction {
  type: BattleActionType
  skillId?: string
  itemId?: string
}

export type BattlePhase = 'idle' | 'player_turn' | 'enemy_turn' | 'victory' | 'defeat' | 'flee'

export interface BattleState {
  active: boolean
  phase: BattlePhase
  enemy: Enemy | null
  playerStats: Stats   // 战斗内临时血量
  enemyStats: Stats | null
  turnLog: string[]
  round: number
}

// ─── 玩家存档 ────────────────────────────────────────────────────────────────

export interface SaveData {
  version: number
  player: Character
  inventory: InventoryItem[]
  gold: number
  currentLocationId: string
  /** 已完成交互的 id 集合（用于状态持久化） */
  consumedInteractions: string[]
}

// ─── 商店系统 ────────────────────────────────────────────────────────────────

export interface ShopEntry {
  itemId: string
  price: number          // 购买价格（金币）
  sellPrice?: number     // 出售价格（未实现时留空）
  stock?: number         // undefined = 无限库存
}

export interface Shop {
  id: string
  npcId: string          // 关联的 NPC id
  name: string
  entries: ShopEntry[]
}
