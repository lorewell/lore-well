import type { NPC } from '../../types'

export const villageChiefNPC: NPC = {
  id: 'npc_village_chief',
  name: '村长 格雷',
  locationId: 'zone_village',
  subLocationId: 'space_village_chief_home',
  interactionLabel: '村长 格雷',
  dialogues: [
    {
      id: 'greeting',
      text: '你就是艾尔文从瀑布边救回来的那个旅人？你总算醒了。艾尔文刚刚还在这里，商量完事情便回他家去了——他让我转告你，说有重要的事情想告诉你，让你去找他。',
      options: [
        { text: '村子最近出了什么事？', next: 'trouble' },
        { text: '我能帮上什么忙吗？', next: 'help' },
        { text: '村子里都有哪些地方？', next: 'directions' },
        { text: '你们发现我时是什么情况？', next: 'rescue_report' },
        { text: '好，我去找艾尔文。谢谢村长。', next: 'chief_farewell' },        {
          text: '我想领一个巡逐的任务。',
          next: 'patrol_quest_start',
          action: { type: 'activateQuest', questId: 'quest_chief_patrol' },
        },
        {
          text: '栮木森林已经确认安全了。',
          condition: { type: 'questStatus', questId: 'quest_forest', status: ['completed'] },
          next: 'forest_cleared',
          action: { type: 'activateQuest', questId: 'quest_goblin_conspiracy' },
        },
        {
          text: '坑南的传送阵——我想了解它的来历。',
          condition: { type: 'questStatus', questId: 'quest_broken_portal', status: ['active'] },
          next: 'portal_history',
          action: { type: 'completeObjective', questId: 'quest_broken_portal', objectiveId: 'ask_chief_portal' },
        },      ],
    },
    {
      id: 'chief_farewell',
      text: '保重，有事随时来找我。艾尔文的家就在我这往东走，那栋摆着古籍的石屋就是。',
    },
    {
      id: 'trouble',
      text: '自从勇者三年前消失之后，外面的世界就不太平了。矿洞那边有村民失踪，森林边缘每到夜晚都有怪响——而且不只是狼。哥布林的数量明显变多了，以前它们只在森林深处躲着，最近居然敢大白天在林子边上巡逻，好像在找什么似的。更奇怪的是神殿方向偶尔会有诡异的光。我已经让大伙儿天黑后不许出门了，可这终究不是办法。',
      options: [
        { text: '我会调查这件事的。', next: 'grateful' },
        { text: '听起来很危险……' },
      ],
    },
    {
      id: 'help',
      text: '如果你真的愿意帮忙，就先在村里认认人。玛格照看客栈，梅娜消息最灵，托尔虽然嘴硬，但打交道实在。去和他们聊聊，对你有好处。',
    },
    {
      id: 'directions',
      text: '中心广场往西是暮光客栈，往东是铁匠铺和杂货铺，往北能找到我和艾尔文的屋子，南路口则通往村外。要是怕记不住，看看我墙上那张地图也行。',
    },
    {
      id: 'rescue_report',
      text: '艾尔文把你带回来后，村里的人轮流照看了你两夜。谁也说不清你从哪儿来，但既然你在落瀑村醒了，我们就不会把你丢下不管。',
    },
    {
      id: 'grateful',
      text: '如果你真的查清楚了，我代表全村感谢你。尤其是那些哥布林……如果能找到它们的巢穴或者头目就更好了。去找艾尔文，他知道的比我多。保重。',
    },
    {
      id: 'patrol_quest_start',
      text: '好，我把任务写下来。你需要先检查村外围逃损的栊栏，有情况就抨再被永。然后清兼一下附近带路的哥布林，确认村界安全。有任务奖励，不会让你白跳的。',
    },
    {
      id: 'forest_cleared',
      text: '等等，深林被清理干净了？（他展开地图，表情却没有没有全然放松。）。这是好事，但……我展年在村子里，了解这些哥布林。它们以前根本不需要一个预邪法师就能掌控攻组。如果有高级存在的话……我不希望这山有肯这个客。下次去森林，多留心。',
    },
    {
      id: 'portal_history',
      text: '传送阵……三年前它就就像被什么东西打区了一样，整个碎揉。那天夜里有巨大的声响，我以为限雷——第二天去看才知道它就这样了。模也没有被损，碎的是里面的连接符文。艾尔文说需要相应等级的魔導才能修复，但我觉得这不是资源缺乏的问题——它根本就不应该会出现这种情况。',
    },
  ],
}
