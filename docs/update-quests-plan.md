# 更新计划：幽暗森林 + 全局任务 / 人物扩展

> 创建日期：2026-05-25  
> 状态：**待实现**

---

## 概述

在原有幽暗森林任务优化基础上，新增 **8 个支线 / 剧情任务** + **2 个新 NPC**，解决"人物太少"的问题，并修复废旧传送阵、戒指任务两处长期搁置的死路。

---

## 原有森林计划（沿用）

| # | 内容 | 涉及文件 |
|---|------|----------|
| ① | **Bug fix**：`travelToSubLocation` 未触发 `visit_location` 类型的任务目标 | `src/store/gameStore.ts` |
| ② | 强化 `quest_forest`：新增族徽收集目标 `have_item: qitem_goblin_emblem` | `src/data/quests.ts` |
| ③ | 新任务 `quest_goblin_conspiracy`（哥布林的密谋）| `src/data/quests.ts` |
| ④ | 新任务 `quest_rune_whisper`（古林的低语）| `src/data/quests.ts` |
| ⑤ | 将 `mob_goblin_mage` 放置到乌雾林道或幽魂古林节点 | `src/data/locations.ts` |

---

## 新增 NPC

### A. 汉弗（Humphrey）— 落瀑村老渔夫

- **位置**：`village_waterfall`（在瀑布旁钓鱼，独立 NPC）
- **关键作用**：修复 `quest_ring_origin` 目前因 `npc_ring_mystery_contact` 不存在而永远无法推进的死结——汉弗 **就是** 那个持有戒指的人（直接复用该 ID），戒指由渔夫主动交给玩家
- **角色背景**：80 岁老渔夫，常年坐在瀑布边钓鱼。3 年前亲眼目睹一道人形光柱坠入瀑布，后在水边捡到一枚闪金色光的戒指，一直妥善保管至今；艾尔文知道他，但从未将两件事联系起来
- **剧情流程**：
  1. 玩家首次与汉弗对话（`greeting`），汉弗表示可以教玩家钓鱼
  2. 汉弗给玩家一根鱼竿（新道具 `tool_fishing_rod`），触发小任务 `quest_fishing_tutorial`
  3. 玩家在瀑布节点使用鱼竿钓上第一条鱼（`qitem_first_fish`），任务完成
  4. 再次与汉弗对话（`fish_caught`），汉弗称赞玩家，随后问起玩家来此的原因
  5. 玩家回答想寻找丢失的记忆或相关物品（`ask_purpose`）
  6. 汉弗若有所思，拿出那枚戒指交给玩家（`give_ring`）
  7. 获得戒指后触发回忆（`ring_reaction`），推进 `quest_ring_origin`
- **对话节点**：`greeting → teach_fish → (小任务完成) → fish_caught → ask_purpose → give_ring → ring_reaction`
- **新建文件**：`src/data/dialogues/humphrey.ts`

### B. 奥斯（Voss）— 过路商人

- **位置**：`village_inn`（常驻客栈，描述上带"偶尔出远门"的感觉）
- **关键作用**：带来帝都失联、魔族集结的大陆世界感背景；提供高价稀有物品商店
- **商品**：`equip_vitality_amulet`（生命护符）、`cons_elixir`（高级药剂）等，定价高于普通商店
- **对话节点**：`greeting → world_news → sell（打开商店）→ rumors`
- **新建文件**：`src/data/dialogues/merchant.ts`

---

## 新增任务

### 简单支线（1–2 目标，快速完成）

#### S0. `quest_fishing_tutorial` — 汉弗：钓鱼教学

| 字段 | 内容 |
|------|------|
| 触发条件 | 汉弗对话新增选项"可以教我钓鱼吗？" |
| 背景 | 老渔夫汉弗在瀑布边钓鱼，愿意教玩家钓鱼，送给玩家一根鱼竿 |
| 新物品 | `tool_fishing_rod`（鱼竿，汉弗赠送）、`qitem_first_fish`（第一条鱼）|
| 目标① | 获得鱼竿（`have_item: tool_fishing_rod`）|
| 目标② | 在瀑布钓上第一条鱼（`have_item: qitem_first_fish`，通过瀑布节点交互获得）|
| 奖励 | exp 50 / gold 10 / 解锁汉弗后续对话（`fish_caught` 节点，引出戒指剧情）|
| 设计意图 | 新手引导型支线；通过钓鱼教学引入汉弗角色，自然过渡到戒指主线 |

#### S1. `quest_mag_firewood` — 玛格：客栈的柴火

| 字段 | 内容 |
|------|------|
| 触发条件 | 玛格对话新增选项"客栈的柴火快不够了" |
| 背景 | 村南路哥布林挡住了去森林入口的路，玛格请玩家帮忙清道 |
| 目标① | 进入灰烬谷口（`visit_location: space_ash_valley_gate`）|
| 目标② | 击败哥布林巡逻队（`defeat_enemy: mob_goblin`）|
| 奖励 | exp 70 / gold 25 / 解锁玛格"免费住一次"选项（`restoreHpMp`）|
| 设计意图 | 给玩家一个主动进入森林的理由；与 `quest_forest` 目标互补不冲突 |

#### S2. `quest_blacksmith_silk` — 托尔：蛛网订单

| 字段 | 内容 |
|------|------|
| 触发条件 | 托尔对话新增选项"最近有特殊委托？" |
| 背景 | 外地商人订了一批蛛丝软甲，托尔缺原材料 |
| 目标 | 收集 `mat_spider_silk` ×3（洞穴蜘蛛 87% 掉落）|
| 奖励 | exp 100 / gold 60 / `equip_silk_armor`（原本只能合成，现多一条获取途径）|

#### S3. `quest_chief_patrol` — 格雷：村界巡逻

| 字段 | 内容 |
|------|------|
| 触发条件 | 格雷对话新增选项"有什么我能帮的？" |
| 目标① | 查看破损栅栏（`talk_npc: point_outskirts_fence`）|
| 目标② | 击败村子外围哥布林（`defeat_enemy: mob_goblin`）|
| 目标③ | 回报格雷（`talk_npc: npc_village_chief`）|
| 奖励 | exp 90 / gold 50 / 格雷解锁"感谢"对话节点 |
| 设计意图 | 引导玩家探索 `village_outskirts` 节点 |

---

### 故事支线（2–4 目标，有情感深度）

#### S4. `quest_lina_gift` — 莉娜：爷爷的礼物

| 字段 | 内容 |
|------|------|
| 触发条件 | `quest_arrive` 完成后，莉娜新增选项"艾尔文爷爷的生辰快到了……" |
| 背景 | 莉娜想送爷爷年轻时挂念的"流星碎石"，据说碎月祭台附近能找到 |
| 新物品 | `qitem_meteor_fragment`（流星碎石，放在 `space_broken_moon_altar` 建筑交互中）|
| 目标① | 进入碎月祭台（`visit_location: space_broken_moon_altar`）|
| 目标② | 找到流星碎石（`have_item: qitem_meteor_fragment`）|
| 目标③ | 交还给莉娜（`talk_npc: npc_lina` 新节点）|
| 奖励 | exp 100 / 莉娜解锁情感对话"你让我觉得你不是陌生人" / 艾尔文解锁感谢节点 |
| 设计意图 | 莉娜情感线首次推进；引导玩家深入森林碎月祭台区域 |

#### S5. `quest_mag_brother` — 玛格：弟弟的下落

| 字段 | 内容 |
|------|------|
| 触发条件 | 玛格对话新增选项"你弟弟……也是失踪的矿工？" |
| 背景 | 玛格的弟弟罗格是 3 周前第一批进矿洞失联的矿工；玛格从不在外人面前提，但心中压着 |
| 新物品 | `qitem_miner_tag`（矿工号牌，在 `space_rusty_mine_road` 新建筑交互"矿工遗物"中获得）|
| 目标① | 进入锈齿矿道（`visit_location: space_rusty_mine_road`）|
| 目标② | 找到矿工号牌（`have_item: qitem_miner_tag`）|
| 目标③ | 回来告诉玛格（`talk_npc: npc_innkeeper` 新节点）|
| 奖励 | exp 140 / gold 80 / 玛格解锁"弟弟后事"情感对话线 |
| 设计意图 | 落实矿洞失踪事件的真实性；为矿洞深层内容铺垫 |

---

### 身份 / 谜题线（连接主线隐线）

#### S6. `quest_torn_map` — 莉娜的小秘密

| 字段 | 内容 |
|------|------|
| 触发条件 | `quest_village_intro` 完成后，莉娜新增选项"……其实我一直有件事想跟你说" |
| 背景 | 艾尔文救起玩家时，莉娜在乱石旁捡到一张半烧毁的地图碎片，一直藏着没说；地图上有她看不懂的文字和城堡轮廓 |
| 新物品 | `qitem_torn_map`（残破地图，由莉娜主动交给玩家）|
| 目标① | 与莉娜深入对话（`talk_npc: npc_lina` 新节点链）|
| 目标② | 获得残破地图（`have_item: qitem_torn_map`）|
| 目标③ | 让艾尔文鉴定（`talk_npc: npc_elder` 新节点，艾尔文认出地图指向"魔王城方向"）|
| 奖励 | exp 120 / 解锁艾尔文新对话（首次隐晦提示玩家可能是卡尔）|
| 设计意图 | **玩家身份谜题的第一块碎片**；莉娜与玩家之间建立更深的信任 |

#### S7. `quest_broken_portal` — 废旧传送阵的秘密

| 字段 | 内容 |
|------|------|
| 触发条件 | 到访 `village_portal` 节点，与新增景物 NPC `point_broken_portal` 交互 |
| 背景 | 传送阵 3 年前突然失效，时间与勇者失踪完全吻合；格雷从未公开谈及此事 |
| 目标① | 检查传送阵（`talk_npc: point_broken_portal`）|
| 目标② | 询问格雷传送阵的历史（`talk_npc: npc_village_chief` 新节点）|
| 目标③ | 询问艾尔文（`talk_npc: npc_elder` 新节点，他说"传送阵在卡尔入魔王城那晚有过异动"）|
| 奖励 | exp 80 / 解锁艾尔文关于"卡尔最后行踪"的全新对话 |
| 设计意图 | 修复 `village_portal` 节点"进去什么都没有"的问题；强化玩家身份猜测线 |

---

## 已有任务修复

### `quest_ring_origin` 死结修复

目前该任务因 `npc_ring_mystery_contact` 未定义而永远无法推进。  
**方案**：将汉弗的 NPC ID 设为 `npc_ring_mystery_contact`。剧情改为：玩家完成钓鱼小任务后，汉弗询问来由，得知玩家在寻找失落的记忆，主动将保管 3 年的戒指交给玩家，触发回忆。无需修改任务数据结构，任务流程自动可走通。

---

## 新增物品

| ID | 名称 | 用途 |
|----|------|------|
| `tool_fishing_rod` | 鱼竿 | `quest_fishing_tutorial` 钓鱼教学任务道具，汉弗赠送 |
| `qitem_first_fish` | 第一条鱼 | `quest_fishing_tutorial` 钓鱼完成凭证 |
| `qitem_meteor_fragment` | 流星碎石 | `quest_lina_gift` 核心道具 |
| `qitem_miner_tag` | 矿工号牌 | `quest_mag_brother` 核心道具 |
| `qitem_torn_map` | 残破地图 | `quest_torn_map` 核心道具 |

---

## 涉及文件清单

| 文件 | 变更类型 |
|------|----------|
| `src/store/gameStore.ts` | Bug fix：`travelToSubLocation` 触发 `_autoCompleteObjectives` |
| `src/data/quests.ts` | 新增 S0–S7 共 8 个任务；强化 `quest_forest`；修复 `quest_ring_origin` |
| `src/data/items.ts` | 新增 5 个任务道具 |
| `src/data/locations.ts` | 新增汉弗/奥斯 NPC 交互节点；`point_broken_portal` 景物；矿工遗物交互；流星碎石交互；瀑布钓鱼交互；放置 `mob_goblin_mage` |
| `src/data/npcs.ts` | 注册汉弗、奥斯的 NPC 信息 |
| `src/data/shops.ts` | 新增奥斯商店数据 |
| `src/data/dialogues/humphrey.ts` | **新建**（汉弗完整对话树）|
| `src/data/dialogues/merchant.ts` | **新建**（奥斯完整对话树）|
| `src/data/dialogues/lina.ts` | 扩展：S4 礼物线 + S6 地图线，各 2–3 个新节点 |
| `src/data/dialogues/innkeeper.ts` | 扩展：S1 柴火线 + S5 弟弟线，各 1–2 个新节点 |
| `src/data/dialogues/blacksmith.ts` | 扩展：S2 蛛网委托线 |
| `src/data/dialogues/village_chief.ts` | 扩展：S3 巡逻线 + S7 传送阵线 |
| `src/data/dialogues/elder.ts` | 扩展：S4 感谢节点 + S6 地图鉴定 + S7 传送阵异动 + `quest_rune_whisper` 节点 |
| `src/data/dialogues/waterfall.ts` | 扩展：接入汉弗 NPC + 钓鱼交互节点 |
| `src/data/dialogues/index.ts` | 导出 `humphrey`、`merchant` 两个新对话模块 |

---

## 设计决策

| 决策 | 理由 |
|------|------|
| 汉弗 ID = `npc_ring_mystery_contact` | 直接复用已声明的 ID，不修改任务数据结构 |
| 戒指由汉弗主动交给玩家 | 原方案是玩家自己找到戒指，现改为完成钓鱼教学后汉弗询问来意并主动交付，增强剧情情感自然度 |
| 钓鱼教学作为戒指任务前置 | `quest_fishing_tutorial` 完成后解锁汉弗对话后续节点，自然过渡到 `quest_ring_origin` |
| 奥斯使用现有 Shop 系统 | 不引入新系统，仅新增一个 shop 定义 |
| `quest_torn_map` 不直接揭示身份 | 艾尔文只说"地图指向魔王城方向"，保持悬念 |
| `quest_broken_portal` 无金钱奖励 | 纯世界观解锁，保持"神秘感大于实用性"的定位 |
| S4+S5 不强制先于主线 | 作为可选支线，不阻塞主线进度 |

---

## 待确认事项

1. **`mob_goblin_mage` 放置位置**：乌雾林道（已有 3 个交互）还是幽魂古林（只有 2 个）？
2. **`qitem_goblin_emblem` 掉落率**：维持 28% 随机还是改为 100% 保证任务流畅？
3. **奥斯是否需要小支线任务**？（如委托玩家打探消息，暂定仅作商店+世界观 NPC）
4. **莉娜情感线深度**：S4 + S6 两个任务是否足够第一章深度，第二章再续？
