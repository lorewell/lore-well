import type { NPC } from '../../types'

// ── 隐秘瀑布（场景描述）──────────────────────────────────────────────────────
export const waterfallNPC: NPC = {
  id: 'point_waterfall',
  name: '隐秘瀑布',
  dialogues: [
    {
      id: 'greeting',
      text: '一道银白色的瀑布从山间石缝中倾泻而下，水声如鼓，雾气弥漫。据村民所说，就是在这片乱石丛中，艾尔文老人发现了昏迷的你……脚下的苔藓，飞溅的水珠，一切都显得如此熟悉，却又想不起任何记忆。',
      options: [
        { text: '凝视瀑布，尝试回忆。', next: 'memory' },
        { text: '查看乱石间的痕迹。', next: 'tracks' },
      ],
    },
    {
      id: 'memory',
      text: '水雾中，一幅幅破碎的画面一闪而过——黑色的尖塔，漫天的战火，还有无数模糊的面孔……随即又消散殆尽。也许，答案就藏在某处等待着你。',
    },
    {
      id: 'tracks',
      text: '湿滑的石面上早已看不清当日留下的痕迹，只剩几道被拖拽过的浅印，一直通向村子的方向。有人确实把你从这里背了回去。',
    },
  ],
}

// ── 瀑布水池（可重复沐浴）────────────────────────────────────────────────────
export const waterfallPoolNPC: NPC = {
  id: 'point_waterfall_pool',
  name: '瀑布水池',
  dialogues: [
    {
      id: 'greeting',
      text: '瀑布底部积成了一汪清潭，水色碧绿，透可见底。雾气在水面轻轻飘散，空气里满是沁人的湿润与清凉。',
      options: [
        {
          text: '脱下外衫，走入水中。',
          next: 'bathe',
          action: { type: 'restoreHpMp' },
        },
        { text: '只是来看看。' },
      ],
    },
    {
      id: 'bathe',
      text: '冰凉的水流没过膝盖，再漫到腰间。山泉从远处带来了某种说不清的清净——连日的疲惫随着水流一点点化开，心神顿时清明了许多。（HP / MP 已全额恢复）',
    },
  ],
}

// ── 瀑布水底戒指（一次性触发）──────────────────────────────────────────────
export const waterfallRingEventNPC: NPC = {
  id: 'point_waterfall_ring_event',
  name: '???',
  onOpen: [
    { type: 'addItem', itemId: 'qitem_mysterious_ring', qty: 1 },
    { type: 'activateQuest', questId: 'quest_ring_origin' },
    { type: 'consumeInteraction', interactionId: 'waterfall_pool_ring' },
  ],
  dialogues: [
    {
      id: 'greeting',
      text: '浸入水中没多久，脚趾意外触碰到了什么坚硬的东西。你俯身摸索，从水底碎石间捡起了一枚戒指——金属冰凉，花纹磨损，却带着一种难以言喻的熟悉感。你盯着它看了很久，什么都想不起来，只有一种几乎被时间淹没的温柔隐约攥着你的心口。',
      options: [
        { text: '仔细端详戒指上的花纹。', next: 'examine' },
        { text: '将戒指收进口袋。', next: 'keep' },
      ],
    },
    {
      id: 'examine',
      text: '花纹是某种藤蔓与星点交织的图案，内圈刻着两个已经磨损到几乎辨不清的字。是名字？是誓言？你无从判断。只有一件事你可以确定——某个人曾经将它放到你手中。',
      options: [{ text: '将戒指收进口袋。', next: 'keep' }],
    },
    {
      id: 'keep',
      text: '你将戒指握紧，感受到掌心某种隐约的重量。也许有一天，它能带你找回什么。（获得「未知的戒指」，支线任务「戒指的秘密」已开启）',
    },
  ],
}
