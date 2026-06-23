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

    this.load.on('complete', () => this.scene.start('LocationScene'))
  }

  create() {
    this.createPlaceholderTextures()
    this.scene.start('LocationScene')
  }

  /**
   * 生成带渐变效果的占位纹理，各地点视觉风格各异
   */
  private createPlaceholderTextures() {
    const W = 1280, H = 720

    interface LocDef {
      key: string
      topColor: number
      botColor: number
      label: string
      accentColor: number
    }

    const locations: LocDef[] = [
      { key: 'bg_village',     topColor: 0x1a3520, botColor: 0x0a1c10, label: '落瀑村',   accentColor: 0xffe080 },
      { key: 'bg_forest',      topColor: 0x0c2210, botColor: 0x041008, label: '幽暗森林', accentColor: 0x44cc44 },
      { key: 'bg_forest_deep', topColor: 0x060c18, botColor: 0x020408, label: '森林深处', accentColor: 0x3366dd },
      { key: 'bg_temple',      topColor: 0x180c2c, botColor: 0x080818, label: '古代神殿', accentColor: 0xbb66ff },
      { key: 'bg_mine',        topColor: 0x0c0c14, botColor: 0x040408, label: '废弃矿洞', accentColor: 0xff8844 },
    ]

    for (const loc of locations) {
      if (this.textures.exists(loc.key)) continue

      const rt = this.add.renderTexture(0, 0, W, H)

      // 渐变背景
      const gfx = this.add.graphics()
      gfx.fillGradientStyle(
        loc.topColor, loc.topColor,
        loc.botColor, loc.botColor,
        1,
      )
      gfx.fillRect(0, 0, W, H)
      rt.draw(gfx, 0, 0)
      gfx.destroy()

      // 地平线光带
      const glowGfx = this.add.graphics()
      glowGfx.fillStyle(loc.accentColor, 0.06)
      glowGfx.fillRect(0, H * 0.55, W, H * 0.15)
      rt.draw(glowGfx, 0, 0)
      glowGfx.destroy()

      // 装饰点阵（模拟星/叶/粒子）
      const dotGfx = this.add.graphics()
      dotGfx.fillStyle(loc.accentColor, 0.25)
      for (let i = 0; i < 40; i++) {
        const px = Math.random() * W
        const py = Math.random() * H * 0.75
        const pr = 1 + Math.random() * 2.5
        dotGfx.fillCircle(px, py, pr)
      }
      rt.draw(dotGfx, 0, 0)
      dotGfx.destroy()

      rt.saveTexture(loc.key)
      rt.destroy()
    }

    // 敌人占位纹理 —— 覆盖全部 10 种敌人
    interface EnemyDef { key: string; color: number; shape: 'circle' | 'diamond' | 'hex' }
    const enemies: EnemyDef[] = [
      { key: 'enemy_slime',       color: 0x44cc44, shape: 'circle'  },
      { key: 'enemy_goblin',      color: 0xcc6622, shape: 'diamond' },
      { key: 'enemy_wolf',        color: 0x888899, shape: 'diamond' },
      { key: 'enemy_spider',      color: 0x8844aa, shape: 'hex'     },
      { key: 'enemy_goblin_mage', color: 0xaa44cc, shape: 'diamond' },
      { key: 'enemy_golem',       color: 0x998866, shape: 'hex'     },
      { key: 'enemy_frog',        color: 0x55aa55, shape: 'circle'  },
      { key: 'enemy_vine',        color: 0x336644, shape: 'diamond' },
      { key: 'enemy_treant',      color: 0x554433, shape: 'hex'     },
      { key: 'enemy_bat',         color: 0x666688, shape: 'circle'  },
    ]
    for (const e of enemies) {
      if (this.textures.exists(e.key)) continue
      const g = this.make.graphics({ x: 0, y: 0 })
      g.fillStyle(e.color, 1)
      if (e.shape === 'hex') {
        // 六边形（石像鬼/树灵/蜘蛛等重型怪物）
        const cx = 40, cy = 40, r = 36
        const points: Phaser.Geom.Point[] = []
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2
          points.push(new Phaser.Geom.Point(cx + r * Math.cos(a), cy + r * Math.sin(a)))
        }
        g.fillPoints(points, true)
        g.lineStyle(3, 0xffffff, 0.5)
        g.strokePoints(points, true)
      } else if (e.shape === 'circle') {
        g.fillCircle(40, 40, 38)
        g.lineStyle(3, 0xffffff, 0.5)
        g.strokeCircle(40, 40, 38)
      } else {
        g.fillTriangle(40, 4, 4, 76, 76, 76)
        g.lineStyle(3, 0xffffff, 0.5)
        g.strokeTriangle(40, 4, 4, 76, 76, 76)
      }
      g.generateTexture(e.key, 80, 80)
      g.destroy()
    }
  }
}
