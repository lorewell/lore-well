import * as Phaser from 'phaser'

/** 各地点的粒子配置 */
interface ParticleConfig {
  count: number
  color: number
  minSize: number
  maxSize: number
  speedX: number   // 水平漂移（可负）
  speedY: number   // 纵向速度（负 = 向上）
  alpha: number
  flicker: boolean // 是否闪烁
}

const LOCATION_PARTICLES: Record<string, ParticleConfig> = {
  bg_village: {
    count: 18, color: 0xffe88a, minSize: 2, maxSize: 4,
    speedX: 0.3, speedY: -0.5, alpha: 0.55, flicker: true,
  },
  bg_forest: {
    count: 22, color: 0x88dd44, minSize: 2, maxSize: 5,
    speedX: 0.6, speedY: 0.4, alpha: 0.45, flicker: false,
  },
  bg_forest_deep: {
    count: 20, color: 0x2244aa, minSize: 2, maxSize: 4,
    speedX: -0.2, speedY: -0.3, alpha: 0.4, flicker: true,
  },
  bg_temple: {
    count: 16, color: 0xcc88ff, minSize: 2, maxSize: 5,
    speedX: 0.15, speedY: -0.6, alpha: 0.5, flicker: true,
  },
  bg_mine: {
    count: 14, color: 0xff8844, minSize: 2, maxSize: 3,
    speedX: 0.8, speedY: -1.2, alpha: 0.6, flicker: false,
  },
}

interface ParticleObj {
  go: Phaser.GameObjects.Arc
  vx: number
  vy: number
  flickerTimer: number
}

/**
 * 地点场景 —— 显示当前地点背景图及环境粒子层
 */
export default class LocationScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image
  private currentLocationKey = ''
  private transitionTween?: Phaser.Tweens.Tween

  // 粒子系统
  private particles: ParticleObj[] = []
  private particleContainer?: Phaser.GameObjects.Container

  // 地点名称水印
  private locationLabel?: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'LocationScene' })
  }

  create() {
    const { width, height } = this.scale

    this.bgImage = this.add
      .image(width / 2, height / 2, 'bg_village')
      .setDisplaySize(width, height)

    this.particleContainer = this.add.container(0, 0)

    // 地点名称（右下角装饰文字）
    this.locationLabel = this.add
      .text(width - 24, height - 24, '', {
        fontSize: '13px',
        color: '#ffffff',
        alpha: 0.25,
      } as Phaser.Types.GameObjects.Text.TextStyle)
      .setAlpha(0.22)
      .setOrigin(1, 1)

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.bgImage
        ?.setPosition(gameSize.width / 2, gameSize.height / 2)
        .setDisplaySize(gameSize.width, gameSize.height)
      this.locationLabel?.setPosition(gameSize.width - 24, gameSize.height - 24)
    })

    // 初始化村庄粒子
    this._spawnParticles('bg_village')

    // 开启粒子更新循环
    this.events.on('update', this._updateParticles, this)
  }

  // ─── 粒子管理 ──────────────────────────────────────────────────────────────

  private _spawnParticles(bgKey: string) {
    // 清除旧粒子
    for (const p of this.particles) p.go.destroy()
    this.particles = []

    const cfg = LOCATION_PARTICLES[bgKey]
    if (!cfg) return

    const { width, height } = this.scale

    for (let i = 0; i < cfg.count; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize)
      const go = this.add.arc(x, y, r, 0, 360, false, cfg.color, cfg.alpha)
      this.particleContainer?.add(go)

      const particle: ParticleObj = {
        go,
        vx: (Math.random() - 0.5) * cfg.speedX * 2 + cfg.speedX,
        vy: (Math.random() - 0.5) * Math.abs(cfg.speedY) + cfg.speedY,
        flickerTimer: Math.random() * 200,
      }
      this.particles.push(particle)

      // 闪烁动画
      if (cfg.flicker) {
        this.tweens.add({
          targets: go,
          alpha: { from: cfg.alpha * 0.3, to: cfg.alpha },
          duration: 800 + Math.random() * 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: Math.random() * 1000,
        })
      }
    }
  }

  private _updateParticles(_time: number, _delta: number) {
    const { width, height } = this.scale
    for (const p of this.particles) {
      p.go.x += p.vx
      p.go.y += p.vy

      // 边界循环
      if (p.go.x > width + 10) p.go.x = -10
      if (p.go.x < -10) p.go.x = width + 10
      if (p.go.y > height + 10) p.go.y = -10
      if (p.go.y < -10) p.go.y = height + 10
    }
  }

  // ─── 地点切换 ─────────────────────────────────────────────────────────────

  changeLocation(bgKey: string) {
    if (bgKey === this.currentLocationKey) return
    this.currentLocationKey = bgKey

    // 地点名映射
    const names: Record<string, string> = {
      bg_village:     '落瀑村',
      bg_forest:      '幽暗森林',
      bg_forest_deep: '森林深处',
      bg_temple:      '古代神殿',
      bg_mine:        '废弃矿洞',
    }
    this.locationLabel?.setText(names[bgKey] ?? '')

    this.transitionTween?.stop()
    this.transitionTween = this.tweens.add({
      targets: this.bgImage,
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.bgImage?.setTexture(bgKey)
        this.tweens.add({ targets: this.bgImage, alpha: 1, duration: 350 })
        // 切换粒子效果
        this._spawnParticles(bgKey)
      },
    })
  }
}
