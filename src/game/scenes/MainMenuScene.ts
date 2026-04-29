import Phaser from 'phaser'

/**
 * 主菜单背景场景 —— 静态渐变背景
 *
 * 扩展点：
 *  - 添加粒子星空层
 *  - 添加视差背景图层
 *  - 添加 Logo 动画
 */
export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create() {
    const { width, height } = this.scale

    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x1a0a2e, 1)
    bg.fillRect(0, 0, width, height)

    // TODO: 添加星星粒子、光效等动态背景元素
  }
}
