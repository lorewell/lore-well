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
  /** 装备提供的属性加成（可含 maxHp / maxMp，但不含当前 hp/mp） */
  statBonus?: Partial<Omit<Stats, 'hp' | 'mp'>>
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

export interface DropEntry {
  item: Item
  chance: number
  minQty?: number   // 最小掉落数量，默认 1
  maxQty?: number   // 最大掉落数量，默认 1
}

export interface Enemy {
  id: string
  name: string
  stats: Stats
  skills: Skill[]
  expReward: number
  goldReward: number
  dropTable?: DropEntry[]
  sprite?: string       // Phaser 精灵 key
}

// ─── 地点 ────────────────────────────────────────────────────────────────────

export type InteractionType = 'npc' | 'item' | 'building' | 'enemy' | 'portal'

// ─── 对话：动作 ──────────────────────────────────────────────────────────────

/**
 * 声明式对话动作 —— 在选项上声明，DialogBox 统一分发，无需改组件即可新增效果。
 * 扩展点：在 gameStore.dispatchDialogueAction 中处理新 type 即可。
 */
export type DialogueAction =
  | { type: 'restoreHpMp' }
  | { type: 'openShop' }
  | { type: 'openCraft' }
  | { type: 'addItem'; itemId: string; qty?: number }
  | { type: 'activateQuest'; questId: string }
  | { type: 'consumeInteraction'; interactionId: string }
  | { type: 'custom'; key: string }   // 兜底：任意自定义 key，在 store 侧处理

// ─── 对话：条件 ──────────────────────────────────────────────────────────────

/**
 * 声明式对话条件 —— 节点或选项满足条件时才可见 / 可到达。
 * 在 DialogBox 中通过 evaluateCondition() 求值。
 */
export type DialogueCondition =
  | { type: 'hasItem'; itemId: string }
  | { type: 'questStatus'; questId: string; status: QuestStatus }
  | { type: 'not'; condition: DialogueCondition }
  | { type: 'and'; conditions: DialogueCondition[] }
  | { type: 'or'; conditions: DialogueCondition[] }

export interface DialogueOption {
  text: string
  next?: string
  /** 选此项时触发的动作（可选） */
  action?: DialogueAction
  /** 满足条件才显示此选项；缺省则始终显示 */
  condition?: DialogueCondition
}

export interface DialogueNode {
  id: string
  text: string
  /** 满足条件才能到达此节点；缺省则始终可到达 */
  condition?: DialogueCondition
  /** 选项为空时，由 UI 提供结束对话按钮 */
  options?: DialogueOption[]
}

export interface NPC {
  id: string
  name: string
  portrait?: string
  /** 对话节点列表 */
  dialogues: DialogueNode[]
  /** NPC 初始所在大地点 id（无位置的固定场景点可不填） */
  locationId?: string
  /** NPC 初始所在子节点 id */
  subLocationId?: string
  /** 交互列表显示的按钮文本，不填则使用 name */
  interactionLabel?: string
  /**
   * 打开对话时自动触发的动作列表（替代 gameStore.openDialogue 中的硬编码 if）。
   * 每次调用 openDialogue 时均会依序分发。
   */
  onOpen?: DialogueAction[]
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
  /** 强制禁用（如损坏的传送阵）——不同于 consumed，展示不同样式 */
  disabled?: boolean
  /** 传送目标地点 id 列表（portal 类型专用，激活后填写） */
  portalTargets?: string[]
}

/** 小地图中的单个节点 */
export interface SubLocation {
  id: string
  name: string
  description: string
  interactions: Interaction[]
  /** 四向连接（值为同一大地点内的 SubLocation id） */
  north?: string
  south?: string
  east?: string
  west?: string
  /** 此节点可通往的世界地图大地点 id（出口节点才填写） */
  exits?: string[]
}

export interface Location {
  id: string
  name: string
  description: string
  /** Phaser 背景 texture key */
  backgroundKey: string
  /** 世界地图出口（保留兼容，小地图模式改用 SubLocation.exits） */
  exits: string[]
  /** 顶层交互（保留兼容，小地图模式改用 subMap） */
  interactions: Interaction[]
  /** 小地图数据（存在时启用双层地图模式） */
  subMap?: {
    nodes: Record<string, SubLocation>
    startNodeId: string
  }
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
  | { type: 'visit_location'; locationId?: string; subLocationId?: string }
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

// ─── 合成 ────────────────────────────────────────────────────────────────────

export interface CraftIngredient {
  itemId: string
  qty: number
}

export interface CraftRecipe {
  id: string
  resultItemId: string
  /** 合成费用（金币），可为 0 */
  goldCost: number
  ingredients: CraftIngredient[]
  /** 解锁条件：需要达到的等级，默认 1 */
  requiredLevel?: number
  description?: string
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
  loot: InventoryItem[]  // 本场战斗掉落的物品
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
