import type { Location } from '../types'

export const LOCATIONS: Record<string, Location> = {
  village: {
    id: 'village',
    name: '落瀑村',
    description: '坐落于隐秘瀑布脚下的宁静村庄。潺潺水声自山间倾泻而下，流经村旁，世代哺育着这里的居民。近来，村子周边的不安暗流让村民们忧心忡忡。',
    backgroundKey: 'bg_village',
    exits: ['forest', 'temple_ruins', 'mine_cave'],
    interactions: [
      { id: 'village_waterfall', label: '隐秘瀑布（发现之地）', type: 'building', targetId: 'waterfall' },
      { id: 'village_elder_home', label: '艾尔文的家', type: 'npc', targetId: 'elder' },
      { id: 'village_smith', label: '铁匠铺（托尔）', type: 'npc', targetId: 'blacksmith' },
      { id: 'village_inn', label: '暮光客栈（玛格）', type: 'npc', targetId: 'innkeeper' },
      { id: 'village_grocer', label: '杂货铺（梅娜）', type: 'npc', targetId: 'grocer' },
      { id: 'village_chief', label: '村长之屋（格雷）', type: 'npc', targetId: 'village_chief' },
      { id: 'village_slime', label: '附近的史莱姆', type: 'enemy', targetId: 'slime' },
    ],
  },
  forest: {
    id: 'forest',
    name: '幽暗森林',
    description: '树木高大茂密，阳光几乎无法穿透枝叶。这里潜伏着各种危险的生物。',
    backgroundKey: 'bg_forest',
    exits: ['village', 'forest_depths'],
    interactions: [
      { id: 'forest_goblin', label: '哥布林巡逻队', type: 'enemy', targetId: 'goblin' },
      { id: 'forest_wolf', label: '森林狼群', type: 'enemy', targetId: 'forest_wolf' },
      { id: 'forest_potion', label: '废弃的行囊', type: 'item', targetId: 'health_potion' },
    ],
  },
  forest_depths: {
    id: 'forest_depths',
    name: '森林深处',
    description: '几乎没有人敢踏足的地方，空气中弥漫着古老魔法的气息。',
    backgroundKey: 'bg_forest_deep',
    exits: ['forest'],
    interactions: [
      { id: 'depth_wolf', label: '古老的狼灵', type: 'enemy', targetId: 'forest_wolf' },
      { id: 'depth_golem', label: '石像鬼守卫', type: 'enemy', targetId: 'stone_golem' },
      { id: 'depth_key', label: '石台上的匣子', type: 'item', targetId: 'ancient_key' },
    ],
  },
  temple_ruins: {
    id: 'temple_ruins',
    name: '古代神殿遗迹',
    description: '被岁月侵蚀的石柱静静伫立，地面刻满了无人能解的古老文字。',
    backgroundKey: 'bg_temple',
    exits: ['village'],
    interactions: [
      { id: 'temple_guard', label: '遗迹守卫者', type: 'enemy', targetId: 'goblin' },
      { id: 'temple_mage', label: '哥布林法师', type: 'enemy', targetId: 'goblin_mage' },
      { id: 'temple_altar', label: '神秘祭坛', type: 'building', targetId: 'elder' },
    ],
  },
  mine_cave: {
    id: 'mine_cave',
    name: '废弃矿洞',
    description: '村子北边的旧矿洞，曾经是繁忙的采矿场，如今只剩危险的怪物和散落的矿石。',
    backgroundKey: 'bg_mine',
    exits: ['village'],
    interactions: [
      { id: 'mine_spider', label: '洞穴蜘蛛', type: 'enemy', targetId: 'cave_spider' },
      { id: 'mine_goblin', label: '挖矿哥布林', type: 'enemy', targetId: 'goblin' },
      { id: 'mine_ore', label: '裸露的矿脉', type: 'item', targetId: 'iron_ore' },
    ],
  },
}

export const STARTING_LOCATION = 'village'
