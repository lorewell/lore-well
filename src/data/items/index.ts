import { CONSUMABLES } from './consumables'
import { EQUIPMENT } from './equipment'
import { MATERIALS } from './materials'
import { QUEST_ITEMS } from './quest_items'
import type { Item } from '../../types'

export const ITEMS: Record<string, Item> = {
  ...CONSUMABLES,
  ...EQUIPMENT,
  ...MATERIALS,
  ...QUEST_ITEMS,
}

export { CONSUMABLES, EQUIPMENT, MATERIALS, QUEST_ITEMS }
export { CRAFT_RECIPES } from './recipes'
