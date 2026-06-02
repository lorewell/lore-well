---
name: ability-stats-system
overview: 引入四能力值系统（力量/敏捷/智力/体质），去除速度属性，实现能力值→战斗属性的映射+角色天赋差异化+每级5点自由分配
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - 像素风RPG
    - 深色面板
    - 金色标签
  fontSystem:
    fontFamily: PingFang-SC
    heading:
      size: 18px
      weight: 700
    subheading:
      size: 14px
      weight: 600
    body:
      size: 12px
      weight: 400
  colorSystem:
    primary:
      - "#b68f59"
      - "#f8e7b7"
    background:
      - "#080a0a"
      - "#1a1410"
    text:
      - "#f8e7b7"
      - "#b68f59"
    functional:
      - "#73c66d"
      - "#c65555"
todos:
  - id: update-types
    content: 更新类型定义：Stats去spd，新增Abilities/Talent接口，Character加abilities/abilityPoints/talent字段
    status: completed
  - id: update-calc-and-store
    content: 实现calcBaseStats函数、allocateAbility方法，改造gainExp升级逻辑和flee公式
    status: completed
    dependencies:
      - update-types
  - id: update-characters-enemies
    content: 更新玩家模板(加能力值/天赋)和6种敌人数据(去spd)
    status: completed
    dependencies:
      - update-types
  - id: update-equipment-data
    content: 所有装备的spd转crit/dodge，更新描述文案
    status: completed
    dependencies:
      - update-types
  - id: update-ui-panels
    content: 改造EquipPanel(能力值展示+加点)、CombatPanel(去速度)、GameScreen
    status: completed
    dependencies:
      - update-calc-and-store
  - id: save-migration
    content: 存档版本v5→v6迁移，旧存档补充默认能力值和天赋
    status: completed
    dependencies:
      - update-calc-and-store
---

## 产品概述

将角色属性系统从"硬编码数值 + 固定成长"改造为"四能力值驱动 + 天赋加成差异化"体系。

## 核心特性

- 新增四个能力值：力量、敏捷、智力、体质，每升一级获得5点自由分配
- 能力值映射战斗属性：力量→物攻+物防，敏捷→暴击+闪避，智力→魔攻+魔防，体质→生命上限+魔力上限
- 删除速度属性（回合制无意义），逃跑改为固定概率
- 不同角色通过"天赋加成"实现差异化成长（每级额外获得的固定属性不同）
- 怪物属性固定不变，无能力值和等级概念
- 角色面板（EquipPanel）需展示能力值和可分配点数，支持加点操作
- 战斗面板和装备面板同步更新，去除速度相关展示
- 存档迁移处理旧数据（去除spd、补充能力值默认值）

## 技术栈

- 沿用现有：React 19 + Zustand 5 + TypeScript + Tailwind CSS v4

## 实现方案

### 核心设计：方案三（主属性映射 + 天赋加成）

**通用能力值 → 战斗属性映射表：**

| 能力值 | 主要影响 | 次要影响 |
| --- | --- | --- |
| 力量(str) | 物攻 +2.0, 物防 +0.5 | — |
| 敏捷(agi) | 暴击 +0.4%, 闪避 +0.4% | — |
| 智力(int) | 魔攻 +2.0, 魔防 +0.5 | — |
| 体质(con) | 生命上限 +8, 魔力上限 +3 | — |


**角色天赋加成（每级额外获得）：**

| 角色类型 | 天赋加成/级 |
| --- | --- |
| 勇者(均衡) | 物攻+0.8, 魔攻+0.8, 物防+0.6, 魔防+0.6, 暴击+0.1%, 闪避+0.1%, 生命上限+4, 魔力上限+2 |
| 未来扩展角色各自定义 | — |


### 架构变更

1. **Stats 接口**：删除 spd，保留 8 个战斗属性（hp/maxHp/mp/maxMp/atk/matk/def/mdef/crit/dodge）
2. **Character 接口**：新增 `abilities`(当前能力值)、`abilityPoints`(可分配点数)、`talent`(天赋配置)
3. **计算逻辑**：baseStats 不再硬编码成长，由 abilities × 映射表 + 等级 × 天赋加成 动态计算
4. **升级逻辑**：gainExp 中不再手动加属性，改为 abilities += abilityPoints分配, 然后重算 baseStats
5. **存档迁移**：版本 v5→v6，旧存档补充默认能力值和天赋

### 关键实现细节

**baseStats 计算函数（新增）：**

```
calcBaseStats(abilities, level, talent):
  stats = {
    maxHp: 100 + abilities.con * 8 + (level-1) * talent.maxHp,
    maxMp: 40 + abilities.int * 3 + (level-1) * talent.maxMp,  // 智力也加魔力
    atk: 10 + abilities.str * 2.0 + (level-1) * talent.atk,
    matk: 5 + abilities.int * 2.0 + (level-1) * talent.matk,
    def: 5 + abilities.str * 0.5 + (level-1) * talent.def,
    mdef: 3 + abilities.int * 0.5 + (level-1) * talent.mdef,
    crit: 5 + abilities.agi * 0.4 + (level-1) * talent.crit,
    dodge: 3 + abilities.agi * 0.4 + (level-1) * talent.dodge,
  }
```

- 体质加魔力上限作为次要影响（纯体质只加血太弱）
- 基础常量(100/40/10/5/5/3/5/3)保证 LV1 无能力值时也有最低属性

**升级流程改造：**

- 升级时：level++, abilityPoints += 5, 重新 calcBaseStats
- 分配能力值时：abilities.str++ (etc), abilityPoints--, 重算 baseStats + stats
- 不再在 gainExp 中硬编码属性成长

**装备 spd 处理：**

- 疾风戒指 spd:8 → 改为 dodge:3（闪避率+3%）
- 布靴 spd:4 → dodge:1.5%
- 硬皮靴 spd:8 → dodge:3%
- 猎人之刃 spd:5 → crit:2%
- 毒蛛战刃 spd:10 → crit:4%
- 蛛丝软甲 spd:4 → dodge:1.5%
- 追踪者之靴 spd:6+def:3 → dodge:2.5%+def:3
- 狼首面具 atk:5+spd:5 → atk:5+crit:2%
- 诅咒胫甲 def:5+atk:5 → 不变（无spd）

**statBonus 类型更新：**
`Partial<Omit<Stats, 'hp' | 'mp'>>` 自动跟随 Stats 变化，spd 移除后不再接受 spd 字段。

**逃跑公式：**
改为固定 60% 概率：`Math.random() < 0.6`

### 目录结构

```
src/
├── types/index.ts               # [MODIFY] Stats去spd, 新增Abilities/Talent类型, Character加字段
├── data/characters.ts           # [MODIFY] PLAYER_TEMPLATE加abilities/abilityPoints/talent, 重算baseStats
├── data/enemies/index.ts        # [MODIFY] 6种敌人stats去spd
├── data/items/equipment.ts      # [MODIFY] 所有spd→crit/dodge, 描述更新
├── store/gameStore.ts           # [MODIFY] 新增calcBaseStats/allocateAbility, 改gainExp/flee/save迁移
├── screens/GameScreen.tsx       # [MODIFY] EquipPanel: 能力值展示+加点按钮, 去速度
├── components/CombatPanel.tsx   # [MODIFY] 去速度展示, 同步新属性名
```

### 性能与可靠性

- calcBaseStats 是纯计算 O(1)，每次状态变更时调用一次，无性能瓶颈
- 存档迁移需 bump 版本号，旧存档自动补充默认能力值（按当前 baseStats 反推或给默认值）
- 装备 statBonus 类型自动跟随 Stats 接口变化，TypeScript 编译期保证一致性

## 设计说明

在现有 EquipPanel（角色面板）基础上扩展，增加"能力值"展示区和可分配点数交互。

### 角色面板（EquipPanel）改造

面板分为三个区块（从上到下）：

1. **角色信息区**（保留）：名称、等级、经验条、金币
2. **能力值区**（新增）：力量/敏捷/智力/体质 四行展示，每行显示当前值和"+"按钮（有可分配点数时亮起），顶部显示"可分配点数: X"
3. **战斗属性区**（修改）：去除速度，保留8个属性的双列布局
4. **装备区**（保留）：5个槽位展示

### 能力值区设计

- 深色面板背景，金色标签文字，数值用浅金色
- 可分配点数显示为醒目的亮绿色数字
- "+"按钮为小型像素风按钮，无可分配点数时灰色禁用
- 每个能力值行：图标/名称 | 当前数值 | +按钮
- 底部可选：显示该能力值影响的属性（如"力量 → 物攻/物防"小字提示）

### 配色

沿用现有像素RPG风格：深色背景(#080a0a)、金色标签(#b68f59)、浅金数值(#f8e7b7)、绿色加成(#73c66d)

## SubAgent

- **code-explorer**: 搜索项目中所有引用 spd/速度/abilities 的位置，确保迁移无遗漏