import * as Phaser from 'phaser'

interface Star {
  go: Phaser.GameObjects.Arc
  twinkleSpeed: number
}

/**
 * 主菜单背景场景 —— 动态星空背景（星星闪烁 + 流星）
 */
export default class MainMenuScene extends Phaser.Scene {
  private stars: Star[] = []
  private meteorTimer = 0
  private readonly METEOR_INTERVAL = 4000 // 每 4 秒一颗流星

  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create() {
    const { width, height } = this.scale

    // ── 深色渐变背景 ──────────────────────────────────────────────────────
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x04041a, 0x04041a, 0x0d0520, 0x0d0520, 1)
    bg.fillRect(0, 0, width, height)

    // 底部地平线光晕
    const horizonGlow = this.add.graphics()
    horizonGlow.fillGradientStyle(0x000000, 0x000000, 0x1a0a38, 0x1a0a38, 0)
    horizonGlow.fillRect(0, height * 0.6, width, height * 0.4)

    // ── 星星层 ────────────────────────────────────────────────────────────
    const starCount = 120
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height * 0.85
      const r = 0.5 + Math.random() * 1.8
      const brightness = 0.4 + Math.random() * 0.6
      const color = this._starColor()

      const go = this.add.arc(x, y, r, 0, 360, false, color, brightness)

      // 闪烁
      this.tweens.add({
        targets: go,
        alpha: { from: brightness * 0.2, to: brightness },
        duration: 800 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000,
      })

      this.stars.push({ go, twinkleSpeed: 800 + Math.random() * 2000 })
    }

    // ── 远景山脉剪影 ─────────────────────────────────────────────────────
    this._drawMountains(width, height)

    // ── 月亮 ──────────────────────────────────────────────────────────────
    const moonX = width * 0.78
    const moonY = height * 0.18
    // 月亮光晕
    const moonGlow = this.add.arc(moonX, moonY, 55, 0, 360, false, 0xaac8ff, 0.08)
    const moonGlow2 = this.add.arc(moonX, moonY, 40, 0, 360, false, 0xaac8ff, 0.12)
    // 月亮本体
    const moon = this.add.arc(moonX, moonY, 28, 0, 360, false, 0xe8e0d0, 1)
    // 月牙阴影
    const moonShadow = this.add.arc(moonX + 10, moonY - 5, 25, 0, 360, false, 0x1a1030, 1)
    void moonGlow; void moonGlow2; void moon; void moonShadow

    // 月亮轻微浮动
    this.tweens.add({
      targets: [moonGlow, moonGlow2, moon, moonShadow],
      y: '+=4',
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ── 定时触发流星 ──────────────────────────────────────────────────────
    this.time.addEvent({
      delay: this.METEOR_INTERVAL,
      callback: this._spawnMeteor,
      callbackScope: this,
      loop: true,
      startAt: 1500,
    })
  }

  // ─── 辅助方法 ─────────────────────────────────────────────────────────────

  private _starColor(): number {
    const palette = [0xffffff, 0xffe8c8, 0xc8d8ff, 0xffd0d0, 0xd0ffd8]
    return palette[Math.floor(Math.random() * palette.length)]
  }

  private _drawMountains(w: number, h: number) {
    const g = this.add.graphics()
    g.fillStyle(0x08051a, 1)

    // 远山（较淡）
    g.fillStyle(0x0a071e, 1)
    g.beginPath()
    g.moveTo(0, h)
    g.lineTo(0, h * 0.72)
    g.lineTo(w * 0.08, h * 0.62)
    g.lineTo(w * 0.2, h * 0.72)
    g.lineTo(w * 0.35, h * 0.58)
    g.lineTo(w * 0.48, h * 0.68)
    g.lineTo(w * 0.62, h * 0.52)
    g.lineTo(w * 0.75, h * 0.65)
    g.lineTo(w * 0.88, h * 0.55)
    g.lineTo(w, h * 0.68)
    g.lineTo(w, h)
    g.closePath()
    g.fillPath()

    // 近山（更深）
    g.fillStyle(0x060412, 1)
    g.beginPath()
    g.moveTo(0, h)
    g.lineTo(0, h * 0.82)
    g.lineTo(w * 0.12, h * 0.74)
    g.lineTo(w * 0.28, h * 0.88)
    g.lineTo(w * 0.42, h * 0.76)
    g.lineTo(w * 0.56, h * 0.84)
    g.lineTo(w * 0.7, h * 0.78)
    g.lineTo(w * 0.85, h * 0.86)
    g.lineTo(w, h * 0.8)
    g.lineTo(w, h)
    g.closePath()
    g.fillPath()
  }

  private _spawnMeteor() {
    const { width, height } = this.scale
    // 从屏幕顶部随机位置开始，向右下方飞行
    const startX = Math.random() * width * 0.6 + width * 0.1
    const startY = Math.random() * height * 0.25
    const length = 80 + Math.random() * 80
    const angle = 30 + Math.random() * 20 // 30-50 度

    const rad = (angle * Math.PI) / 180
    const endX = startX + Math.cos(rad) * length * 4
    const endY = startY + Math.sin(rad) * length * 4

    const meteor = this.add.rectangle(startX, startY, length, 2, 0xffffff, 0.9)
    meteor.setRotation(rad)

    // 尾迹：逐渐变细
    const trailCount = 4
    const trails: Phaser.GameObjects.Rectangle[] = []
    for (let i = 1; i <= trailCount; i++) {
      const t = this.add.rectangle(
        startX - Math.cos(rad) * (i * 20),
        startY - Math.sin(rad) * (i * 20),
        length * (1 - i * 0.2),
        1,
        0xaabbff,
        0.5 - i * 0.1,
      )
      t.setRotation(rad)
      trails.push(t)
    }

    this.tweens.add({
      targets: [meteor, ...trails],
      x: `+=${endX - startX}`,
      y: `+=${endY - startY}`,
      alpha: 0,
      duration: 700 + Math.random() * 300,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        meteor.destroy()
        trails.forEach((t) => t.destroy())
      },
    })

    void this.meteorTimer
  }
}
