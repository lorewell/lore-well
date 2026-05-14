import type { Location } from '../../types'

export const TEMPLE_LOCATION: Location = {
  id: 'zone_temple_ruins',
  name: '古代神殿遗迹',
  description: '被岁月侵蚀的石柱静静伫立，地面刻满了无人能解的古老文字。',
  backgroundKey: 'bg_temple',
  exits: [],
  interactions: [],
  subMap: {
    startNodeId: 'space_temple_outer',
    nodes: {
      space_temple_outer: {
        id: 'space_temple_outer',
        name: '神殿前庭',
        description:
          '被岁月侵蚀的石柱静静伫立，脚下的石板地缝中长出了野草。残破的神像凝视着每一个踏入此地的访客。',
        interactions: [
          { id: 'temple_guard', label: '遗迹守卫者', type: 'enemy', targetId: 'mob_goblin' },
        ],
        north:  'space_temple_inner',
        east:   'space_temple_corridor',
        exits:  ['zone_village'],
      },
      space_temple_inner: {
        id: 'space_temple_inner',
        name: '神殿内室',
        description:
          '昏暗的内室中，烛台早已熄灭，残破的壁画记录着某段被遗忘的历史。空气中有种让人沉静的奇异气息。',
        interactions: [
          { id: 'temple_mage', label: '哥布林法师', type: 'enemy', targetId: 'mob_goblin_mage' },
        ],
        south: 'space_temple_outer',
        north: 'space_temple_altar',
      },
      space_temple_altar: {
        id: 'space_temple_altar',
        name: '祭坛深处',
        description:
          '神殿最深处——幽蓝的泉水在黑暗中静静流淌，水面倒映着不属于当下的画面。这就是传说中的「Lore Well」。',
        interactions: [
          { id: 'temple_lore_well', label: '传说源泉 Lore Well', type: 'building', targetId: 'npc_elder' },
          { id: 'temple_mage2',     label: '祭坛守卫',           type: 'enemy',    targetId: 'mob_goblin_mage' },
        ],
        south: 'space_temple_inner',
      },
      space_temple_corridor: {
        id: 'space_temple_corridor',
        name: '神殿侧廊',
        description:
          '狭长的石质廊道，地面刻满了无人能解的古老文字。廊道尽头隐约有光芒闪烁，似乎有人在那里留下了什么。',
        interactions: [
          { id: 'temple_corridor_mage', label: '巡逻的法师', type: 'enemy', targetId: 'mob_goblin_mage' },
        ],
        west: 'space_temple_outer',
      },
    },
  },
}
