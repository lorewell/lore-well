import * as Phaser from 'phaser'

/**
 * 战斗场景 —— 战斗背景与双方角色展示
 *
 * 扩展点：
 *  - 将占位矩形替换为真实精灵图 / Spine 动画
 *  - 在各 play* 方法中填充真实动画序列
 *  - 添加技能特效层（粒子、闪光等）
 */
export default class CombatScene extends Phaser.Scene {
  /** 敌人占位显示对象，后期替换为 Sprite/Spine */
  private enemyDisplay?: Phaser.GameObjects.Rectangle
  /** 玩家占位显示对象，后期替换为 Sprite/Spine */
  private playerDisplay?: Phaser.GameObjects.Rectangle

  constructor() {
    super({ key: 'CombatScene' })
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0d0510')

    // 占位矩形 —— 后期替换为精灵图
    // 敌人（右侧偏上）
    this.enemyDisplay = this.add.rectangle(
      width * 0.65,
      height * 0.38,
      80,
      80,
      0xcc4466,
    )

    // 玩家（左侧偏下）
    this.playerDisplay = this.add.rectangle(
      width * 0.3,
      height * 0.55,
      60,
      80,
      0x4466ff,
    )

    this.scale.on('resize', (gs: Phaser.Structs.Size) => {
      this.enemyDisplay?.setPosition(gs.width * 0.65, gs.height * 0.38)
      this.playerDisplay?.setPosition(gs.width * 0.3, gs.height * 0.55)
    })
  }

  /**
   * 战斗入场初始化
   * @param enemySpriteKey 敌人资源 key，占位阶段忽略，后期用于加载精灵
   */
  startBattleIntro(_enemySpriteKey: string) {
    // TODO: 用 _enemySpriteKey 加载真实精灵并播放入场动画
  }

  /**
   * 玩家攻击动效 —— 动画完成后调用 onComplete
   * TODO: 填充真实攻击动画序列
   */
  playPlayerAttack(onComplete?: () => void) {
    onComplete?.()
  }

  /**
   * 敌人受击动效
   * TODO: 填充受击抖动/闪烁效果
   */
  playEnemyHit() {
    // stub
  }

  /**
   * 敌人攻击动效 —— 动画完成后调用 onComplete
   * TODO: 填充真实敌人攻击动画
   */
  playEnemyAttack(onComplete?: () => void) {
    onComplete?.()
  }

  /**
   * 胜利演出
   * TODO: 闪光、金色粒子等效果
   */
  playVictory() {
    // stub
  }

  /**
   * 失败演出
   * TODO: 屏幕暗淡、音效等
   */
  playDefeat() {
    // stub
  }
}
