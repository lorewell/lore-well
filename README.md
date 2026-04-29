# Lore Well

一款基于 **React + Vite + Phaser** 的网页 RPG 冒险游戏（开发中）。

> 游戏类型：无行走、地点切换式回合制 RPG。玩家在不同地点间切换，与 NPC 对话、拾取物品、触发回合制战斗。

---

## 技术栈

| 技术 | 用途 |
|---|---|
| React 19 + TypeScript | 页面框架、路由、所有 UI 组件 |
| Vite 8 | 构建工具 |
| Phaser 4 | 页面内容渲染（背景、战斗场景） |
| Zustand 5 | 全局游戏状态管理 + localStorage 持久化 |
| React Router v7 | 页面路由（主菜单 ↔ 游戏主屏） |
| Tailwind CSS v4 | UI 样式 |

---

## 已实现功能

### 核心框架
- [x] 项目基础骨架（路由、样式、目录结构）
- [x] Phaser 与 React 的分层架构（React 负责 UI，Phaser 负责场景渲染）
- [x] `GameManager` 单例——管理 Phaser 实例生命周期，向 React 暴露操作接口
- [x] Zustand `gameStore`——统一管理玩家状态、背包、地点、战斗、对话
- [x] localStorage 存档持久化（自动序列化/反序列化，含 `Set` 类型兼容处理）

### 主菜单
- [x] 主菜单页面（新游戏 / 继续冒险 / 设置占位）
- [x] 新游戏时输入角色名（默认"旅行者"，最多 12 字）
- [x] Phaser 渐变背景（可扩展为粒子星空等动态效果）

### 地点系统
- [x] 4 个初始地点：晨曦村 / 幽暗森林 / 森林深处 / 古代神殿遗迹
- [x] 地点数据结构（`id`、名称、描述、背景资源 key、出口列表、交互列表）
- [x] Phaser `LocationScene`——背景图展示 + 淡入淡出切换
- [x] `LocationPanel`——底部交互列表，支持 4 种交互类型（NPC / 物品 / 建筑 / 敌人）
- [x] 地点出口按钮，点击切换地点并通知 Phaser 更新背景
- [x] 物品拾取后标记为"已消耗"，不可重复拾取

### 人物 / NPC 系统
- [x] 玩家角色数据（HP / MP / ATK / DEF / SPD / LV / EXP）
- [x] 3 个初始 NPC（老板娘玛格 / 铁匠托尔 / 长老艾尔文）
- [x] 分支对话树（每个 NPC 有多个对话节点，支持选项跳转）
- [x] `DialogBox`——对话框组件（NPC 名称 / 文本 / 选项按钮 / ESC 关闭）
- [x] 客栈"休息"功能（通过对话触发 HP/MP 全额恢复）
- [x] HUD——顶部状态栏（角色名 / LV / HP 条 / MP 条 / EXP 条 / 金币）

### 物品系统
- [x] 13 种物品（消耗品 3 / 装备 7 / 任务物品 2 / 杂项 1）
- [x] 物品类型：消耗品 / 装备 / 任务物品 / 杂项
- [x] 背包（Zustand 管理，支持堆叠）
- [x] 战斗中使用消耗品

### 战斗系统
- [x] 回合制战斗逻辑（玩家行动 → 敌人反击）
- [x] 6 种敌人（史莱姆 / 哥布林 / 森林狼 / 洞穴蜘蛛 / 哥布林法师 / 石像鬼）
- [x] 行动类型：普通攻击 / 技能（消耗 MP）/ 使用物品 / 逃跑
- [x] 伤害计算（基础公式 + ±20% 随机浮动）
- [x] 战斗结算：获得经验值、升级（属性自动成长）、掉落物品
- [x] 战斗失败处理：传送至晨曦村，HP/MP 恢复 50%，装备道具保留
- [x] `CombatPanel`——战斗 UI（双方 HP/ATK/DEF 展示 / 行动按钮 / 回合日志）
- [x] Phaser `CombatScene`——战斗背景 + 双方占位矩形展示

### 装备 & 任务系统（Phase 7）
- [x] 装备穿脱（武器 / 护甲 / 饰品）+ 属性自动重算
- [x] 任务自动触发（击败敌人 / 拥有物品 / 访问地点 / 对话 NPC）
- [x] `InventoryPanel`——背包面板（装备槽 + 物品列表 + 详情）
- [x] `QuestLog`——任务日志（进行中 / 已完成 / 锁定分组）

### 商店 & UI 完善（Phase 8 + 9）
- [x] 主菜单存档预览（角色名 / LV / 当前地点）
- [x] 暂停菜单（Esc 打开，含返回主菜单确认）
- [x] 商店系统：购买 + 出售（支持 Esc 关闭）
- [x] 5 个地点（晨曦村 / 幽暗森林 / 森林深处 / 古代神殿遗迹 / 废弃矿洞）
- [x] 4 个任务（长老委托 / 森林威胁 / 补给短缺 / 铁匠委托）

---

## 项目结构

```
src/
├── App.tsx                    # 路由出口
├── main.tsx                   # 应用入口，挂载 BrowserRouter
├── index.css                  # 全局样式 + Tailwind 导入
│
├── types/
│   └── index.ts               # 全局 TS 类型定义
│
├── data/                      # 静态游戏数据
│   ├── characters.ts          # 玩家角色初始模板
│   ├── enemies.ts             # 敌人定义（6 种）
│   ├── items.ts               # 物品定义（13 种）
│   ├── locations.ts           # 地点定义（5 个）
│   ├── npcs.ts                # NPC 定义（3 个，含分支对话树）
│   ├── quests.ts              # 任务定义（4 个）
│   └── shops.ts               # 商店定义（铁匠铺 + 客栈小卖部）
│
├── store/
│   └── gameStore.ts           # Zustand store（全游戏逻辑）
│
├── game/                      # Phaser 相关
│   ├── GameManager.ts         # Phaser 实例单例 + React 调用接口
│   └── scenes/
│       ├── PreloadScene.ts    # 资源预加载（生成占位纹理）
│       ├── LocationScene.ts   # 地点背景渲染 + 切换
│       ├── CombatScene.ts     # 战斗背景 + 角色占位展示
│       └── MainMenuScene.ts   # 主菜单背景
│
├── screens/                   # 页面级组件
│   ├── MainMenuScreen.tsx     # 主菜单（含存档预览）
│   └── GameScreen.tsx         # 游戏主屏（整合所有面板）
│
└── components/                # 复用 UI 组件
    ├── HUD.tsx                # 顶部角色状态栏
    ├── LocationPanel.tsx      # 底部地点交互列表 + 出口
    ├── DialogBox.tsx          # NPC 对话框
    ├── CombatPanel.tsx        # 回合制战斗 UI
    ├── InventoryPanel.tsx     # 背包面板
    ├── QuestLog.tsx           # 任务日志
    ├── ShopPanel.tsx          # 商店面板（购买 + 出售）
    └── PauseMenu.tsx          # 暂停菜单
```

---

## 开发启动

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 生产构建
```

---

## 扩展说明

- **替换背景图**：在 `PreloadScene.preload()` 中添加 `this.load.image(key, path)`，删除 `createPlaceholderTextures()` 中对应条目
- **添加角色精灵**：将 `CombatScene` 中的 `Rectangle` 替换为 `Sprite`
- **新增地点**：在 `data/locations.ts` 中添加条目，在 `PreloadScene` 注册对应背景 key
- **新增敌人/物品/NPC**：分别在对应 data 文件中添加条目，无需修改其他代码
- **新增商店**：在 `data/shops.ts` 中添加条目，在对应 NPC 对话节点加入 `next: 'shop'`

---

## 待实现（Roadmap）

- [x] 背包/装备 UI 面板（Phase 7）
- [x] 任务系统（Phase 7）
- [x] 商店购买/出售（Phase 8~9）
- [x] 暂停菜单 + 主菜单存档预览（Phase 8）
- [x] 战斗失败重生机制（Phase 9）
- [ ] 音效集成（Phaser Sound Manager）
- [ ] 真实美术资源替换占位纹理
- [ ] 地图界面（可视化地点连接关系）
- [ ] 角色技能解锁（升级时学习新技能）

