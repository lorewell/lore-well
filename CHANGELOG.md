# CHANGELOG

项目变更记录。每次功能性修改后更新此文件。

---

## [0.3.0] — Phase 7：装备系统 + 任务系统

### 改动说明
新增装备穿脱逻辑、任务自动触发机制、背包 UI 面板、任务日志面板，并修复战斗属性计算。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/types/index.ts` | 新增 | 添加 `ObjectiveTrigger`、`QuestObjective`、`QuestReward`、`Quest`、`QuestStatus` 类型；`Character` 接口增加 `baseStats: Stats` 字段 |
| `src/data/characters.ts` | 修改 | `PLAYER_TEMPLATE` 补充 `baseStats`（LV1 与 `stats` 相同） |
| `src/data/quests.ts` | 新增 | 初始 3 个任务（长老委托/森林威胁/补给短缺），每个目标含自动触发器 |
| `src/store/gameStore.ts` | 重写 | ① 导出 `applyEquipmentBonuses(baseStats, equip)` 纯函数；② 新增 `equipItem` / `unequipItem` 动作；③ 新增 `quests` 状态及 `activateQuest` / `completeQuest` 动作；④ 新增内部 `_autoCompleteObjectives(trigger)` 自动勾选逻辑，在 `addItem`/`travelTo`/`openDialogue`/`executeBattleAction` 胜利时自动触发；⑤ 修复 `gainExp` 升级时同步更新 `baseStats` 并重算 `stats`；⑥ 存档版本升至 2 |
| `src/components/InventoryPanel.tsx` | 新增 | 全屏遮罩面板：左侧装备槽 + 有效属性展示；右侧物品列表含使用/装备按钮、点击展开详情+属性加成 |
| `src/components/QuestLog.tsx` | 新增 | 全屏遮罩面板：按进行中/已完成/未解锁分组展示任务卡片，目标勾选动效 |
| `src/screens/GameScreen.tsx` | 修改 | 新增 `activePanel` 状态；添加右侧工具栏（包/任）；支持 `B`/`Q`/`Esc` 键盘快捷键；战斗中隐藏工具栏 |
| `README.md` | 修改 | 更新已实现功能清单，添加 Phase 7 条目 |

### 设计约定（本次建立）
- **双属性字段**：`character.baseStats` = 纯基础值（升级时修改）；`character.stats` = 始终等于 `applyEquipmentBonuses(baseStats, equipment)`，装备/升级时重算
- **任务自动触发**：在 `QuestObjective.trigger` 中声明触发条件，store 内各动作调用 `_autoCompleteObjectives` 即可自动完成；目标全部完成后自动调用 `completeQuest` 发放奖励
- **面板扩展**：新面板只需在 `GameScreen` 的 `ActivePanel` 联合类型中添加一个值，再加一个工具栏按钮和条件渲染

---

## [0.2.0] — 2026-04-29

### 改动说明
简化所有 Phaser 场景，移除过度设计的动画/粒子效果，聚焦基础逻辑可运行性，保留清晰的扩展接口。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/game/scenes/LocationScene.ts` | 简化 | 移除粒子系统（`ambientParticles`）和 80 次循环暗角绘制，修复未使用变量 TS 错误；保留 `changeLocation()` API |
| `src/game/scenes/CombatScene.ts` | 简化 | 移除复杂攻击/受击动画序列；用 `Rectangle` 占位替代精灵图；所有 `play*` 动效方法保留为 stub，带 `TODO` 注释 |
| `src/game/scenes/MainMenuScene.ts` | 简化 | 移除粒子星空和流动光线，保留静态渐变背景；预留 `TODO` 扩展点 |
| `src/game/scenes/PreloadScene.ts` | 修复+简化 | 修复 `load.complete` 在无实际加载任务时不触发的 bug（改为在 `create()` 中调用 `scene.start`）；简化占位纹理生成（纯色填充替代渐变+随机线条） |
| `src/screens/MainMenuScreen.tsx` | 修复 | 移除未使用的 `playerName` state，消除 TS `noUnusedLocals` 错误 |
| `src/components/HUD.tsx` | 修复 | 将 `min-w-[180px]` 改为 `min-w-45`，消除 Tailwind v4 任意值警告 |

### 扩展约定（本次建立）
- `CombatScene` 所有 `play*` 方法：填充动画后只需在方法体内实现，对外接口不变
- `PreloadScene.createPlaceholderTextures()`：资源就绪后整体删除，在 `preload()` 添加 `this.load.image()` 即可

---

## [0.1.0] — 2026-04-29

### 改动说明
从 Vite 默认脚手架出发，完成 Phase 1（基础建设）+ Phase 2（主菜单）+ Phase 3（地点系统）+ Phase 4（人物/NPC）+ Phase 5（物品）+ Phase 6（战斗）的初始实现。

### 新增文件

| 文件 | 说明 |
|---|---|
| `src/types/index.ts` | 全局 TS 类型定义：`Stats`、`Item`、`InventoryItem`、`Skill`、`Character`、`Enemy`、`NPC`、`DialogueNode`、`Interaction`、`Location`、`BattleState`、`SaveData` 等 |
| `src/data/characters.ts` | 玩家角色初始模板 `PLAYER_TEMPLATE`（LV1，含 2 个技能） |
| `src/data/enemies.ts` | 3 种敌人：史莱姆 / 哥布林 / 森林狼（含属性、技能、掉落表） |
| `src/data/items.ts` | 5 种物品：生命药水 / 魔法药水 / 铁剑 / 皮甲 / 古代钥匙 |
| `src/data/locations.ts` | 4 个地点：晨曦村 / 幽暗森林 / 森林深处 / 古代神殿遗迹 |
| `src/data/npcs.ts` | 3 个 NPC：老板娘玛格 / 铁匠托尔 / 长老艾尔文（含分支对话树） |
| `src/store/gameStore.ts` | Zustand store，包含：`startNewGame`、`travelTo`、`addItem`、`removeItem`、`useItem`、`openDialogue`、`advanceDialogue`、`startBattle`、`executeBattleAction`、`restoreHpMp`、`gainExp` 等 action；localStorage 持久化含 `Set` 序列化兼容 |
| `src/game/GameManager.ts` | Phaser 实例单例管理；暴露 `init`、`destroy`、`changeLocation`、`enterCombat`、`exitCombat`、`playPlayerAttack`、`playEnemyHit`、`playVictory`、`playDefeat` 接口 |
| `src/game/scenes/PreloadScene.ts` | 预加载场景，生成占位纹理后跳转 `LocationScene` |
| `src/game/scenes/LocationScene.ts` | 地点背景展示，`changeLocation(bgKey)` 切换带过渡 |
| `src/game/scenes/CombatScene.ts` | 战斗背景场景，含双方占位显示和动效 stub |
| `src/game/scenes/MainMenuScene.ts` | 主菜单背景场景 |
| `src/screens/MainMenuScreen.tsx` | 主菜单页：新游戏（含角色名输入）/ 继续冒险 / 设置占位 |
| `src/screens/GameScreen.tsx` | 游戏主屏：初始化 Phaser、监听地点变化、切换战斗/地点视图 |
| `src/components/HUD.tsx` | 顶部 HUD：角色名、LV、HP/MP/EXP 进度条、金币 |
| `src/components/LocationPanel.tsx` | 底部地点面板：交互列表（NPC/物品/建筑/敌人）+ 出口按钮 |
| `src/components/DialogBox.tsx` | 对话框：NPC 名称、文本、分支选项、ESC 关闭、客栈休息特殊处理 |
| `src/components/CombatPanel.tsx` | 战斗面板：双方状态、回合日志、行动按钮（攻击/技能/物品/逃跑）、结算 |

### 修改文件

| 文件 | 改动说明 |
|---|---|
| `package.json` | 新增依赖：`phaser`、`zustand`；新增 devDependency：`tailwindcss`、`@tailwindcss/vite` |
| `vite.config.ts` | 引入 `@tailwindcss/vite` 插件 |
| `src/index.css` | 全量替换为游戏全局样式（`@import "tailwindcss"`、`html/body/#root` 铺满、深色背景） |
| `src/App.tsx` | 全量替换为路由出口（`/` → `MainMenuScreen`，`/game` → `GameScreen`） |
| `src/main.tsx` | 包裹 `BrowserRouter` |
| `README.md` | 重写为项目实际文档 |

### 删除文件

| 文件 | 原因 |
|---|---|
| `src/App.css` | 已被 Tailwind 替代，Vite 默认模板样式不再需要 |
