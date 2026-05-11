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
          description: '一道银白色的瀑布从山间石缝倾泻而下，水声如鼓，雾气弥漫。就是在这片乱石丛中，艾尔文老人发现了昏迷的你。瀑布底部积成一汪清潭，透可见底。',
          interactions: [
            { id: 'village_waterfall_npc', label: '凝视瀑布', type: 'building', targetId: 'waterfall' },
            { id: 'waterfall_pool_bathe', label: '在水池中沐浴', type: 'building', targetId: 'waterfall_pool' },
            { id: 'waterfall_pool_ring', label: '探查水底', type: 'npc', targetId: 'waterfall_ring_event' },
          ],
          south: 'village_elder_home',
        },
        village_elder_home: {
          id: 'village_elder_home',
          name: '艾尔文的家',
          description: '一栋朴素而整洁的石屋，窗台上摆着几本泛黄的古籍。长老艾尔文在此居住了数十年，守护着有关神殿的秘密。',
          interactions: [
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

            { id: 'village_chief_map', label: '墙上地图', type: 'building', targetId: 'chief_map' },
          ],
          east: 'village_elder_home',
        },
        village_outskirts: {
          id: 'village_outskirts',
          name: '村子外围',
          description: '村庄边缘的开阔地带，木栅栏已有几处腐朽倒塌。近来哥布林频繁在此出没，村民们对此忧心忡忡。',
          interactions: [
            { id: 'village_slime', label: '附近的哥布林', type: 'enemy', targetId: 'goblin' },
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
          exits: ['forest', 'temple_ruins'],
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

  // ── 幽暗森林（含废弃矿洞与深林秘境） ─────────────────────────────────────────
  forest: {
    id: 'forest',
    name: '幽暗森林',
    description: '树冠将天光隔绝，终年弥漫着腐叶与霉苔的气息。向北可以深入幽魂古林，向东则通往废弃矿洞。',
    backgroundKey: 'bg_forest',
    exits: [],
    interactions: [],
    subMap: {
      startNodeId: 'ash_valley_gate',
      nodes: {

        // ── 森林浅层 ──────────────────────────────────────────────────────────
        ash_valley_gate: {
          id: 'ash_valley_gate',
          name: '灰烬谷口',
          description: '曾经有村民在此地焚烧荆棘开路，留下一片烧焦的地面和半截倒木。哥布林频繁出没，猎人们已经多日未踏足此处。',
          interactions: [
            { id: 'gate_goblin_patrol', label: '哥布林巡逻队', type: 'enemy', targetId: 'goblin' },
            { id: 'gate_charred_sign', label: '烧焦的路牌', type: 'building', targetId: 'ash_valley_sign' },
          ],
          north: 'ruined_camp',
          east: 'rusty_mine_road',
          west: 'bone_marsh',
          exits: ['village'],
        },

        bone_marsh: {
          id: 'bone_marsh',
          name: '折骨沼',
          description: '泥泞的低洼地带，野兽的骨骸半陷在黑泥里，空气中有淡淡的硫磺味。哥布林常在灌木后伏击路人。',
          interactions: [
            { id: 'marsh_goblin_ambush', label: '伏击的哥布林', type: 'enemy', targetId: 'goblin' },
            { id: 'marsh_old_pack',     label: '泥中的行囊',   type: 'item',   targetId: 'health_potion' },
          ],
          east: 'ash_valley_gate',
        },

        ruined_camp: {
          id: 'ruined_camp',
          name: '残营废地',
          description: '一处被遗弃的猎人营地。帐篷架已经垮塌，锅里还残留着凝固的黑焦。周围的树上有被利爪刨过的深痕，狼群显然把这里当成了领地。',
          interactions: [
            { id: 'camp_wolf_pack',    label: '侵占营地的狼群', type: 'enemy',    targetId: 'forest_wolf' },
            { id: 'camp_hunter_notes', label: '猎人的残页',     type: 'building', targetId: 'hunter_notes' },
            { id: 'camp_hunter_toby',  label: '受伤的猎人',     type: 'npc',      targetId: 'hunter_toby' },
          ],
          south: 'ash_valley_gate',
          north: 'misty_forest_path',
        },

        // ── 森林深处 ──────────────────────────────────────────────────────────
        misty_forest_path: {
          id: 'misty_forest_path',
          name: '乌雾林道',
          description: '浓稠的雾气从地面升腾，将视线压缩至数步之内。脚踩在湿软的腐叶上几乎没有声音，但你能感觉到有什么东西在雾中跟随着你。',
          interactions: [
            { id: 'misty_wolf_spirit', label: '缠绕的狼灵', type: 'enemy', targetId: 'forest_wolf' },
            { id: 'misty_stone_mark',  label: '刻字的界石', type: 'building', targetId: 'boundary_stone' },
          ],
          south: 'ruined_camp',
          west: 'broken_moon_altar',
        },

        broken_moon_altar: {
          id: 'broken_moon_altar',
          name: '碎月祭台',
          description: '一座古老的圆形祭台静立于林间空地，台面被某种巨力从中劈裂，半块台石沉入土中。石像鬼守候两侧，仿佛在等待某个永远不会到来的仪式。',
          interactions: [
            { id: 'altar_golem_guard', label: '祭台守卫',   type: 'enemy', targetId: 'stone_golem' },
            { id: 'altar_iron_coffer', label: '祭台铁匣',   type: 'item',  targetId: 'ancient_key' },
          ],
          east: 'misty_forest_path',
          north: 'ghost_grove',
        },

        ghost_grove: {
          id: 'ghost_grove',
          name: '幽魂古林',
          description: '参天古木的树干比马车还宽，根系盘结成拱门般的形状。这里几乎没有任何声音，连风都静止了——据说第一批进入此地的人，再也没有走出来。',
          interactions: [
            { id: 'grove_wolf_alpha',  label: '狼灵首领',   type: 'enemy', targetId: 'forest_wolf' },
            { id: 'grove_elder_golem', label: '远古石像鬼', type: 'enemy', targetId: 'stone_golem' },
            { id: 'grove_rune_tree',   label: '符文古树',   type: 'building', targetId: 'rune_tree' },
          ],
          south: 'broken_moon_altar',
        },

        // ── 废弃矿洞 ──────────────────────────────────────────────────────────
        rusty_mine_road: {
          id: 'rusty_mine_road',
          name: '锈齿矿道',
          description: '铁轨已经锈蚀成橘红色，矿车脱轨翻倒在一侧。支撑横梁吱呀作响，偶尔有碎石从顶部坠落。洞穴蜘蛛在角落里编织着厚重的蛛网。',
          interactions: [
            { id: 'mine_road_spider',  label: '守道蜘蛛',   type: 'enemy',    targetId: 'cave_spider' },
            { id: 'mine_road_placard', label: '警示木牌',   type: 'building', targetId: 'mine_warning' },
          ],
          west:  'ash_valley_gate',
          east:  'dark_vein_wall',
          north: 'mine_pit',
        },

        mine_pit: {
          id: 'mine_pit',
          name: '矿壁深坑',
          description: '矿道尽头的地面塌陷成一个深坑，坑底隐约可见幽蓝的荧光。哥布林聚集在此，他们似乎找到了什么值得守护的东西。',
          interactions: [
            { id: 'pit_goblin_miner',  label: '挖坑的哥布林', type: 'enemy', targetId: 'goblin' },
            { id: 'pit_cave_spider',   label: '巨蛛',         type: 'enemy', targetId: 'cave_spider' },
          ],
          south: 'rusty_mine_road',
        },

        dark_vein_wall: {
          id: 'dark_vein_wall',
          name: '黑脉矿壁',
          description: '岩壁深处裸露出一道粗大的铁矿脉，在火把光下泛着冷金属光泽。附近散落着被遗弃的镐头和空矿车——上一批矿工走得很匆忙。',
          interactions: [
            { id: 'vein_goblin_guard', label: '守矿哥布林', type: 'enemy',    targetId: 'goblin' },
            { id: 'vein_iron_ore',     label: '裸露的矿脉', type: 'item',     targetId: 'iron_ore' },
          ],
          west: 'rusty_mine_road',
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
}

export const STARTING_LOCATION = 'village'
