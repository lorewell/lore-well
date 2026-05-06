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
        // ── 中心广场（起始节点） ──────────────────────────────────────────────
        village_center: {
          id: 'village_center',
          name: '中心广场',
          description: '落瀑村的中心广场，古老的石井旁老槐树枝叶繁茂。四条路分别通向村子各处，村民们三三两两聚集于此低声谈论。',
          interactions: [
            { id: 'village_center_well', label: '古老石井', type: 'building', targetId: 'village_well' },
            { id: 'village_center_notice', label: '告示板', type: 'building', targetId: 'village_notice_board' },
          ],
          north: 'village_elder_home',
          west:  'village_inn',
          east:  'village_blacksmith',
          south: 'village_south_gate',
        },

        // ── 北部：瀑布 → 艾尔文的家 → (西)村长之屋 (东)村子外围 ──────────────
        village_waterfall: {
          id: 'village_waterfall',
          name: '隐秘瀑布',
          description: '一道银白色的瀑布从山间石缝倾泻而下，水声如鼓，雾气弥漫。就是在这片乱石丛中，艾尔文老人发现了昏迷的你。',
          interactions: [
            { id: 'village_waterfall_npc', label: '凝视瀑布', type: 'building', targetId: 'waterfall' },
          ],
          south: 'village_elder_home',
        },
        village_elder_home: {
          id: 'village_elder_home',
          name: '艾尔文的家',
          description: '一栋朴素而整洁的石屋，窗台上摆着几本泛黄的古籍。长老艾尔文在此居住了数十年，守护着有关神殿的秘密。',
          interactions: [
            { id: 'village_elder', label: '长老 艾尔文', type: 'npc', targetId: 'elder' },
            { id: 'village_elder_bookshelf', label: '旧书架', type: 'building', targetId: 'elder_bookshelf' },
          ],
          north: 'village_waterfall',
          west:  'village_chief_home',
          east:  'village_outskirts',
          south: 'village_center',
        },
        village_chief_home: {
          id: 'village_chief_home',
          name: '村长之屋',
          description: '木质门梁上刻着格雷家族的徽记，厚重的橡木门显示出主人的地位。屋内透出暖黄的烛光，村长正在里面处理村务。',
          interactions: [
            { id: 'village_chief_npc', label: '村长 格雷', type: 'npc', targetId: 'village_chief' },
            { id: 'village_chief_map', label: '墙上地图', type: 'building', targetId: 'chief_map' },
          ],
          east: 'village_elder_home',
        },
        village_outskirts: {
          id: 'village_outskirts',
          name: '村子外围',
          description: '村庄边缘的开阔地带，木栅栏已有几处腐朽倒塌。近来史莱姆频繁在此出没，村民们对此忧心忡忡。',
          interactions: [
            { id: 'village_slime', label: '附近的史莱姆', type: 'enemy', targetId: 'slime' },
            { id: 'village_outskirts_fence', label: '破损栅栏', type: 'building', targetId: 'outskirts_fence' },
          ],
          west: 'village_elder_home',
        },

        // ── 西：暮光客栈 ──────────────────────────────────────────────────────
        village_inn: {
          id: 'village_inn',
          name: '暮光客栈',
          description: '村里唯一的客栈——你醒来时就在这里。炉火的气息和玛格爽朗的笑声混在一起，令人安心。小莉娜常在此处帮忙。',
          interactions: [
            { id: 'village_inn_npc', label: '老板娘 玛格', type: 'npc', targetId: 'innkeeper' },
            { id: 'village_inn_lina', label: '小莉娜', type: 'npc', targetId: 'lina' },
            { id: 'village_inn_hearth', label: '壁炉', type: 'building', targetId: 'inn_hearth' },
          ],
          east: 'village_center',
        },

        // ── 东：铁匠铺 → (南)杂货铺 ────────────────────────────────────────
        village_blacksmith: {
          id: 'village_blacksmith',
          name: '铁匠铺',
          description: '叮叮当当的锤击声从铁匠铺里传出，炉膛里的火焰映红了托尔的脸。武器和护甲整齐地挂在墙上，等待着有缘人。',
          interactions: [
            { id: 'village_smith_npc', label: '铁匠 托尔', type: 'npc', targetId: 'blacksmith' },
            { id: 'village_smith_anvil', label: '铁砧', type: 'building', targetId: 'smith_anvil' },
          ],
          west:  'village_center',
          south: 'village_grocer',
        },
        village_grocer: {
          id: 'village_grocer',
          name: '杂货铺',
          description: '梅娜那间摆满各色杂货的小铺子，药草、绳索、干粮堆得满满当当。老板娘总能第一时间打听到村里的消息。',
          interactions: [
            { id: 'village_grocer_npc', label: '杂货商 梅娜', type: 'npc', targetId: 'grocer' },
            { id: 'village_grocer_herbs', label: '草药架', type: 'building', targetId: 'grocer_herbs' },
          ],
          north: 'village_blacksmith',
        },

        // ── 南：出口节点 → 废旧传送阵 ──────────────────────────────────────
        village_south_gate: {
          id: 'village_south_gate',
          name: '村南路口',
          description: '通往村外的岔路口，一块风化的路标立在道旁，指向远方不同的方向。村庄的喧嚣在此渐渐淡去。',
          interactions: [
            { id: 'village_south_signpost', label: '风化路牌', type: 'building', targetId: 'south_signpost' },
          ],
          north:  'village_center',
          south:  'village_portal',
          exits: ['forest', 'temple_ruins', 'mine_cave'],
        },
        village_portal: {
          id: 'village_portal',
          name: '废旧传送阵',
          description: '石台中央刻满了密密麻麻的古老符文，地面留有烧焦的痕迹。曾经，这里能将人瞬间送往遥远的地方——但那已是遥远的过去。',
          interactions: [
            {
              id: 'village_portal_interact',
              label: '废旧传送阵',
              type: 'portal',
              targetId: '',
              disabled: true,
            },
          ],
          north: 'village_south_gate',
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
