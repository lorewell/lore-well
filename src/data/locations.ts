import type { Location } from '../types'

export const LOCATIONS: Record<string, Location> = {
  village: {
    id: 'village',
    name: '晨曦村',
    description: '一个宁静的小村庄，被森林和山脉环绕。这里的人们过着平静的生活，但近来却笼罩在不安的阴影之下。',
    backgroundKey: 'bg_village',
    exits: ['forest', 'temple_ruins'],
    interactions: [
      { id: 'village_inn', label: '暮光客栈', type: 'building', targetId: 'innkeeper' },
      { id: 'village_smith', label: '铁匠铺', type: 'building', targetId: 'blacksmith' },
      { id: 'village_elder', label: '长老之屋', type: 'npc', targetId: 'elder' },
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
      { id: 'temple_altar', label: '神秘祭坛', type: 'building', targetId: 'elder' },
    ],
  },
}

export const STARTING_LOCATION = 'village'
