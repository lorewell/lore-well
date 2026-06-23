import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Character,
  InventoryItem,
  BattleState,
  Item,
  Enemy,
  Stats,
  BattleAction,
  EquipSlot,
  Quest,
  ObjectiveTrigger,
  Abilities,
  Talent,
} from '../types'
import { PLAYER_TEMPLATE } from '../data/characters'
import { LOCATIONS, STARTING_LOCATION } from '../data/locations'
import { INITIAL_QUESTS } from '../data/quests'
import { ITEMS, CRAFT_RECIPES } from '../data/items'
import { NPCS } from '../data/dialogues'
import type { DialogueAction } from '../types'

// ─── 存档版本 ────────────────────────────────────────────────────────────────
const SAVE_VERSION = 6

// ─── 存档迁移：v4 → v5 (ID 重命名) ──────────────────────────────────────────
const ID_MIGRATION_MAP: Record<string, string> = {
  health_potion: 'cons_health_potion', mana_potion: 'cons_mana_potion', elixir: 'cons_elixir',
  iron_sword: 'equip_iron_sword', steel_sword: 'equip_steel_sword', magic_staff: 'equip_magic_staff',
  leather_armor: 'equip_leather_armor', chain_mail: 'equip_chain_mail', swift_ring: 'equip_swift_ring',
  vitality_amulet: 'equip_vitality_amulet', hunters_blade: 'equip_hunters_blade',
  venom_edge: 'equip_venom_edge', runic_staff: 'equip_runic_staff', silk_armor: 'equip_silk_armor',
  stone_plate: 'equip_stone_plate', cursed_talisman: 'equip_cursed_talisman',
  iron_ore: 'mat_iron_ore', slime_jelly: 'mat_slime_jelly', wolf_fang: 'mat_wolf_fang',
  spider_silk: 'mat_spider_silk', goblin_tooth: 'mat_goblin_tooth', stone_core: 'mat_stone_core',
  cursed_ash: 'mat_cursed_ash', ancient_key: 'qitem_ancient_key', goblin_emblem: 'qitem_goblin_emblem',
  mysterious_ring: 'qitem_mysterious_ring',
  village: 'zone_village', forest: 'zone_forest', temple_ruins: 'zone_temple_ruins',
  village_center: 'space_village_center', village_waterfall: 'space_village_waterfall',
  village_elder_home: 'space_village_elder_home', village_chief_home: 'space_village_chief_home',
  village_outskirts: 'space_village_outskirts', village_inn: 'space_village_inn',
  village_blacksmith: 'space_village_blacksmith', village_grocer: 'space_village_grocer',
  village_south_gate: 'space_village_south_gate', village_portal: 'space_village_portal',
  ash_valley_gate: 'space_ash_valley_gate', bone_marsh: 'space_bone_marsh',
  ruined_camp: 'space_ruined_camp', misty_forest_path: 'space_misty_forest_path',
  broken_moon_altar: 'space_broken_moon_altar', ghost_grove: 'space_ghost_grove',
  rusty_mine_road: 'space_rusty_mine_road', mine_pit: 'space_mine_pit',
  dark_vein_wall: 'space_dark_vein_wall', temple_outer: 'space_temple_outer',
  temple_inner: 'space_temple_inner', temple_altar: 'space_temple_altar',
  temple_corridor: 'space_temple_corridor',
  lina_prologue: 'npc_lina_prologue', lina: 'npc_lina', innkeeper: 'npc_innkeeper',
  elder: 'npc_elder', village_chief: 'npc_village_chief', blacksmith: 'npc_blacksmith',
  grocer: 'npc_grocer', hunter_toby: 'npc_hunter_toby', hunter_wife: 'npc_hunter_wife', hunter_son: 'npc_hunter_son',
}

// ─── NPC 位置快照类型 ────────────────────────────────────────────────────────
export interface NpcLocationEntry {
  locationId: string
  subLocationId: string
}

/** 从 NPCS 静态数据初始化位置快照 */
function buildInitialNpcLocations(): Record<string, NpcLocationEntry> {
  const result: Record<string, NpcLocationEntry> = {}
  for (const npc of Object.values(NPCS)) {
    if (npc.locationId && npc.subLocationId) {
      result[npc.id] = { locationId: npc.locationId, subLocationId: npc.subLocationId }
    }
  }
  return result
}

// ─── 属性计算辅助 ────────────────────────────────────────────────────────────

/**
 * 将装备加成叠加到 baseStats 上，返回有效属性
 * 扩展点：可在此处加入状态异常、Buff 等修正
 */
export function applyEquipmentBonuses(
  baseStats: Stats,
  equipment: Partial<Record<EquipSlot, Item>>,
): Stats {
  const result = { ...baseStats }
  for (const item of Object.values(equipment)) {
    if (!item?.statBonus) continue
    for (const [k, v] of Object.entries(item.statBonus)) {
      if (v !== undefined) {
        ;(result as Record<string, number>)[k] =
          ((result as Record<string, number>)[k] ?? 0) + v
      }
    }
  }
  return result
}

/**
 * 伤害计算：百分比减免公式
 * reduction = def / (def + 100)，最终伤害 = atk × multiplier × (1 - reduction) × 随机浮
 * 物理伤害：(atk, def)，魔法伤害：(matk, mdef)
 */
function calcDamage(atk: number, def: number, multiplier = 1): number {
  const reduction = def / (def + 100)
  const raw = atk * multiplier * (1 - reduction)
  const variance = 0.85 + Math.random() * 0.3 // 0.85–1.15 浮动
  return Math.max(1, Math.round(raw * variance))
}

/**
 * 能力值 → 战斗属性映射
 * 力量→物攻+物防，敏捷→暴击+闪避，智力→魔攻+魔防，体质→生命+魔力
 */
export function calcBaseStats(abilities: Abilities, level: number, talent: Talent): Omit<Stats, 'hp' | 'mp'> {
  const lvl = level - 1
  return {
    maxHp: Math.round(100 + abilities.con * 8 + lvl * talent.maxHp),
    maxMp: Math.round(40 + abilities.con * 3 + lvl * talent.maxMp),
    atk: Math.round(10 + abilities.str * 2 + lvl * talent.atk),
    matk: Math.round(5 + abilities.int * 2 + lvl * talent.matk),
    def: Math.round(5 + abilities.str * 0.5 + lvl * talent.def),
    mdef: Math.round(3 + abilities.int * 0.5 + lvl * talent.mdef),
    crit: Math.round((5 + abilities.agi * 0.4 + lvl * talent.crit) * 10) / 10,
    dodge: Math.round((3 + abilities.agi * 0.4 + lvl * talent.dodge) * 10) / 10,
  }
}

/** 勇者天赋：均衡型，各项都有加成 */
export const HERO_TALENT: Talent = {
  maxHp: 4,
  maxMp: 2,
  atk: 0.8,
  matk: 0.8,
  def: 0.6,
  mdef: 0.6,
  crit: 0.1,
  dodge: 0.1,
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

// ─── State 接口 ──────────────────────────────────────────────────────────────

interface GameState {
  started: boolean
  player: Character
  /** 同伴队伍（共享背包/金币，各自独立装备/等级/技能） */
  companions: Character[]
  inventory: InventoryItem[]
  gold: number
  currentLocationId: string
  /** 当前所在子地点 id（使用小地图时有效） */
  currentSubLocationId: string | null
  consumedInteractions: string[]
  quests: Quest[]
  battle: BattleState
  activeDialogue: { npcId: string; nodeId: string } | null
  activeShopNpcId: string | null
  /** 当前开放合成界面的 NPC id（null 表示未开放） */
  activeCraftNpcId: string | null
  /** NPC 当前位置快照，可在运行时更改 */
  npcLocations: Record<string, NpcLocationEntry>

  // 基础操作
  startNewGame: (playerName?: string) => void
  travelTo: (locationId: string) => void
  travelToSubLocation: (subId: string) => void

  // 物品操作
  addItem: (item: Item, qty?: number) => void
  removeItem: (itemId: string, qty?: number) => void
  useItem: (itemId: string) => boolean

  // 装备操作
  equipItem: (itemId: string) => boolean
  unequipItem: (slot: EquipSlot) => void

  // 地点/交互
  consumeInteraction: (interactionId: string) => void

  // 对话
  openDialogue: (npcId: string) => void
  advanceDialogue: (nodeId: string) => void
  closeDialogue: () => void
  /** 统一分发对话动作（由 DialogBox 调用，无需在组件层判断 npcId） */
  dispatchDialogueAction: (action: DialogueAction, npcId: string) => void

  // 战斗
  startBattle: (enemy: Enemy) => void
  executeBattleAction: (action: BattleAction) => void
  restoreHpMp: () => void
  gainExp: (amount: number) => void

  // 任务
  activateQuest: (questId: string) => void
  completeQuest: (questId: string) => void

  // NPC 移动
  moveNpc: (npcId: string, locationId: string, subLocationId: string) => void

  // 商店
  openShop: (npcId: string) => void
  closeShop: () => void
  buyItem: (itemId: string, price: number) => boolean
  sellItem: (itemId: string, price: number) => boolean

  // 合成
  openCraft: (npcId: string) => void
  closeCraft: () => void
  /** 尝试合成配方，返回错误信息或 null（成功） */
  craftItem: (recipeId: string) => string | null

  // 复活
  respawnAtVillage: () => void

  // 能力值分配
  allocateAbility: (key: keyof Abilities) => void

  // 内部：自动完成任务目标（暴露在接口上以消除 TS 报错）
  _autoCompleteObjectives: (trigger: ObjectiveTrigger) => void
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      started: false,
      player: structuredClone(PLAYER_TEMPLATE),
      companions: [],
      inventory: [],
      gold: 50,
      currentLocationId: STARTING_LOCATION,
      currentSubLocationId: LOCATIONS[STARTING_LOCATION].subMap?.startNodeId ?? null,
      consumedInteractions: [],
      quests: structuredClone(INITIAL_QUESTS),
      activeDialogue: null,
      activeShopNpcId: null,
      activeCraftNpcId: null,
      npcLocations: buildInitialNpcLocations(),

      battle: {
        active: false,
        phase: 'idle',
        enemy: null,
        playerStats: structuredClone(PLAYER_TEMPLATE.stats),
        enemyStats: null,
        turnLog: [],
        round: 0,
        loot: [],
      },

      // ── 开始新游戏 ──────────────────────────────────────────────────────────
      startNewGame: (playerName = '勇者') => {
        const player = structuredClone(PLAYER_TEMPLATE)
        player.name = playerName
        set({
          started: true,
          player,
          companions: [],
          inventory: [],
          gold: 50,
          currentLocationId: STARTING_LOCATION,
          currentSubLocationId: LOCATIONS[STARTING_LOCATION].subMap?.startNodeId ?? null,
          consumedInteractions: [],
          quests: structuredClone(INITIAL_QUESTS),
          activeDialogue: { npcId: 'npc_lina_prologue', nodeId: 'greeting' },
          activeShopNpcId: null,
          activeCraftNpcId: null,
          npcLocations: buildInitialNpcLocations(),
          battle: {
            active: false,
            phase: 'idle',
            enemy: null,
            playerStats: structuredClone(player.stats),
            enemyStats: null,
            turnLog: [],
            round: 0,
            loot: [],
          },
        })
        // 序章对话自动激活初始任务
        get().activateQuest('quest_arrive')
        get().activateQuest('quest_village_intro')
      },

      // ── 大地点切换（世界地图级） ──────────────────────────────────
      travelTo: (locationId) => {
        const startSub = LOCATIONS[locationId]?.subMap?.startNodeId ?? null
        set({ currentLocationId: locationId, currentSubLocationId: startSub })
        get()._autoCompleteObjectives({ type: 'visit_location', locationId })
      },

      // ── 小地图子节点移动 ───────────────────────────────────────
      travelToSubLocation: (subId) => {
        set({ currentSubLocationId: subId })
        get()._autoCompleteObjectives({ type: 'visit_location', subLocationId: subId })
      },

      // ── 物品：添加 ─────────────────────────────────────────────────────────
      addItem: (item, qty = 1) => {
        set((s) => {
          const inv = [...s.inventory]
          const idx = inv.findIndex((i) => i.item.id === item.id)
          if (idx !== -1 && item.stackable) {
            inv[idx] = { ...inv[idx], quantity: inv[idx].quantity + qty }
          } else {
            inv.push({ item, quantity: qty })
          }
          return { inventory: inv }
        })
        get()._autoCompleteObjectives({ type: 'have_item', itemId: item.id })
      },

      // ── 物品：移除 ─────────────────────────────────────────────────────────
      removeItem: (itemId, qty = 1) => {
        set((s) => ({
          inventory: s.inventory
            .map((i) =>
              i.item.id === itemId ? { ...i, quantity: i.quantity - qty } : i,
            )
            .filter((i) => i.quantity > 0),
        }))
      },

      // ── 物品：使用消耗品 ────────────────────────────────────────────────────
      useItem: (itemId) => {
        const { inventory, player, battle } = get()
        const entry = inventory.find((i) => i.item.id === itemId)
        if (!entry || entry.item.type !== 'consumable' || !entry.item.effect) return false
        const effect = entry.item.effect

        if (battle.active && battle.playerStats) {
          const ps: Stats = { ...battle.playerStats }
          if (effect.hp) ps.hp = clamp(ps.hp + effect.hp, 0, ps.maxHp)
          if (effect.mp) ps.mp = clamp(ps.mp + effect.mp, 0, ps.maxMp)
          set((s) => ({ battle: { ...s.battle, playerStats: ps } }))
        } else {
          const stats: Stats = { ...player.stats }
          if (effect.hp) stats.hp = clamp(stats.hp + effect.hp, 0, stats.maxHp)
          if (effect.mp) stats.mp = clamp(stats.mp + effect.mp, 0, stats.maxMp)
          set((s) => ({ player: { ...s.player, stats } }))
        }
        get().removeItem(itemId, 1)
        return true
      },

      // ── 装备：穿戴 ─────────────────────────────────────────────────────────
      equipItem: (itemId) => {
        const { inventory, player } = get()
        const entry = inventory.find((i) => i.item.id === itemId)
        if (!entry || entry.item.type !== 'equipment' || !entry.item.equipSlot) return false

        const slot = entry.item.equipSlot
        const newEquipment = { ...player.equipment }

        // 已装备的同槽位物品归还背包
        if (newEquipment[slot]) {
          get().addItem(newEquipment[slot]!)
        }

        newEquipment[slot] = entry.item
        get().removeItem(itemId, 1)

        const newStats = applyEquipmentBonuses(player.baseStats, newEquipment)
        // 保持当前 HP/MP 百分比
        newStats.hp = Math.round((player.stats.hp / player.stats.maxHp) * newStats.maxHp)
        newStats.mp = Math.round((player.stats.mp / player.stats.maxMp) * newStats.maxMp)

        set((s) => ({
          player: { ...s.player, equipment: newEquipment, stats: newStats },
        }))
        return true
      },

      // ── 装备：卸下 ─────────────────────────────────────────────────────────
      unequipItem: (slot) => {
        const { player } = get()
        const item = player.equipment[slot]
        if (!item) return

        const newEquipment = { ...player.equipment }
        delete newEquipment[slot]
        get().addItem(item, 1)

        const newStats = applyEquipmentBonuses(player.baseStats, newEquipment)
        // 按百分比换算，避免 maxHp 下降时 HP 超出上限
        newStats.hp = Math.round((player.stats.hp / player.stats.maxHp) * newStats.maxHp)
        newStats.mp = Math.round((player.stats.mp / player.stats.maxMp) * newStats.maxMp)

        set((s) => ({
          player: { ...s.player, equipment: newEquipment, stats: newStats },
        }))
      },

      // ── 消耗交互点 ──────────────────────────────────────────────────────────
      consumeInteraction: (interactionId) => {
        set((s) => ({
          consumedInteractions: s.consumedInteractions.includes(interactionId)
            ? s.consumedInteractions
            : [...s.consumedInteractions, interactionId],
        }))
      },

      // ── 对话 ────────────────────────────────────────────────────────────────
      openDialogue: (npcId) => {
        set({ activeDialogue: { npcId, nodeId: 'greeting' } })
        // 执行 NPC 数据层声明的 onOpen 动作（数据驱动，无需在此硬编码）
        const npc = NPCS[npcId]
        if (npc?.onOpen) {
          for (const action of npc.onOpen) {
            get().dispatchDialogueAction(action, npcId)
          }
        }
        // 若铁匠任务被激活，立即检查玩家是否已持有矿石
        if (npcId === 'npc_blacksmith') {
          get()._autoCompleteObjectives({ type: 'have_item', itemId: 'mat_iron_ore' })
        }
        get()._autoCompleteObjectives({ type: 'talk_npc', npcId })
      },

      // ── 统一分发对话动作 ────────────────────────────────────────────────────
      dispatchDialogueAction: (action, npcId) => {
        switch (action.type) {
          case 'restoreHpMp':
            get().restoreHpMp()
            break
          case 'openShop':
            get().openShop(npcId)
            break
          case 'openCraft':
            get().openCraft(npcId)
            break
          case 'addItem': {
            const item = ITEMS[action.itemId]
            if (item) get().addItem(item, action.qty ?? 1)
            break
          }
          case 'activateQuest':
            get().activateQuest(action.questId)
            break
          case 'completeObjective': {
            set((s) => ({
              quests: s.quests.map((q) =>
                q.id === action.questId && q.status === 'active'
                  ? {
                      ...q,
                      objectives: q.objectives.map((obj) =>
                        obj.id === action.objectiveId ? { ...obj, completed: true } : obj,
                      ),
                    }
                  : q,
              ),
            }))
            const quest = get().quests.find((q) => q.id === action.questId)
            if (quest?.status === 'active' && quest.objectives.every((obj) => obj.completed)) {
              get().completeQuest(action.questId)
            }
            break
          }
          case 'consumeInteraction':
            get().consumeInteraction(action.interactionId)
            break
          case 'custom':
            // 自定义 key 由外部扩展处理，此处不操作
            break
        }
      },

      advanceDialogue: (nodeId) => {
        set((s) =>
          s.activeDialogue ? { activeDialogue: { ...s.activeDialogue, nodeId } } : s,
        )
      },

      closeDialogue: () => {
        set({ activeDialogue: null })
      },

      // ── 开始战斗（使用有效属性，含装备加成） ────────────────────────────────
      startBattle: (enemy) => {
        const { player } = get()
        const effectiveStats = applyEquipmentBonuses(player.baseStats, player.equipment)
        effectiveStats.hp = player.stats.hp  // 保留当前 HP
        effectiveStats.mp = player.stats.mp
        set({
          battle: {
            active: true,
            phase: 'player_turn',
            enemy,
            playerStats: effectiveStats,
            enemyStats: structuredClone(enemy.stats),
            turnLog: [`与【${enemy.name}】的战斗开始！`],
            round: 1,
            loot: [],
          },
        })
      },

      // ── 执行战斗行动 ────────────────────────────────────────────────────────
      executeBattleAction: (action) => {
        const state = get()
        const { battle, player } = state
        if (!battle.active || battle.phase !== 'player_turn' || !battle.enemy || !battle.enemyStats) return

        let ps: Stats = { ...battle.playerStats }
        let es: Stats = { ...battle.enemyStats }
        const log: string[] = [...battle.turnLog]

        if (action.type === 'attack') {
          const weapon = player.equipment.weapon
          const dmgType = weapon?.damageType ?? 'physical'
          if (dmgType === 'hybrid') {
            const physDmg = calcDamage(ps.atk, es.def, 0.6)
            const magDmg = calcDamage(ps.matk, es.mdef, 0.6)
            const total = physDmg + magDmg
            es = { ...es, hp: Math.max(0, es.hp - total) }
            log.push(`你发动普通攻击（物魔双修），对【${battle.enemy.name}】造成 ${physDmg} 点物理 + ${magDmg} 点魔法伤害，合计 ${total} 点。`)
          } else if (dmgType === 'magical') {
            const dmg = calcDamage(ps.matk, es.mdef)
            es = { ...es, hp: Math.max(0, es.hp - dmg) }
            log.push(`你发动普通攻击（魔法），对【${battle.enemy.name}】造成 ${dmg} 点伤害。`)
          } else {
            const dmg = calcDamage(ps.atk, es.def)
            es = { ...es, hp: Math.max(0, es.hp - dmg) }
            log.push(`你发动普通攻击（物理），对【${battle.enemy.name}】造成 ${dmg} 点伤害。`)
          }
        } else if (action.type === 'skill' && action.skillId) {
          const skill = player.skills.find((sk) => sk.id === action.skillId)
          if (skill && ps.mp >= skill.mpCost) {
            ps = { ...ps, mp: ps.mp - skill.mpCost }
            if (skill.damage) {
              const dmg = skill.isMagical
                ? calcDamage(ps.matk, es.mdef, skill.damage)
                : calcDamage(ps.atk, es.def, skill.damage)
              es = { ...es, hp: Math.max(0, es.hp - dmg) }
              log.push(`你使用【${skill.name}】，对【${battle.enemy.name}】造成 ${dmg} 点伤害。`)
            }
            if (skill.heal && skill.targetSelf) {
              const healAmt = Math.round(ps.maxHp * skill.heal)
              ps = { ...ps, hp: clamp(ps.hp + healAmt, 0, ps.maxHp) }
              log.push(`你使用【${skill.name}】，恢复了 ${healAmt} 点 HP。`)
            }
          } else {
            log.push('MP 不足，无法使用技能！')
          }
        } else if (action.type === 'item' && action.itemId) {
          const used = state.useItem(action.itemId)
          if (used) {
            log.push(`你使用了物品。`)
            ps = { ...get().battle.playerStats! }
          }
        } else if (action.type === 'flee') {
          const fleeChance = 0.6
          if (Math.random() < fleeChance) {
            log.push('你成功逃跑了！')
            set({ battle: { ...battle, playerStats: ps, enemyStats: es, phase: 'flee', turnLog: log } })
            return
          } else {
            log.push('逃跑失败！')
          }
        }

        // 检查敌人死亡
        if (es.hp <= 0) {
          log.push(`【${battle.enemy.name}】被击败了！`)
          state.gainExp(battle.enemy.expReward)
          const gold = battle.enemy.goldReward ?? 0
          if (gold > 0) {
            set((s) => ({ gold: s.gold + gold }))
            log.push(`获得了 ${gold} 金币！`)
          }
          const loot: import('../types').InventoryItem[] = []
          for (const drop of (Array.isArray(battle.enemy.dropTable) ? battle.enemy.dropTable : [])) {
            if (Math.random() < drop.chance) {
              const min = drop.minQty ?? 1
              const max = drop.maxQty ?? 1
              const qty = min === max ? min : min + Math.floor(Math.random() * (max - min + 1))
              state.addItem(drop.item, qty)
              loot.push({ item: drop.item, quantity: qty })
              log.push(`获得了【${drop.item.name}】${qty > 1 ? ` x${qty}` : ''}！`)
            }
          }
          get()._autoCompleteObjectives({ type: 'defeat_enemy', enemyId: battle.enemy.id })
          set({ battle: { ...battle, playerStats: ps, enemyStats: es, phase: 'victory', turnLog: log, loot } })
          return
        }

        // 敌人反击
        const enemySkills = battle.enemy.skills.filter((sk) => es.mp >= sk.mpCost)
        let enemyAction: string
        if (enemySkills.length > 0 && Math.random() < 0.4) {
          const sk = enemySkills[Math.floor(Math.random() * enemySkills.length)]
          const dmg = sk.isMagical
            ? calcDamage(es.matk, ps.mdef, sk.damage ?? 1)
            : calcDamage(es.atk, ps.def, sk.damage ?? 1)
          ps = { ...ps, hp: Math.max(0, ps.hp - dmg) }
          es = { ...es, mp: es.mp - sk.mpCost }
          enemyAction = `【${battle.enemy.name}】使用【${sk.name}】，对你造成 ${dmg} 点伤害。`
        } else {
          const dmg = calcDamage(es.atk, ps.def)
          ps = { ...ps, hp: Math.max(0, ps.hp - dmg) }
          enemyAction = `【${battle.enemy.name}】发动攻击，对你造成 ${dmg} 点伤害。`
        }
        log.push(enemyAction)

        if (ps.hp <= 0) {
          log.push('你被击败了……')
          set({ battle: { ...battle, playerStats: ps, enemyStats: es, phase: 'defeat', turnLog: log } })
          return
        }

        set({
          battle: {
            ...battle,
            playerStats: ps,
            enemyStats: es,
            phase: 'player_turn',
            turnLog: log,
            round: battle.round + 1,
          },
        })
      },

      // ── 战斗结束：将战斗中的 HP/MP 写回玩家，清空战斗状态 ─────────────────
      restoreHpMp: () => {
        const { player, battle } = get()
        if (!player?.stats) return
        const fps = battle.playerStats ?? player.stats
        set({
          player: {
            ...player,
            stats: {
              ...player.stats,
              hp: player.stats.maxHp ?? 100,
              mp: player.stats.maxMp ?? 40,
            },
          },
          battle: {
            active: false,
            phase: 'idle',
            enemy: null,
            playerStats: {
              ...player.stats,
              hp: player.stats.maxHp ?? 100,
              mp: player.stats.maxMp ?? 40,
            },
            enemyStats: null,
            turnLog: [],
            round: 0,
            loot: [],
          },
        })
      },

      // ── 获得经验并升级（能力值驱动，不再硬编码属性成长） ──────────────────
      gainExp: (amount) => {
        set((s) => {
          const player = { ...s.player }
          player.exp += amount
          let leveledUp = false
          while (player.exp >= player.expToNext) {
            player.exp -= player.expToNext
            player.level += 1
            player.expToNext = Math.round(player.expToNext * 1.5)
            player.abilityPoints += 5
            leveledUp = true
          }
          // 重算 baseStats（由 abilities + level + talent 驱动）
          const newBase = calcBaseStats(player.abilities, player.level, player.talent)
          player.baseStats = { ...newBase, hp: player.baseStats.hp, mp: player.baseStats.mp }
          // 重算有效属性（含装备加成）
          const newStats = applyEquipmentBonuses(player.baseStats, player.equipment)
          if (leveledUp) {
            newStats.hp = newStats.maxHp
            newStats.mp = newStats.maxMp
          } else {
            newStats.hp = Math.round((player.stats.hp / player.stats.maxHp) * newStats.maxHp)
            newStats.mp = Math.round((player.stats.mp / player.stats.maxMp) * newStats.maxMp)
          }
          player.stats = newStats
          return { player }
        })
      },

      // ── 任务：激活 ─────────────────────────────────────────────────────────
      activateQuest: (questId) => {
        set((s) => ({
          quests: s.quests.map((q) =>
            q.id === questId && q.status === 'locked' ? { ...q, status: 'active' } : q,
          ),
        }))
      },

      // ── 任务：完成并发放奖励 ────────────────────────────────────────────────
      completeQuest: (questId) => {
        const quest = get().quests.find((q) => q.id === questId)
        if (!quest || quest.status !== 'active') return
        if (!quest.objectives.every((o) => o.completed)) return

        set((s) => ({
          quests: s.quests.map((q) =>
            q.id === questId ? { ...q, status: 'completed' } : q,
          ),
        }))

        // 发放奖励
        if (quest.reward) {
          if (quest.reward.exp) get().gainExp(quest.reward.exp)
          if (quest.reward.gold) set((s) => ({ gold: s.gold + quest.reward!.gold! }))
          if (quest.reward.items) {
            for (const { itemId, qty } of quest.reward.items) {
              const item = ITEMS[itemId]
              if (item) get().addItem(item, qty)
            }
          }
        }
      },

      // ── 内部：自动勾选触发器匹配的目标 ──────────────────────────────────────
      _autoCompleteObjectives: (trigger: ObjectiveTrigger) => {
        set((s) => {
          let changed = false
          const quests = s.quests.map((q) => {
            if (q.status !== 'active') return q
            const objectives = q.objectives.map((obj) => {
              if (obj.completed || !obj.trigger) return obj
              const t = obj.trigger
              let matched = false
              if (t.type === trigger.type) {
                switch (t.type) {
                  case 'have_item':
                    matched =
                      trigger.type === 'have_item' &&
                      t.itemId === trigger.itemId &&
                      s.inventory.some((i) => i.item.id === t.itemId && i.quantity > 0)
                    break
                  case 'defeat_enemy':
                    matched = trigger.type === 'defeat_enemy' && t.enemyId === trigger.enemyId
                    break
                  case 'visit_location':
                    if (trigger.type === 'visit_location') {
                      matched = t.subLocationId !== undefined
                        ? trigger.subLocationId === t.subLocationId
                        : trigger.locationId === t.locationId
                    }
                    break
                  case 'talk_npc':
                    matched = trigger.type === 'talk_npc' && t.npcId === trigger.npcId
                    break
                }
              }
              if (matched) { changed = true; return { ...obj, completed: true } }
              return obj
            })
            return { ...q, objectives }
          })
          return changed ? { quests } : s
        })

        // 检查是否可以自动完成任务
        const { quests, completeQuest } = get()
        for (const q of quests) {
          if (q.status === 'active' && q.objectives.every((o) => o.completed)) {
            completeQuest(q.id)
          }
        }
      },

      // ── 商店：打开 ─────────────────────────────────────────────────────────
      openShop: (npcId) => {
        set({ activeShopNpcId: npcId })
      },

      // ── 商店：关闭 ─────────────────────────────────────────────────────────
      closeShop: () => {
        set({ activeShopNpcId: null })
      },

      // ── 商店：购买 ─────────────────────────────────────────────────────────
      buyItem: (itemId, price) => {
        const { gold } = get()
        if (gold < price) return false
        const item = ITEMS[itemId]
        if (!item) return false
        set((s) => ({ gold: s.gold - price }))
        get().addItem(item, 1)
        return true
      },

      // ── 商店：出售 ─────────────────────────────────────────────────────────
      sellItem: (itemId, price) => {
        const inv = get().inventory
        const slot = inv.find((i) => i.item.id === itemId)
        if (!slot || slot.quantity < 1) return false
        get().removeItem(itemId, 1)
        set((s) => ({ gold: s.gold + price }))
        return true
      },

      // ── 合成：打开 ─────────────────────────────────────────────────────────
      openCraft: (npcId) => {
        set({ activeCraftNpcId: npcId })
      },

      // ── 合成：关闭 ─────────────────────────────────────────────────────────
      closeCraft: () => {
        set({ activeCraftNpcId: null })
      },

      // ── 合成：执行 ─────────────────────────────────────────────────────────
      craftItem: (recipeId) => {
        const recipe = CRAFT_RECIPES.find((r) => r.id === recipeId)
        if (!recipe) return '配方不存在'
        const { gold, inventory, player } = get()
        const level = player.level
        if ((recipe.requiredLevel ?? 1) > level) {
          return `需要达到 LV${recipe.requiredLevel} 才能合成`
        }
        if (gold < recipe.goldCost) {
          return `金币不足（需要 ${recipe.goldCost} G）`
        }
        for (const ing of recipe.ingredients) {
          const slot = inventory.find((i) => i.item.id === ing.itemId)
          const have = slot?.quantity ?? 0
          if (have < ing.qty) {
            const name = slot?.item.name ?? ing.itemId
            return `《${name}》不足（需要 ${ing.qty}，拥有 ${have}）`
          }
        }
        for (const ing of recipe.ingredients) {
          get().removeItem(ing.itemId, ing.qty)
        }
        if (recipe.goldCost > 0) {
          set((s) => ({ gold: s.gold - recipe.goldCost }))
        }
        const resultItem = ITEMS[recipe.resultItemId]
        if (resultItem) get().addItem(resultItem, 1)
        return null
      },

      // ── NPC 位置移动 ─────────────────────────────────────────────────────────
      moveNpc: (npcId, locationId, subLocationId) => {
        set((s) => ({
          npcLocations: {
            ...s.npcLocations,
            [npcId]: { locationId, subLocationId },
          },
        }))
      },

      // ── 复活：传送到村庄并恢复 50% HP/MP ───────────────────────────────────
      respawnAtVillage: () => {
        set((s) => {
          const stats = s.player.stats
          return {
            currentLocationId: 'zone_village',
            currentSubLocationId: LOCATIONS['zone_village'].subMap?.startNodeId ?? null,
            player: {
              ...s.player,
              stats: {
                ...stats,
                hp: Math.max(1, Math.floor(stats.maxHp * 0.5)),
                mp: Math.max(0, Math.floor(stats.maxMp * 0.5)),
              },
            },
          }
        })
      },

      // ── 能力值分配 ──────────────────────────────────────────────────────
      allocateAbility: (key) => {
        set((s) => {
          const player = { ...s.player }
          if (player.abilityPoints <= 0) return s
          player.abilities = { ...player.abilities, [key]: player.abilities[key] + 1 }
          player.abilityPoints -= 1
          // 重算 baseStats
          const newBase = calcBaseStats(player.abilities, player.level, player.talent)
          const oldBase = player.baseStats
          player.baseStats = { ...newBase, hp: player.baseStats.hp, mp: player.baseStats.mp }
          // 重算有效属性（含装备）
          const newStats = applyEquipmentBonuses(player.baseStats, player.equipment)
          // HP/MP 按比例保留，并加上 baseStats maxHp 增量部分
          const maxHpDelta = newBase.maxHp - oldBase.maxHp
          const maxMpDelta = newBase.maxMp - oldBase.maxMp
          newStats.hp = Math.min(newStats.maxHp, player.stats.hp + maxHpDelta)
          newStats.mp = Math.min(newStats.maxMp, player.stats.mp + maxMpDelta)
          player.stats = newStats
          return { player }
        })
      },
    } as GameState & { _autoCompleteObjectives: (t: ObjectiveTrigger) => void }),
    {
      name: 'lore-well-save',
      version: SAVE_VERSION,
      onRehydrateStorage: () => {
        // 水合后校验：若旧存档缺少新字段，自动补全
        return (state, error) => {
          if (error || !state) return
          const p = state.player
          if (p && (!p.abilities || !p.talent || !p.baseStats?.maxHp)) {
            p.abilities = p.abilities ?? { str: 5, agi: 5, int: 5, con: 5 }
            p.talent = p.talent ?? HERO_TALENT
            p.abilityPoints = p.abilityPoints ?? 0
            if (!p.baseStats?.maxHp) {
              const fixed = calcBaseStats(p.abilities, p.level ?? 1, p.talent)
              p.baseStats = { ...fixed, hp: fixed.maxHp, mp: fixed.maxMp }
              p.stats = { ...fixed, hp: fixed.maxHp, mp: fixed.maxMp }
            }
          }
        }
      },
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>
        if (version < 5) {
          // 迁移 inventory item IDs
          if (Array.isArray(state.inventory)) {
            state.inventory = (state.inventory as Array<{ item: { id: string }; quantity: number }>).map((entry) => ({
              ...entry,
              item: { ...entry.item, id: ID_MIGRATION_MAP[entry.item.id] ?? entry.item.id },
            }))
          }
          // 迁移 location IDs
          if (typeof state.currentLocationId === 'string') {
            state.currentLocationId = ID_MIGRATION_MAP[state.currentLocationId as string] ?? state.currentLocationId
          }
          if (typeof state.currentSubLocationId === 'string') {
            state.currentSubLocationId = ID_MIGRATION_MAP[state.currentSubLocationId as string] ?? state.currentSubLocationId
          }
          // 迁移 quest trigger itemIds
          if (Array.isArray(state.quests)) {
            state.quests = (state.quests as Array<Record<string, unknown>>).map((q) => ({
              ...q,
              objectives: (q.objectives as Array<Record<string, unknown>>)?.map((obj) => ({
                ...obj,
                trigger: obj.trigger
                  ? {
                      ...(obj.trigger as Record<string, string>),
                      itemId: ID_MIGRATION_MAP[(obj.trigger as Record<string, string>).itemId] ?? (obj.trigger as Record<string, string>).itemId,
                      npcId: ID_MIGRATION_MAP[(obj.trigger as Record<string, string>).npcId] ?? (obj.trigger as Record<string, string>).npcId,
                      enemyId: ID_MIGRATION_MAP[(obj.trigger as Record<string, string>).enemyId] ?? (obj.trigger as Record<string, string>).enemyId,
                      locationId: ID_MIGRATION_MAP[(obj.trigger as Record<string, string>).locationId] ?? (obj.trigger as Record<string, string>).locationId,
                      subLocationId: ID_MIGRATION_MAP[(obj.trigger as Record<string, string>).subLocationId] ?? (obj.trigger as Record<string, string>).subLocationId,
                    }
                  : obj.trigger,
              }))
            }))
          }
        }
        if (version < 6) {
          // v5→v6：补充 abilities/abilityPoints/talent，去除 spd
          const player = state.player as Record<string, unknown> | undefined
          if (player) {
            // 默认能力值（均衡分配）
            player.abilities = player.abilities ?? { str: 5, agi: 5, int: 5, con: 5 }
            player.abilityPoints = player.abilityPoints ?? 0
            player.talent = player.talent ?? HERO_TALENT
            // 去除 spd（如有）
            if (player.baseStats && typeof player.baseStats === 'object') {
              delete (player.baseStats as Record<string, unknown>).spd
            }
            if (player.stats && typeof player.stats === 'object') {
              delete (player.stats as Record<string, unknown>).spd
            }
          }
          // 同伴也需处理
          const companions = state.companions as Array<Record<string, unknown>> | undefined
          if (Array.isArray(companions)) {
            for (const c of companions) {
              c.abilities = c.abilities ?? { str: 5, agi: 5, int: 5, con: 5 }
              c.abilityPoints = c.abilityPoints ?? 0
              c.talent = c.talent ?? HERO_TALENT
              if (c.baseStats && typeof c.baseStats === 'object') {
                delete (c.baseStats as Record<string, unknown>).spd
              }
              if (c.stats && typeof c.stats === 'object') {
                delete (c.stats as Record<string, unknown>).spd
              }
            }
          }
        }
        return state as unknown as GameState
      },
      partialize: (s) => {
        // 排除战斗状态（战斗中途刷新后应重置），避免持久化的 enemy 对象丢失方法
        const { battle: _battle, ...rest } = s as unknown as Record<string, unknown>
        void _battle
        return rest as unknown as typeof s
      },
    },
  ),
)
