import type { Location } from '../types'

export const LOCATIONS: Record<string, Location> = {
  // ── 落瀑村 ─────────────────────────────────────────────────────────────────
  village: {
    id: 'village',
    name: '落瀑村',
    description: '坐落于隐秘瀑布脚下的宁静村庄，世代哺育着这里的居民。',
    backgroundKey: 'bg_village',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'village_center',
      nodes: {
        village_center: {
          id: 'village_center',
          name: '村庄中心',
          description: '落瀑村的中心广场，古老的石井旁老槐树枝叶繁茂。村民们在此聚集，低声谈论着近来越来越频繁的异动。',
          interactions: [],
          north: 'village_north',
          east: 'village_east',
          west: 'village_west',
          south: 'village_south',
        },
        village_north: {
          id: 'village_north',
          name: '隐秘瀑布',
          description: '一道银白色的瀑布从山间石缝倾泻而下，水声如鼓，雾气弥漫。就是在这片乱石丛中，艾尔文老人发现了昏迷的你。',
          interactions: [
            { id: 'village_waterfall', label: '凝视瀑布', type: 'building', targetId: 'waterfall' },
            { id: 'village_elder_home', label: '艾尔文的家', type: 'npc', targetId: 'elder' },
            { id: 'village_slime', label: '附近的史莱姆', type: 'enemy', targetId: 'slime' },
          ],
          south: 'village_center',
        },
        village_west: {
          id: 'village_west',
          name: '暮光客栈',
          description: '村里唯一的客栈，木质招牌在风中轻轻摇晃，里面总是温暖而昏黄的。村长格雷的房子就在隔壁。',
          interactions: [
            { id: 'village_inn', label: '老板娘 玛格', type: 'npc', targetId: 'innkeeper' },
            { id: 'village_chief', label: '村长之屋（格雷）', type: 'npc', targetId: 'village_chief' },
          ],
          east: 'village_center',
        },
        village_east: {
          id: 'village_east',
          name: '铁匠铺区',
          description: '叮叮当当的锤击声从铁匠铺里传出，旁边是梅娜那间摆满各色杂货的小铺子。',
          interactions: [
            { id: 'village_smith', label: '铁匠铺（托尔）', type: 'npc', targetId: 'blacksmith' },
            { id: 'village_grocer', label: '杂货铺（梅娜）', type: 'npc', targetId: 'grocer' },
          ],
          west: 'village_center',
        },
        village_south: {
          id: 'village_south',
          name: '村南路口',
          description: '通往村外的岔路口，一块风化的路标立在道旁，指向远方不同的方向。村庄的喧嚣在此渐渐淡去。',
          interactions: [],
          north: 'village_center',
          exits: ['forest', 'temple_ruins', 'mine_cave'],
        },
      },
    },
  },

  // ── 幽暗森林 ────────────────────────────────────────────────────────────────
  forest: {
    id: 'forest',
    name: '幽暗森林',
    description: '树木高大茂密，阳光几乎无法穿透枝叶，危险的生物潜伏其中。',
    backgroundKey: 'bg_forest',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'forest_entrance',
      nodes: {
        forest_entrance: {
          id: 'forest_entrance',
          name: '森林入口',
          description: '森林的边缘，光线在这里开始减弱。踏入其中，是另一个世界。哥布林的踪迹在泥地上清晰可见。',
          interactions: [
            { id: 'forest_goblin', label: '哥布林巡逻队', type: 'enemy', targetId: 'goblin' },
          ],
          north: 'forest_depths_path',
          east: 'forest_clearing',
          exits: ['village'],
        },
        forest_depths_path: {
          id: 'forest_depths_path',
          name: '林中深处',
          description: '枝叶遮天蔽日，脚下落叶沙沙作响。狼嚎声不时从更深处传来，让人不寒而栗。',
          interactions: [
            { id: 'forest_wolf', label: '森林狼群', type: 'enemy', targetId: 'forest_wolf' },
          ],
          south: 'forest_entrance',
          exits: ['forest_depths'],
        },
        forest_clearing: {
          id: 'forest_clearing',
          name: '林中空地',
          description: '一片相对开阔的地方，废弃的营火痕迹说明曾有人在此露宿。苔藓间，一只破旧的行囊引人注目。',
          interactions: [
            { id: 'forest_goblin2', label: '潜伏的哥布林', type: 'enemy', targetId: 'goblin' },
            { id: 'forest_potion', label: '废弃的行囊', type: 'item', targetId: 'health_potion' },
          ],
          west: 'forest_entrance',
        },
      },
    },
  },

  // ── 森林深处 ─────────────────────────────────────────────────────────────────
  forest_depths: {
    id: 'forest_depths',
    name: '森林深处',
    description: '几乎没有人敢踏足的地方，空气中弥漫着古老魔法的气息。',
    backgroundKey: 'bg_forest_deep',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'depths_entrance',
      nodes: {
        depths_entrance: {
          id: 'depths_entrance',
          name: '深处入口',
          description: '进入了人迹罕至的幽深地带，阳光完全消失，取而代之的是幽蓝色的苔藓光芒。一股古老的气息扑面而来。',
          interactions: [
            { id: 'depth_wolf', label: '古老的狼灵', type: 'enemy', targetId: 'forest_wolf' },
          ],
          east: 'depths_stone_platform',
          exits: ['forest'],
        },
        depths_stone_platform: {
          id: 'depths_stone_platform',
          name: '石台遗址',
          description: '一块古老的石台孤独伫立，台上放着一个布满灰尘的铁匣。石像鬼静静地守护着这里，直到有人打破这份宁静。',
          interactions: [
            { id: 'depth_golem', label: '石像鬼守卫', type: 'enemy', targetId: 'stone_golem' },
            { id: 'depth_key', label: '石台上的匣子', type: 'item', targetId: 'ancient_key' },
          ],
          west: 'depths_entrance',
          north: 'depths_ancient_trees',
        },
        depths_ancient_trees: {
          id: 'depths_ancient_trees',
          name: '古树密处',
          description: '高达数十米的古树笔直伫立，根系如巨龙的爪子蔓延在地面。这里弥漫着更浓烈的魔法气息，危险也随之倍增。',
          interactions: [
            { id: 'depth_wolf2', label: '狼灵首领', type: 'enemy', targetId: 'forest_wolf' },
            { id: 'depth_golem2', label: '远古石像鬼', type: 'enemy', targetId: 'stone_golem' },
          ],
          south: 'depths_stone_platform',
        },
      },
    },
  },

  // ── 古代神殿遗迹 ──────────────────────────────────────────────────────────────
  temple_ruins: {
    id: 'temple_ruins',
    name: '古代神殿遗迹',
    description: '被岁月侵蚀的石柱静静伫立，地面刻满了无人能解的古老文字。',
    backgroundKey: 'bg_temple',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'temple_outer',
      nodes: {
        temple_outer: {
          id: 'temple_outer',
          name: '神殿前庭',
          description: '被岁月侵蚀的石柱静静伫立，脚下的石板地缝中长出了野草。残破的神像凝视着每一个踏入此地的访客。',
          interactions: [
            { id: 'temple_guard', label: '遗迹守卫者', type: 'enemy', targetId: 'goblin' },
          ],
          north: 'temple_inner',
          east: 'temple_corridor',
          exits: ['village'],
        },
        temple_inner: {
          id: 'temple_inner',
          name: '神殿内室',
          description: '昏暗的内室中，烛台早已熄灭，残破的壁画记录着某段被遗忘的历史。空气中有种让人沉静的奇异气息。',
          interactions: [
            { id: 'temple_mage', label: '哥布林法师', type: 'enemy', targetId: 'goblin_mage' },
          ],
          south: 'temple_outer',
          north: 'temple_altar',
        },
        temple_altar: {
          id: 'temple_altar',
          name: '祭坛深处',
          description: '神殿最深处——幽蓝的泉水在黑暗中静静流淌，水面倒映着不属于当下的画面。这就是传说中的「Lore Well」。',
          interactions: [
            { id: 'temple_lore_well', label: '传说源泉 Lore Well', type: 'building', targetId: 'elder' },
            { id: 'temple_mage2', label: '祭坛守卫', type: 'enemy', targetId: 'goblin_mage' },
          ],
          south: 'temple_inner',
        },
        temple_corridor: {
          id: 'temple_corridor',
          name: '神殿侧廊',
          description: '狭长的石质廊道，地面刻满了无人能解的古老文字。廊道尽头隐约有光芒闪烁，似乎有人在那里留下了什么。',
          interactions: [
            { id: 'temple_corridor_mage', label: '巡逻的法师', type: 'enemy', targetId: 'goblin_mage' },
          ],
          west: 'temple_outer',
        },
      },
    },
  },

  // ── 废弃矿洞 ─────────────────────────────────────────────────────────────────
  mine_cave: {
    id: 'mine_cave',
    name: '废弃矿洞',
    description: '村子北边的旧矿洞，曾经是繁忙的采矿场，如今只剩危险的怪物和散落的矿石。',
    backgroundKey: 'bg_mine',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'mine_entrance',
      nodes: {
        mine_entrance: {
          id: 'mine_entrance',
          name: '矿洞入口',
          description: '破旧的矿车歪倒在轨道上，木质支撑柱已腐朽大半。洞口透进一丝微光，再往里就彻底黑暗了。',
          interactions: [
            { id: 'mine_spider', label: '洞穴蜘蛛', type: 'enemy', targetId: 'cave_spider' },
          ],
          north: 'mine_deep',
          east: 'mine_ore_vein',
          exits: ['village'],
        },
        mine_deep: {
          id: 'mine_deep',
          name: '矿洞深处',
          description: '越往深处走，空气越是凝滞。黑暗中有什么东西在移动，矿洞的墙壁上留有奇怪的抓痕。',
          interactions: [
            { id: 'mine_goblin', label: '挖矿哥布林', type: 'enemy', targetId: 'goblin' },
            { id: 'mine_spider2', label: '巨型洞穴蜘蛛', type: 'enemy', targetId: 'cave_spider' },
          ],
          south: 'mine_entrance',
        },
        mine_ore_vein: {
          id: 'mine_ore_vein',
          name: '矿脉区',
          description: '岩壁上裸露着锃亮的铁矿脉，但这里也是怪物最活跃的区域——矿石的气味似乎吸引着它们。',
          interactions: [
            { id: 'mine_goblin2', label: '守矿哥布林', type: 'enemy', targetId: 'goblin' },
            { id: 'mine_ore', label: '裸露的矿脉', type: 'item', targetId: 'iron_ore' },
          ],
          west: 'mine_entrance',
        },
      },
    },
  },
}

export const STARTING_LOCATION = 'village'
