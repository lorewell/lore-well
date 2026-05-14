import type { Quest } from '../../types'
import { MAIN_QUESTS } from './main_quests'
import { SIDE_QUESTS } from './side_quests'

export const INITIAL_QUESTS: Quest[] = [...MAIN_QUESTS, ...SIDE_QUESTS]

export { MAIN_QUESTS, SIDE_QUESTS }
