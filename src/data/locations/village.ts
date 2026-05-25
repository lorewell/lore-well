import type { Location } from '../../types'

export const VILLAGE_LOCATION: Location = {
  id: 'zone_village',
  name: '落瀑村',
  description: '坐落于隐秘瀑布脚下的宁静村庄，世代哺育着这里的居民。',
  backgroundKey: 'bg_village',
  exits: [],
  interactions: [],
  subMap: {
    startNodeId: 'space_village_center',
    nodes: {
      // ── 中心广场（起始节点） ────────────────────────────────────────────────
      space_village_center: {
        id: 'space_village_center',
        name: '中心广场',
        description:
          '落瀑村的中心广场，古老的石井旁老槐树枝叶繁茂。四条路分别通向村子各处，村民们三三两两聚集于此低声谈论。',
        interactions: [
          { id: 'village_center_well',   label: '古老石井', type: 'building', targetId: 'point_village_well' },
          { id: 'village_center_notice', label: '告示板',   type: 'building', targetId: 'point_village_notice_board' },
        ],
        north: 'space_village_elder_home',
        west:  'space_village_inn',
        east:  'space_village_blacksmith',
        south: 'space_village_south_gate',
      },

      // ── 北部：瀑布 → 艾尔文的家 → (西)村长之屋 (东)村子外围 ──────────────
      space_village_waterfall: {
        id: 'space_village_waterfall',
        name: '隐秘瀑布',
        description:
          '一道银白色的瀑布从山间石缝倾泻而下，水声如鼓，雾气弥漫。就是在这片乱石丛中，艾尔文老人发现了昏迷的你。瀑布底部积成一汪清潭，透可见底。',
        interactions: [
          { id: 'village_waterfall_npc',  label: '凝视瀑布',    type: 'building', targetId: 'point_waterfall' },
          { id: 'waterfall_pool_bathe',   label: '在水池中沐浴', type: 'building', targetId: 'point_waterfall_pool' },
          { id: 'waterfall_pool_ring',    label: '探查水底',    type: 'npc',      targetId: 'point_waterfall_ring_event' },          { id: 'waterfall_humphrey',     label: '老渔夫 汉弗',  type: 'npc',      targetId: 'npc_ring_mystery_contact' },        ],
        south: 'space_village_elder_home',
      },
      space_village_elder_home: {
        id: 'space_village_elder_home',
        name: '艾尔文的家',
        description:
          '一栋朴素而整洁的石屋，窗台上摆着几本泛黄的古籍。长老艾尔文在此居住了数十年，守护着有关神殿的秘密。',
        interactions: [
          { id: 'village_elder_bookshelf', label: '旧书架', type: 'building', targetId: 'point_elder_bookshelf' },
        ],
        north: 'space_village_waterfall',
        west:  'space_village_chief_home',
        east:  'space_village_outskirts',
        south: 'space_village_center',
      },
      space_village_chief_home: {
        id: 'space_village_chief_home',
        name: '村长之屋',
        description:
          '木质门梁上刻着格雷家族的徽记，厚重的橡木门显示出主人的地位。屋内透出暖黄的烛光，村长正在里面处理村务。',
        interactions: [
          { id: 'village_chief_map', label: '墙上地图', type: 'building', targetId: 'point_chief_map' },
        ],
        east: 'space_village_elder_home',
      },
      space_village_outskirts: {
        id: 'space_village_outskirts',
        name: '村子外围',
        description:
          '村庄边缘的开阔地带，木栅栏已有几处腐朽倒塌。近来哥布林频繁在此出没，村民们对此忧心忡忡。',
        interactions: [
          { id: 'village_slime',          label: '附近的哥布林', type: 'enemy',    targetId: 'mob_goblin' },
          { id: 'village_outskirts_fence', label: '破损栅栏',    type: 'building', targetId: 'point_outskirts_fence' },
        ],
        west: 'space_village_elder_home',
      },

      // ── 西：暮光客栈 ────────────────────────────────────────────────────────
      space_village_inn: {
        id: 'space_village_inn',
        name: '暮光客栈',
        description:
          '村里唯一的客栈——你醒来时就在这里。炉火的气息和玛格爽朗的笑声混在一起，令人安心。小莉娜常在此处帮忙。',
        interactions: [
          { id: 'village_inn_hearth',  label: '壁炉',         type: 'building', targetId: 'point_inn_hearth' },
          { id: 'village_inn_voss',    label: '旅行商人 奥斯', type: 'npc',      targetId: 'npc_merchant_voss' },
        ],
        east: 'space_village_center',
      },

      // ── 东：铁匠铺 → (南)杂货铺 ──────────────────────────────────────────
      space_village_blacksmith: {
        id: 'space_village_blacksmith',
        name: '铁匠铺',
        description:
          '叮叮当当的锤击声从铁匠铺里传出，炉膛里的火焰映红了托尔的脸。武器和护甲整齐地挂在墙上，等待着有缘人。',
        interactions: [
          { id: 'village_smith_anvil', label: '铁砧', type: 'building', targetId: 'point_smith_anvil' },
        ],
        west:  'space_village_center',
        south: 'space_village_grocer',
      },
      space_village_grocer: {
        id: 'space_village_grocer',
        name: '杂货铺',
        description:
          '梅娜那间摆满各色杂货的小铺子，药草、绳索、干粮堆得满满当当。老板娘总能第一时间打听到村里的消息。',
        interactions: [
          { id: 'village_grocer_herbs', label: '草药架', type: 'building', targetId: 'point_grocer_herbs' },
        ],
        north: 'space_village_blacksmith',
      },

      // ── 南：出口节点 → 废旧传送阵 ────────────────────────────────────────
      space_village_south_gate: {
        id: 'space_village_south_gate',
        name: '村南路口',
        description:
          '通往村外的岔路口，一块风化的路标立在道旁，指向远方不同的方向。村庄的喧嚣在此渐渐淡去。',
        interactions: [
          { id: 'village_south_signpost', label: '风化路牌', type: 'building', targetId: 'point_south_signpost' },
        ],
        north:  'space_village_center',
        south:  'space_village_portal',
        exits: ['zone_forest', 'zone_temple_ruins'],
      },
      space_village_portal: {
        id: 'space_village_portal',
        name: '废旧传送阵',
        description:
          '石台中央刻满了密密麻麻的古老符文，地面留有烧焦的痕迹。曾经，这里能将人瞬间送往遥远的地方——但那已是遥远的过去。',
        interactions: [
          { id: 'village_portal_inspect', label: '废旧传送阵', type: 'npc', targetId: 'point_broken_portal' },
        ],
        north: 'space_village_south_gate',
      },
    },
  },
}
