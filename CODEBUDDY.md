# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Build & Dev Commands

- `pnpm dev` — Start dev server at http://localhost:5173
- `pnpm build` — Type-check (`tsc -b`) then production build to `dist/`
- `pnpm lint` — ESLint across the project
- `pnpm preview` — Preview production build locally

No test framework is configured.

## Architecture Overview

Lore Well is a web-based RPG built with **React 19 + Phaser 4 + Zustand 5 + Vite 8 + Tailwind CSS v4**. The game is location-based (no free-roaming): players teleport between major locations and navigate sub-location nodes on a mini-map, interacting with NPCs, picking up items, and entering turn-based combat.

### React-Phaser Split

Phaser handles **visuals only** (backgrounds, combat animations, sound effects). All game logic lives in the Zustand store. The two layers communicate through `GameManager` (`src/game/GameManager.ts`), a singleton facade:

- **React → Phaser**: imperative API (`changeLocation`, `enterCombat`, `playPlayerAttack`, etc.)
- **Phaser → React**: callback functions passed to animation methods, fired on completion
- **Scene readiness**: `onceLocationReady(cb)` uses Phaser's `step` event instead of polling

Phaser scenes: `PreloadScene` (asset loading), `LocationScene` (background rendering), `CombatScene` (battle animations). The `MainMenuScreen` creates its own separate Phaser instance.

### Zustand Store (`src/store/gameStore.ts`)

Single store with `persist` middleware (key: `lore-well-save`, current version **v5**). Key state:

- `player` — Character with dual-attribute system: `baseStats` (raw) + `stats` (with equipment bonuses applied via `applyEquipmentBonuses()`)
- `companions` — Party members (reserved, currently empty array)
- `inventory` / `gold` — Items and currency
- `currentLocationId` / `currentSubLocationId` — Player position
- `quests` — All quests with auto-completion via `_autoCompleteObjectives(trigger)`
- `activeDialogue` — `{npcId, nodeId}` tracking current conversation
- `battle` — **Excluded from persistence** (resets on page refresh)
- `npcLocations` — Runtime NPC position map (mutable via `moveNpc`)

Key architectural patterns in the store:

- **`dispatchDialogueAction`**: Central dispatcher for all dialogue-triggered side effects (heal, open shop, give items, activate quests, etc.). Dialogue actions are declarative data, not hardcoded logic.
- **`_autoCompleteObjectives(trigger)`**: Called after key operations, matches four trigger types (`have_item`, `defeat_enemy`, `visit_location`, `talk_npc`) to auto-complete quest objectives.
- **Save migration**: `migrate` function handles ID namespace changes (e.g., `health_potion` → `cons_health_potion`) with `ID_MIGRATION_MAP`.

### Data Organization (`src/data/`)

All game content is pure static data organized by domain, linked by **string IDs** with a consistent prefix convention:

| Prefix | Domain | Example |
|--------|--------|---------|
| `zone_` | Major location | `zone_village`, `zone_forest` |
| `space_` | Sub-location | `space_village_center`, `space_mine_pit` |
| `npc_` | NPC | `npc_elder`, `npc_lina` |
| `mob_` | Enemy | `mob_slime`, `mob_goblin_mage` |
| `cons_` | Consumable | `cons_health_potion` |
| `equip_` | Equipment | `equip_iron_sword` |
| `mat_` | Material | `mat_iron_ore` |
| `qitem_` | Quest item | `qitem_ancient_key` |
| `point_` | Scenery interaction | `point_village_well` |
| `skill_` | Skill | `skill_slash` |
| `recipe_` | Craft recipe | `recipe_hunters_blade` |

Data files use index aggregators: `locations/index.ts`, `items/index.ts`, `quests/index.ts`, `dialogues/index.ts`, etc.

**Data linkage pattern**: Nearly all cross-references use string IDs (looked up at runtime via `Record<id, data>`). The exception is `Enemy.dropTable[].item` which directly references `Item` objects.

### Dialogue System

NPCs are defined in `src/data/dialogues/` (one file per NPC group). Each NPC has a `dialogues[]` array of `DialogueNode` with branching `options[]`. Key features:

- **DialogueAction**: Declarative union type (`restoreHpMp | openShop | openCraft | addItem | activateQuest | completeObjective | consumeInteraction | custom`). The `dispatchDialogueAction` handler processes all types.
- **DialogueCondition**: Supports `hasItem`, `questStatus`, and logical combinators (`not`, `and`, `or`) for conditional option visibility.
- **NPC `onOpen[]`**: Array of actions fired when dialogue starts, replacing hardcoded if-else logic.

### Type System (`src/types/index.ts`)

Core type hierarchy: `Stats` → `Character`/`Enemy`; `Item` → `InventoryItem`; `DialogueNode` → `DialogueOption` with `DialogueAction`/`DialogueCondition`; `Location` → `SubLocation` with `Interaction`; `Quest` → `QuestObjective` with `ObjectiveTrigger`.

### Adding Content

- **New location**: Add to `src/data/locations/`, register background key in `PreloadScene`
- **New NPC**: Add dialogue file in `src/data/dialogues/`, export from `index.ts`, add interaction entry in the target location
- **New item/enemy/quest/shop**: Add to respective data file; quests auto-trigger via objective triggers
- **New dialogue action type**: Add to `DialogueAction` union in `types/`, add handler case in `dispatchDialogueAction` in `gameStore.ts`

### UI Component Structure

```
App (Routes)
 ├── "/" → MainMenuScreen (own Phaser instance)
 └── "/game" → GameScreen
      ├── Phaser canvas (backgrounds/animations via GameManager)
      ├── HUD (top bar: HP/MP/EXP/gold/level)
      ├── Exploration mode: MiniMap + LocationPanel + DialogBox + floating panels (InventoryPanel/QuestLog/ShopPanel/CraftPanel)
      ├── Combat mode: CombatPanel (full-screen)
      └── PauseMenu (Escape)
```

Panels are mutually exclusive and close with Escape. Keyboard shortcuts: B (inventory), Q (quests), C (equipment), M (map), Esc (pause/close).

### Combat Mechanics

- Damage: `max(1, atk - def) * multiplier * random(0.8, 1.2)`
- Flee chance: `clamp(0.5 + (playerSpd - enemySpd) * 0.02, 0.1, 0.9)`
- Level-up: `expToNext *= 1.5`; baseStats per level: +20 HP, +8 MP, +3 ATK, +2 DEF, +1 SPD; full HP/MP restore on level-up
- Death: teleport to village, HP/MP to 50%, keep items
