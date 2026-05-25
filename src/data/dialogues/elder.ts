import type { NPC } from '../../types'

export const elderNPC: NPC = {
  id: 'npc_elder',
  name: '艾尔文',
  locationId: 'zone_village',
  subLocationId: 'space_village_elder_home',
  interactionLabel: '长老 艾尔文',
  onOpen: [
    { type: 'activateQuest', questId: 'quest_elder' },
    { type: 'activateQuest', questId: 'quest_forest' },
    { type: 'activateQuest', questId: 'quest_rune_whisper' },
  ],
  dialogues: [
    {
      id: 'greeting',
      text: '你来了，太好了。莉娜跑来告诉我你醒了，我这心里总算放下了。你在昏睡的这几天，我一直悬着心……你现在感觉怎么样？',
      options: [
        { text: '我的记忆全部消失了。', next: 'memory_lost' },
        { text: '村子现在还安全吗？', next: 'village_danger' },
        { text: '村里还有谁值得我去见见？', next: 'village_people' },
        { text: '是你救了我？谢谢你。', next: 'thanks' },
        {
          text: '我有一张残破的地图想请你看看。',
          condition: { type: 'questStatus', questId: 'quest_torn_map', status: ['active', 'completed'] },
          next: 'map_identification',
          action: { type: 'completeObjective', questId: 'quest_torn_map', objectiveId: 'show_map_elder' },
        },
        {
          text: '我查看了村南的废旧传送阵——你知道它为什么失效吗？',
          condition: { type: 'questStatus', questId: 'quest_broken_portal', status: ['active'] },
          next: 'portal_anomaly',
          action: { type: 'completeObjective', questId: 'quest_broken_portal', objectiveId: 'ask_elder_portal' },
        },
      ],
    },
    {
      id: 'thanks',
      text: '举手之劳而已。那天我一早在瀑布边散步，就看见你倒在乱石丛里。不把你带回来，我怎么放得下心呢。你既然来到了落瀑村，这里就是你的家。',
    },
    {
      id: 'memory_lost',
      text: '失忆……这确实令人担忧。不过——身体会记得你曾经历过什么，也许在某个熟悉的场景里，记忆会自己回来。（他顿了顿，像是在斟酌措辞：）我救你的时候……你身上除了一身伤，什么都没有。没有行囊，没有身份证明，甚至连一件能说明你从哪儿来的信物都没有。就好像——你是凭空出现在那片乱石里的。',
      options: [
        { text: '那我接下来该先做什么？', next: 'village_people' },
        { text: '村子现在还安全吗？', next: 'village_danger' },
      ],
    },
    {
      id: 'village_people',
      text: '格雷掌管村务，玛格照顾往来的旅人，梅娜知道村里的消息，托尔则关心武器和矿石。你若打算离开村子，先去和他们聊聊，总不会有坏处。',
      options: [{ text: '我明白了。' }],
    },
    {
      id: 'village_danger',
      text: '自从那位勇者三年前在北方的决战中消失之后……世界就像失去了什么重要的东西。魔物比从前猖獗了许多——森林里的狼群开始靠近村庄边缘，矿洞深处的震动越来越频繁。最让人不安的是哥布林，它们以前只在森林深处出没，最近居然成群结队地在村子外围晃悠。如果勇者还在就好了……但说这些也没有用。我们需要一个勇敢的人去探索古老神殿——那里封印着某种力量，也许能改变目前的局面。我老了，无法亲自前往，但你……我总觉得你不是普通的旅人。',
      options: [
        { text: '告诉我更多关于神殿的事。', next: 'more' },
        { text: '勇者……是什么样的人？', next: 'hero_info' },
        { text: '我想先在村里做些准备。', next: 'prepare_first' },
      ],
    },
    {
      id: 'hero_info',
      text: '一个独自踏上旅途的年轻人，据说手持一把会发光的剑，所到之处魔物退散。三年前去往北方讨伐魔王之核后，就再也没有回来过。有人说他战死了，有人说他被封印在了某个地方……没人知道真相。但他消失之后，世界确实变得越来越危险了。',
      options: [{ text: '……我知道了。' }],
    },
    {
      id: 'prepare_first',
      text: '谨慎是好事。先在村里熟悉路径、备好补给，再去面对外面的危险。落瀑村虽然小，却足够让你重新站稳脚跟。',
    },
    {
      id: 'more',
      text: '传说森林深处的石台匣子里藏着一把古代钥匙，它也许能帮你继续深入神殿。那里封印着某种古老的力量——若你真要去，就先做好准备。',
    },
    {
      id: 'map_identification',
      text: '（他接过地图碎片，眉头先皱后松，眼神渐渐深沉。）……这是……这是帝国时期的制图法，已经至少有七十年了。（他用手指描摹城堡轮廓。）这座建筑我认识——是北方卡尔·斯特莱恩要塞，那位勇者卡尔的封地所在。但这张地图……（他压低声音）……它从哪里来的？',
      options: [
        { text: '是莉娜给我的，说是三年前捡到的。', next: 'map_origin' },
      ],
    },
    {
      id: 'map_origin',
      text: '（他合上地图，沉默片刻。）……三年前，莉娜捡到这张地图——那正好是勇者失踪的那一年。也是你被发现在瀑布边的那一年。（他看向你的眼神有些不同了。）你先把地图留着，我需要仔细查阅一些旧籍。这件事，我们之后再谈。',
    },
    {
      id: 'portal_anomaly',
      text: '（他停顿了一下，语气变得慎重。）那座传送阵……我一直没有主动提它。三年前它失效的夜晚，我整夜没有入睡——空气里有一种奇怪的气味，像是被高温灼烧过的金属和泥土混在一起。那种气味，只有传送阵在超负荷运转时才会出现。它不是坏掉了，它是……被使用了，而且方式极其激烈。使用者付出了极大的代价，或者……根本就没有离开。',
      options: [
        { text: '你觉得使用它的人是谁？', next: 'portal_user' },
      ],
    },
    {
      id: 'portal_user',
      text: '（他闭上眼睛。）……我不知道。但我那个夜晚，在瀑布附近看到了一道光。后来，第二天早晨，我在瀑布边的乱石里找到了你。（他睁开眼，声音很轻。）这件事我一直没有告诉任何人，也没有告诉你——因为我不确定说出来是否对你有帮助。但现在……你应该知道这些。',
    },
  ],
}
