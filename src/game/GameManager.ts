import * as Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import LocationScene from './scenes/LocationScene'
import CombatScene from './scenes/CombatScene'
import { SoundManager } from './SoundManager'

let instance: Phaser.Game | null = null

/**
 * GameManager —— 管理 Phaser 实例的生命周期，提供操作接口给 React 层
 * 集成了 SoundManager 音效系统
 */
export const GameManager = {
  init(parent: HTMLElement): Phaser.Game {
    if (instance) {
      // 检测父节点是否已更换；若是则销毁旧实例再重建
      if (instance.canvas?.parentElement === parent) return instance
      this.destroy()
    }

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
    SoundManager.close()
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

  /** 切换地点背景并播放脚步音效 */
  changeLocation(bgKey: string) {
    this.getLocationScene()?.changeLocation(bgKey)
    SoundManager.play('step')
  },

  /** 切入战斗模式（激活 CombatScene，暂停 LocationScene） */
  enterCombat(enemySpriteKey: string) {
    const combat = this.getCombatScene()
    const location = this.getLocationScene()
    if (!combat || !location) return

    if (instance?.scene.isActive('LocationScene')) {
      instance?.scene.pause('LocationScene')
    }
    if (!instance?.scene.isActive('CombatScene')) {
      instance?.scene.start('CombatScene')
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

  /** 玩家攻击动效 + 音效 */
  playPlayerAttack(cb?: () => void) {
    SoundManager.play('attack')
    this.getCombatScene()?.playPlayerAttack(() => {
      SoundManager.play('hit')
      this.getCombatScene()?.playEnemyHit()
      cb?.()
    })
  },

  /** 技能攻击动效 + 音效 */
  playSkillAttack(cb?: () => void) {
    SoundManager.play('skill')
    this.getCombatScene()?.playPlayerAttack(() => {
      SoundManager.play('hit')
      this.getCombatScene()?.playEnemyHit()
      cb?.()
    })
  },

  /** 敌人受击（仅视觉，音效由 playPlayerAttack 统一驱动） */
  playEnemyHit() {
    this.getCombatScene()?.playEnemyHit()
  },

  /** 敌人攻击动效 + 音效 */
  playEnemyAttack(cb?: () => void) {
    SoundManager.play('attack')
    this.getCombatScene()?.playEnemyAttack(cb)
  },

  playVictory() {
    SoundManager.play('victory')
    this.getCombatScene()?.playVictory()
  },

  playDefeat() {
    SoundManager.play('defeat')
    this.getCombatScene()?.playDefeat()
  },

  /** 升级音效 */
  playLevelUp() {
    SoundManager.play('levelup')
  },

  /** 金币/购买音效 */
  playCoin() {
    SoundManager.play('coin')
  },

  /** 逃跑音效 */
  playFlee() {
    SoundManager.play('flee')
  },

  /** 治疗音效 */
  playHeal() {
    SoundManager.play('heal')
  },

  /** UI 点击音效 */
  playClick() {
    SoundManager.play('click')
  },

  /** 开启面板音效 */
  playOpen() {
    SoundManager.play('open')
  },

  /**
   * 事件驱动的场景就绪回调：当 LocationScene 进入 active 状态后立即调用 cb，
   * 替代 setTimeout 轮询方案，避免竞态与多次调用问题。
   */
  onceLocationReady(cb: () => void) {
    if (!instance) return
    // 如果场景已就绪，直接调用
    const scene = this.getLocationScene()
    if (scene?.sys.isActive()) { cb(); return }
    // 否则每帧检测一次（step 在 Phaser 渲染循环中每帧触发）
    const onStep = () => {
      if (this.getLocationScene()?.sys.isActive()) {
        instance!.events.off('step', onStep)
        cb()
      }
    }
    instance.events.on('step', onStep)
  },

  /** 预热音频上下文（需在用户首次交互时调用） */
  resumeAudio() {
    SoundManager.resume()
  },

  /** 音效音量控制 0-1 */
  setSfxVolume(v: number) {
    SoundManager.setVolume(v)
  },

  /** 静音切换 */
  toggleMute(): boolean {
    return SoundManager.toggleMute()
  },

  get sfxMuted(): boolean {
    return SoundManager.muted
  },

  /** 导出 SoundManager 供 React 组件直接访问 */
  get sound() {
    return SoundManager
  },
}
