import type { Item } from '../../types'

export const MATERIALS: Record<string, Item> = {
  mat_iron_ore: {
    id: 'mat_iron_ore',
    name: '铁矿石',
    description: '从山中开采的铁矿石，铁匠打造装备的基础材料。',
    type: 'material',
    stackable: true,
  },
  mat_slime_jelly: {
    id: 'mat_slime_jelly',
    name: '史莱姆胶质',
    description: '从史莱姆身上提取的黏稠胶质，可用于合成特殊装备。',
    type: 'material',
    stackable: true,
  },
  mat_wolf_fang: {
    id: 'mat_wolf_fang',
    name: '狼牙',
    description: '从森林狼身上掉落的坚硬獠牙，可用于制作武器。',
    type: 'material',
    stackable: true,
  },
  mat_spider_silk: {
    id: 'mat_spider_silk',
    name: '蜘蛛丝',
    description: '洞穴蜘蛛吐出的坚韧蛛丝，可用于编织特殊护甲。',
    type: 'material',
    stackable: true,
  },
  mat_goblin_tooth: {
    id: 'mat_goblin_tooth',
    name: '哥布林牙',
    description: '从哥布林身上掉落的尖锐牙齿，可用于强化武器。',
    type: 'material',
    stackable: true,
  },
  mat_stone_core: {
    id: 'mat_stone_core',
    name: '石像核心',
    description: '从石像魔身上获取的神秘核心，蕴含强大的地属性魔力。',
    type: 'material',
    stackable: true,
  },
  mat_cursed_ash: {
    id: 'mat_cursed_ash',
    name: '诅咒灰烬',
    description: '被黑魔法浸染的灰烬，散发着淡淡的紫色光芒，可用于合成诅咒类装备。',
    type: 'material',
    stackable: true,
  },
}
