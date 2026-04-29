import * as Phaser from 'phaser'

/**
 * 地点场景 —— 显示当前地点背景图
 *
 * 扩展点：
 *  - create() 中可添加环境粒子层、天气效果、视差滚动层
 *  - changeLocation() 中可替换过渡动画类型（如滑入、溶解等）
 */
export default class LocationScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image
  private currentLocationKey = ''
  private transitionTween?: Phaser.Tweens.Tween

  constructor() {
    super({ key: 'LocationScene' })
  }

  create() {
    const { width, height } = this.scale

    this.bgImage = this.add
      .image(width / 2, height / 2, 'bg_village')
      .setDisplaySize(width, height)

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.bgImage
        ?.setPosition(gameSize.width / 2, gameSize.height / 2)
        .setDisplaySize(gameSize.width, gameSize.height)
    })
  }

  /**
   * 切换地点背景（淡入淡出过渡）
   * TODO: 可在此添加更丰富的过渡效果
   */
  changeLocation(bgKey: string) {
    if (bgKey === this.currentLocationKey) return
    this.currentLocationKey = bgKey

    this.transitionTween?.stop()
    this.transitionTween = this.tweens.add({
      targets: this.bgImage,
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.bgImage?.setTexture(bgKey)
        this.tweens.add({ targets: this.bgImage, alpha: 1, duration: 300 })
      },
    })
  }
}
