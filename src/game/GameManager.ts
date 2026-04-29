import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import LocationScene from './scenes/LocationScene'
import CombatScene from './scenes/CombatScene'

let instance: Phaser.Game | null = null

/**
 * GameManager —— 管理 Phaser 实例的生命周期，提供操作接口给 React 层
 */
export const GameManager = {
  init(parent: HTMLElement): Phaser.Game {
    if (instance) return instance

    instance = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      backgroundColor: '#0a0a1a',
      scene: [PreloadScene, LocationScene, CombatScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      render: { antialias: true, pixelArt: false },
      audio: { disableWebAudio: false },
    })

    return instance
  },

  destroy() {
    instance?.destroy(true)
    instance = null
  },

  get game(): Phaser.Game | null {
    return instance
  },

  getLocationScene(): LocationScene | undefined {
    return instance?.scene.getScene('LocationScene') as LocationScene | undefined
  },

  getCombatScene(): CombatScene | undefined {
    return instance?.scene.getScene('CombatScene') as CombatScene | undefined
  },

  /** 切换地点背景 */
  changeLocation(bgKey: string) {
    this.getLocationScene()?.changeLocation(bgKey)
  },

  /** 切入战斗模式（激活 CombatScene，暂停 LocationScene） */
  enterCombat(enemySpriteKey: string) {
    const combat = this.getCombatScene()
    const location = this.getLocationScene()
    if (!combat || !location) return

    instance?.scene.pause('LocationScene')
    if (!instance?.scene.isActive('CombatScene')) {
      instance?.scene.start('CombatScene')
      // 等一帧再调用入场动效
      setTimeout(() => combat.startBattleIntro(enemySpriteKey), 100)
    } else {
      combat.startBattleIntro(enemySpriteKey)
    }
  },

  /** 退出战斗模式，恢复地点场景 */
  exitCombat() {
    instance?.scene.resume('LocationScene')
    instance?.scene.stop('CombatScene')
  },

  /** 玩家攻击动效 */
  playPlayerAttack(cb?: () => void) {
    this.getCombatScene()?.playPlayerAttack(cb)
  },

  /** 敌人受击 */
  playEnemyHit() {
    this.getCombatScene()?.playEnemyHit()
  },

  /** 敌人攻击动效 */
  playEnemyAttack(cb?: () => void) {
    this.getCombatScene()?.playEnemyAttack(cb)
  },

  playVictory() {
    this.getCombatScene()?.playVictory()
  },

  playDefeat() {
    this.getCombatScene()?.playDefeat()
  },
}
