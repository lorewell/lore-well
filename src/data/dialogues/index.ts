/**
 * data/dialogues/index.ts
 *
 * 所有 NPC / 场景对话的统一导出入口。
 * 新增或修改角色只需编辑对应文件，此处按需追加一行导入即可。
 */

import type { NPC } from '../../types'

// ── 角色 NPC ──────────────────────────────────────────────────────────────
export { linaPrologueNPC, linaNPC } from './lina'
export { innkeeperNPC } from './innkeeper'
export { elderNPC } from './elder'
export { villageChiefNPC } from './village_chief'
export { blacksmithNPC } from './blacksmith'
export { grocerNPC } from './grocer'
export {
  waterfallNPC,
  waterfallPoolNPC,
  waterfallRingEventNPC,
} from './waterfall'
export {
  villageWellNPC,
  villageNoticeBoardNPC,
  elderBookshelfNPC,
  chiefMapNPC,
  innHearthNPC,
  smithAnvilNPC,
  grocerHerbsNPC,
  southSignpostNPC,
  outskirtsFenceNPC,
} from './scenery'

// ── 聚合为 Record（保持与旧 NPCS 相同的访问方式）─────────────────────────

import { linaPrologueNPC, linaNPC } from './lina'
import { innkeeperNPC } from './innkeeper'
import { elderNPC } from './elder'
import { villageChiefNPC } from './village_chief'
import { blacksmithNPC } from './blacksmith'
import { grocerNPC } from './grocer'
import {
  waterfallNPC,
  waterfallPoolNPC,
  waterfallRingEventNPC,
} from './waterfall'
import {
  villageWellNPC,
  villageNoticeBoardNPC,
  elderBookshelfNPC,
  chiefMapNPC,
  innHearthNPC,
  smithAnvilNPC,
  grocerHerbsNPC,
  southSignpostNPC,
  outskirtsFenceNPC,
} from './scenery'

const ALL_NPCS: NPC[] = [
  linaPrologueNPC,
  linaNPC,
  innkeeperNPC,
  elderNPC,
  villageChiefNPC,
  blacksmithNPC,
  grocerNPC,
  waterfallNPC,
  waterfallPoolNPC,
  waterfallRingEventNPC,
  villageWellNPC,
  villageNoticeBoardNPC,
  elderBookshelfNPC,
  chiefMapNPC,
  innHearthNPC,
  smithAnvilNPC,
  grocerHerbsNPC,
  southSignpostNPC,
  outskirtsFenceNPC,
]

export const NPCS: Record<string, NPC> = Object.fromEntries(
  ALL_NPCS.map((npc) => [npc.id, npc]),
)
