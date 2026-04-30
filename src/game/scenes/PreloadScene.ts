import * as Phaser from 'phaser'

/**
 * 预加载场景 —— 生成占位纹理并启动地点场景
 *
 * 扩展点：
 *  - 在 preload() 中用 this.load.image / this.load.atlas 加载真实资源
 *  - 占位纹理生成逻辑可在资源就绪后直接删除
 */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // TODO: 加载真实资源，例如：
    // this.load.image('bg_village', 'assets/bg/village.jpg')
    // this.load.atlas('characters', 'assets/characters.png', 'assets/characters.json')

    // 当前使用生成的占位纹理，无需异步加载
    // load.on('complete') 在没有任何 load 任务时会同步触发
    this.load.on('complete', () => this.scene.start('LocationScene'))
  }

  create() {
    // preload 完成后 create 被调用，此处生成所有占位纹理
    this.createPlaceholderTextures()
    // 手动触发 complete（因为没有任何实际 load 任务）
    this.scene.start('LocationScene')
  }

  /**
   * 生成纯色占位纹理
   * 真实资源就绪后删除此方法，并在 preload() 中加载图片
   */
  private createPlaceholderTextures() {
    const locations: Array<{ key: string; color: number; label: string }> = [
      { key: 'bg_village',     color: 0x1a3a1a, label: '晨曦村' },
      { key: 'bg_forest',      color: 0x0a1a0a, label: '幽暗森林' },
      { key: 'bg_forest_deep', color: 0x050a05, label: '森林深处' },
      { key: 'bg_temple',      color: 0x1a1020, label: '古代神殿' },
      { key: 'bg_mine',        color: 0x0a0a0f, label: '废弃矿洞' },
    ]

    for (const loc of locations) {
      if (this.textures.exists(loc.key)) continue
      const gfx = this.make.graphics({ x: 0, y: 0 })
      gfx.fillStyle(loc.color, 1)
      gfx.fillRect(0, 0, 1280, 720)
      // 地点名称水印，方便开发期间辨认
      gfx.generateTexture(loc.key, 1280, 720)
      gfx.destroy()

      // 在纹理上叠加文字（开发用）
      this.add
        .text(640, 360, loc.label, {
          fontSize: '48px',
          color: '#ffffff',
        })
        .setAlpha(0.08)
        .setOrigin(0.5)
        .setVisible(false) // 只用于标记，不显示到场景中
    }

    // 敌人占位纹理（后期替换为精灵图集）
    const enemies: Array<{ key: string; color: number }> = [
      { key: 'enemy_slime',  color: 0x44aa44 },
      { key: 'enemy_goblin', color: 0xaa6622 },
      { key: 'enemy_wolf',   color: 0x888888 },
    ]
    for (const e of enemies) {
      if (this.textures.exists(e.key)) continue
      const g = this.make.graphics({ x: 0, y: 0 })
      g.fillStyle(e.color, 1)
      g.fillCircle(40, 40, 40)
      g.generateTexture(e.key, 80, 80)
      g.destroy()
    }
  }
}
