import type { Location } from '../../types'

export const FOREST_LOCATION: Location = {
  id: 'zone_forest',
  name: '幽暗森林',
  description: '树冠将天光隔绝，终年弥漫着腐叶与霉苔的气息。向北可以深入幽魂古林，向东则通往废弃矿洞。',
  backgroundKey: 'bg_forest',
  exits: [],
  interactions: [],
  subMap: {
    startNodeId: 'space_ash_valley_gate',
    nodes: {

      // ── 森林浅层 ────────────────────────────────────────────────────────────
      space_ash_valley_gate: {
        id: 'space_ash_valley_gate',
        name: '灰烬谷口',
        description:
          '曾经有村民在此地焚烧荆棘开路，留下一片烧焦的地面和半截倒木。哥布林频繁出没，猎人们已经多日未踏足此处。',
        interactions: [
          { id: 'gate_goblin_patrol', label: '哥布林巡逻队',  type: 'enemy',    targetId: 'mob_goblin' },
          { id: 'gate_slime',         label: '游荡的史莱姆',  type: 'enemy',    targetId: 'mob_slime' },
          { id: 'gate_charred_sign',  label: '烧焦的路牌',   type: 'building', targetId: 'point_ash_valley_sign' },
        ],
        north:  'space_ruined_camp',
        east:   'space_rusty_mine_road',
        west:   'space_bone_marsh',
        exits:  ['zone_village'],
      },

      space_bone_marsh: {
        id: 'space_bone_marsh',
        name: '折骨沼',
        description:
          '泥泞的低洼地带，野兽的骨骸半陷在黑泥里，空气中有淡淡的硫磺味。哥布林常在灌木后伏击路人。',
        interactions: [
          { id: 'marsh_goblin_ambush', label: '伏击的哥布林', type: 'enemy', targetId: 'mob_goblin' },
          { id: 'marsh_swamp_frog',    label: '泥沼蛙',       type: 'enemy', targetId: 'mob_swamp_frog' },
          { id: 'marsh_old_pack',      label: '泥中的行囊',   type: 'item',  targetId: 'cons_health_potion' },
        ],
        east: 'space_ash_valley_gate',
      },

      space_ruined_camp: {
        id: 'space_ruined_camp',
        name: '猎人营地',
        description:
          '林中空地，几顶兽皮帐篷围成营地。篝火上架着铁锅，晾晒架挂着风干的兽肉和药草，一切井井有条。猎人一家常年居于此，这片林子是他们的家。',
        interactions: [
          { id: 'camp_hunter_wife',  label: '猎人的妻子',     type: 'npc',      targetId: 'npc_hunter_wife' },
          { id: 'camp_hunter_son',   label: '猎人的儿子',     type: 'npc',      targetId: 'npc_hunter_son' },
          { id: 'camp_hunter_notes', label: '猎人离家前的笔记', type: 'building', targetId: 'point_hunter_notes' },
        ],
        south:  'space_ash_valley_gate',
        north:  'space_misty_forest_path',
      },

      // ── 森林深处 ────────────────────────────────────────────────────────────
      space_misty_forest_path: {
        id: 'space_misty_forest_path',
        name: '乌雾林道',
        description:
          '浓稠的雾气从地面升腾，将视线压缩至数步之内。脚踩在湿软的腐叶上几乎没有声音，但你能感觉到有什么东西在雾中跟随着你。',
        interactions: [
          { id: 'misty_wolf_spirit',  label: '缠绕的狼灵',   type: 'enemy',    targetId: 'mob_forest_wolf' },
          { id: 'misty_goblin_mage',  label: '哥布林法师',   type: 'enemy',    targetId: 'mob_goblin_mage' },
          { id: 'misty_shadow_vine',  label: '暗影妖藤',     type: 'enemy',    targetId: 'mob_shadow_vine' },
          { id: 'misty_stone_mark',   label: '刻字的界石',   type: 'building', targetId: 'point_boundary_stone' },
        ],
        south: 'space_ruined_camp',
        west:  'space_broken_moon_altar',
      },

      space_broken_moon_altar: {
        id: 'space_broken_moon_altar',
        name: '碎月祭台',
        description:
          '一座古老的圆形祭台静立于林间空地，台面被某种巨力从中劈裂，半块台石沉入土中。石像鬼守候两侧，仿佛在等待某个永远不会到来的仪式。',
        interactions: [
          { id: 'altar_golem_guard',    label: '祭台守卫',   type: 'enemy',    targetId: 'mob_stone_golem' },
          { id: 'altar_iron_coffer',    label: '祭台铁匄',   type: 'item',     targetId: 'qitem_ancient_key' },
          { id: 'altar_meteor_fragment', label: '碎裂纹旁的石块', type: 'npc', targetId: 'point_meteor_fragment' },
        ],
        east:  'space_misty_forest_path',
        north: 'space_ghost_grove',
      },

      space_ghost_grove: {
        id: 'space_ghost_grove',
        name: '幽魂古林',
        description:
          '参天古木的树干比马车还宽，根系盘结成拱门般的形状。这里几乎没有任何声音，连风都静止了——据说第一批进入此地的人，再也没有走出来。',
        interactions: [
          { id: 'grove_wolf_alpha',        label: '狼灵首领',   type: 'enemy',    targetId: 'mob_forest_wolf' },
          { id: 'grove_shadow_vine',       label: '暗影妖藤',   type: 'enemy',    targetId: 'mob_shadow_vine' },
          { id: 'grove_elder_golem',       label: '远古石像鬼', type: 'enemy',    targetId: 'mob_stone_golem' },
          { id: 'grove_corrupted_treant',  label: '腐化树灵',   type: 'enemy',    targetId: 'mob_corrupted_treant' },
          { id: 'grove_rune_tree',         label: '符文古树',   type: 'building', targetId: 'point_rune_tree' },
        ],
        south: 'space_broken_moon_altar',
      },

      // ── 废弃矿洞 ────────────────────────────────────────────────────────────
      space_rusty_mine_road: {
        id: 'space_rusty_mine_road',
        name: '锈齿矿道',
        description:
          '铁轨已经锈蚀成橘红色，矿车脱轨翻倒在一侧。支撑横梁吓呀作响，偶尔有碎石从顶部坠落。洞穴蜘蛛在角落里编织着厉重的蜘蛛网。',
        interactions: [
          { id: 'mine_road_spider',   label: '守道蜘蛛',   type: 'enemy',    targetId: 'mob_cave_spider' },
          { id: 'mine_road_bat',      label: '矿洞蝠群',   type: 'enemy',    targetId: 'mob_cave_bat' },
          { id: 'mine_road_placard',  label: '警示木牌',   type: 'building', targetId: 'point_mine_warning' },
          { id: 'mine_road_remains',  label: '屏风控的遗物', type: 'npc', targetId: 'point_miner_remains' },
        ],
        west:  'space_ash_valley_gate',
        east:  'space_dark_vein_wall',
        north: 'space_mine_pit',
      },

      space_mine_pit: {
        id: 'space_mine_pit',
        name: '矿壁深坑',
        description:
          '矿道尽头的地面塌陷成一个深坑，坑壁上有数道幽蓝荧光渗出，忽明忽暗。一侧岩壁有一处浅浅的壁龛，似乎曾有人在此藏身——地上留有残余食物和蜡烛痕迹。',
        interactions: [
          { id: 'pit_goblin_miner',  label: '挖坑的哥布林', type: 'enemy', targetId: 'mob_goblin' },
          { id: 'pit_cave_spider',   label: '巨蛛',         type: 'enemy', targetId: 'mob_cave_spider' },
          { id: 'pit_hunter_toby',   label: '受困的猎人',   type: 'npc',   targetId: 'npc_hunter_toby' },
        ],
        south: 'space_rusty_mine_road',
      },

      space_dark_vein_wall: {
        id: 'space_dark_vein_wall',
        name: '黑脉矿壁',
        description:
          '岩壁深处裸露出一道粗大的铁矿脉，在火把光下泛着冷金属光泽。附近散落着被遗弃的镐头和空矿车——上一批矿工走得很匆忙。',
        interactions: [
          { id: 'vein_goblin_guard', label: '守矿哥布林', type: 'enemy', targetId: 'mob_goblin' },
          { id: 'vein_cave_bat',     label: '矿洞蝠群',   type: 'enemy', targetId: 'mob_cave_bat' },
          { id: 'vein_iron_ore',     label: '裸露的矿脉', type: 'item',  targetId: 'mat_iron_ore' },
        ],
        west: 'space_rusty_mine_road',
      },
    },
  },
}
