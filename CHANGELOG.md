# CHANGELOG

项目变更记录。每次功能性修改后更新此文件。

---

## [0.8.0] — CI/CD：GitHub Actions + Docker 自动部署

### 改动说明
新增完整的持续集成/持续部署流水线：在 GitHub Actions 中构建 Docker 镜像并推送至 GHCR，再通过 SSH 自动部署到服务器。

### 新增文件

| 文件 | 说明 |
|---|---|
| `Dockerfile` | 多阶段构建：`node:22-alpine` 运行 `pnpm build`，产物由 `nginx:1.27-alpine` 静态托管 |
| `nginx.conf` | SPA 路由回落（`try_files $uri /index.html`）；hash 文件名资源设置 1 年强缓存；禁止访问隐藏文件 |
| `.dockerignore` | 排除 `node_modules/`、`dist/`、`.git/` 等无关文件，减小构建上下文 |
| `.github/workflows/deploy.yml` | 两阶段 workflow：① `build-and-push`：buildx 多平台构建 + 推送 GHCR（利用 GHA 缓存加速）；② `deploy`：`appleboy/ssh-action` 登录服务器、拉取新镜像、重启容器、清理悬空镜像 |

### 设计约定（本次建立）
- **镜像仓库**：GitHub Container Registry（`ghcr.io`），使用 `GITHUB_TOKEN` 推送，无需额外费用
- **镜像标签**：`latest`（main 分支）+ `sha-<短 hash>`（每次构建唯一标识，便于回滚）
- **服务器 Secrets**：`DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_SSH_KEY` / `DEPLOY_PORT` / `APP_PORT` / `GHCR_USER` / `GHCR_TOKEN`
- **触发条件**：push 到 `main` 或手动 `workflow_dispatch`

---

## [0.7.0] — 移动端适配 + 底栏间距优化

### 改动说明
解决底部 HUD 面板内容贴边问题，补充 iOS 安全区支持，方向键改为更大的触摸目标，左栏宽度改为响应式。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `index.html` | 修改 | `viewport` 补加 `viewport-fit=cover`，解锁 `env(safe-area-inset-*)` iOS 安全区 API |
| `src/index.css` | 修改 | 高度改用 `100dvh`（动态视口高度），修复移动端地址栏收起后内容被截断的问题 |
| `src/components/LocationPanel.tsx` | 修改 | ① 外层渐变截止点从 55% 提高到 68%；② 主内容行底部 padding 改为 `max(16px, env(safe-area-inset-bottom))`；③ 左栏宽度从固定 `160px` 改为 `clamp(130px, 22vw, 168px)`；④ 上下内边距从仅底部 `pb-5` 改为对称 `pt-3 pb-3`；⑤ 方向键尺寸从 `h-6 w-6`（24px）增大至 `h-8 w-8`（32px）提升触摸可用性；⑥ 兼容模式底部 padding 改为 `max(20px, env(safe-area-inset-bottom))` |

### 设计约定（本次建立）
- **安全区 padding 公式**：`max(固定最小值, env(safe-area-inset-bottom))`，在非刘海屏上退化为固定值，在 iPhone 上自动扩展
- **移动端触摸目标**：按钮最小尺寸保持 32×32 px（iOS HIG 推荐 44pt，此处为游戏风格取折中）

---

## [0.6.0] — Phase 10：双层地图系统 + HUD 重设计

### 改动说明
将所有大地点拆分为含多个子节点的内部子地图，玩家在大地图间传送后，在小地图内通过方向键或节点点击自由移动。底部 HUD 重构为三栏布局（小地图 | 地点信息 | 菜单切换），新增状态面板。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/types/index.ts` | 新增 | 新增 `SubLocation` 接口（`id/name/description/interactions/north/south/east/west/exits`）；`Location` 接口新增可选 `subMap: { nodes: Record<string, SubLocation>; startNodeId: string }` 字段 |
| `src/data/locations.ts` | 重写 | 五个大地点（village/forest/forest_depths/temple_ruins/mine_cave）全部拆分为子地图节点；父级 `exits` 和 `interactions` 置空（兼容字段）；世界地图传送入口改为子节点的 `exits` 属性 |
| `src/store/gameStore.ts` | 修改 | 新增 `currentSubLocationId: string \| null` 状态；新增 `travelToSubLocation(subId)` 动作；`travelTo` 进入新大地点时自动设置 `startNodeId`；`respawnAtVillage` 同步重置子地点；SAVE_VERSION 升至 3 |
| `src/components/LocationPanel.tsx` | 重写 | 三栏布局：左栏（BFS 可视化节点网格 + 方向键盘）、中栏（子地点名/描述/交互按钮/世界出口）、右栏（菜单切换按钮）；BFS 算法从 `startNodeId` 出发自动计算所有节点的 `(col, row)` 坐标；当前节点高亮；新增兼容模式（无 subMap 地点的旧式渲染）；新增 `onOpenPanel` 回调 prop |
| `src/screens/GameScreen.tsx` | 修改 | 新增内联 `StatusPanel` 组件（属性/装备总览）；`ActivePanel` 联合类型增加 `'status'`；移除旧版右侧工具栏；`LocationPanel` 传入 `onOpenPanel` 回调；键盘快捷键 `B/Q/C` 分别打开背包/任务/状态 |

### 子地图节点结构（`village` 示例）

```
village_north（瀑布）
       ↑
village_west ← village_center → village_east
（客栈/村长）      ↓         （铁匠/杂货）
             village_south
           （→ 森林/遗迹/矿洞）
```

### 设计约定（本次建立）
- **BFS 坐标分配**：以 `startNodeId` 为原点 `(0,0)`，按 N/S/E/W 方向递归分配整数格坐标，SVG 绘制东/南方向连接线
- **世界传送入口**：子节点的 `exits` 字段列出可前往的大地点 ID，点击后调用 `travelTo` + `GameManager.changeLocation`
- **兼容模式**：无 `subMap` 的地点继续使用旧式 `location.interactions` + `location.exits` 渲染，不影响现有数据

---

## [0.5.0] — Phase 9：商店出售 + 战斗失败处理 + 代码修复

### 改动说明
完善商店系统（加入出售功能）、实现战斗失败重生机制、优化战斗 UI 信息展示，修复预存 lint 错误。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/store/gameStore.ts` | 修改 | 新增 `sellItem(itemId, price): boolean` 动作；新增 `respawnAtVillage()` 动作（传送至村庄，HP/MP 恢复 50%） |
| `src/components/ShopPanel.tsx` | 重写 | 加入买/卖切换 Tab；出售模式展示背包中所有非任务物品及出售价格（优先用商品条目价格 × 40%，否则按类型兜底）；支持 Esc 关闭 |
| `src/components/CombatPanel.tsx` | 修改 | 引入 `respawnAtVillage`；战斗失败显示专用结算界面（说明传送后果 + "重回晨曦村"按钮）；胜利/逃跑走原流程；状态栏新增 ATK/DEF 展示 |
| `src/components/QuestLog.tsx` | 修复 | 移除未使用的 `React` 导入和 `allDone` 变量 |
| `src/components/InventoryPanel.tsx` | 修复 | 移除未使用的 `React` 导入；将 `useItem` 重命名为 `consumeItem` 以避免 React Hook 命名规则误报 |
| `README.md` | 重写 | 更新已实现功能列表至最新状态；更新项目结构；清理残留 eslint 代码片段 |

### 设计约定（本次建立）
- **出售价格**：在 ShopEntry 中可定义 `sellPrice`；若未设置，默认为 `floor(price × 0.4)`；非本店物品按类型兜底（装备 12G / 消耗品 8G / 杂项 3G）
- **战斗失败行为**：玩家 HP/MP 恢复至 50%（不满血，以示惩罚），传送至晨曦村，装备与道具完整保留
- **respawnAtVillage**：直接修改 `currentLocationId` + `player.stats.hp/mp`，无需额外动画或确认

---

## [0.4.0] — Phase 8：商店系统 + 内容扩充 + UI 完善

### 改动说明
新增商店购买系统、暂停菜单、主菜单存档预览；大幅扩充物品、敌人、地点和任务内容。

### 修改文件

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/types/index.ts` | 新增 | 添加 `ShopEntry`、`Shop` 类型 |
| `src/data/items.ts` | 扩充 | 新增 8 件物品：elixir、steel_sword、magic_staff、chain_mail、swift_ring、vitality_amulet、iron_ore、goblin_emblem，共 13 件 |
| `src/data/enemies.ts` | 扩充 | 新增 3 种敌人：cave_spider（毒牙）、goblin_mage（火焰箭）、stone_golem（重锤）；goblin 新增 goblin_emblem 掉落 |
| `src/data/shops.ts` | 新增 | 铁匠铺（7 件装备）和客栈小卖部（3 件消耗品）定义；导出 `getShopByNpc` 辅助函数 |
| `src/data/locations.ts` | 扩充 | 新增 `mine_cave` 地点；village 新增矿洞出口；temple_ruins 新增哥布林法师；forest_depths 新增石像鬼；npc 类型交互已替换 building 类型以正确触发对话 |
| `src/data/npcs.ts` | 修改 | 铁匠托尔加入"查看商品"对话选项；客栈玛格加入"购买物资"选项和新闻节点 |
| `src/data/quests.ts` | 扩充 | 新增 `quest_blacksmith`（铁匠委托）：收集铁矿石 → 回报铁匠，奖励 steel_sword |
| `src/store/gameStore.ts` | 修改 | 新增 `activeShopNpcId` 状态；新增 `openShop` / `closeShop` / `buyItem` 动作；`openDialogue` 在铁匠首谈时自动激活铁匠任务 |
| `src/components/ShopPanel.tsx` | 新增 | 商店全屏面板：列出商品（装备蓝色/消耗品绿色）、价格、属性加成；金币不足时禁用购买按钮 |
| `src/components/PauseMenu.tsx` | 新增 | 暂停全屏菜单：继续游戏 / 返回主菜单（含确认对话框）；显示自动存档提示 |
| `src/components/DialogBox.tsx` | 修改 | 对话节点 next='shop' 时触发 `openShop` 并关闭对话框 |
| `src/screens/GameScreen.tsx` | 修改 | 新增 `paused` 状态；渲染 PauseMenu 和 ShopPanel；顶部 "≡ MENU" 按钮 |
| `src/screens/MainMenuScreen.tsx` | 修改 | 存档预览：显示角色名、等级、所在地点 |
| `src/game/scenes/PreloadScene.ts` | 修改 | 新增 `bg_mine` 占位纹理 |
| `README.md` | 修改 | 更新已实现功能清单，版本升至 v0.4.0 |

### 设计约定（本次建立）
- **商店触发流程**：对话节点 `next='shop'` → `DialogBox` 调用 `openShop(npcId)` → store 记录 `activeShopNpcId` → `GameScreen` 渲染 `ShopPanel` → 关闭时 `closeShop()` 清空
- **buyItem 签名**：`buyItem(itemId, price): boolean`，price 直接从 ShopEntry 传入，避免 store 重复查找商店结构
- **任务激活时机**：首次与 NPC 对话时在 `openDialogue` 中调用 `activateQuest`，保持与已有长老任务一致

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
