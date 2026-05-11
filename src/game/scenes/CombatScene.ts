import * as Phaser from 'phaser'

/**
 * 战斗场景 —— 战斗背景与双方角色展示
 * 包含完整的攻击/受击/技能粒子动效和屏幕震动
 */
export default class CombatScene extends Phaser.Scene {
  private enemyDisplay?: Phaser.GameObjects.Container
  private playerDisplay?: Phaser.GameObjects.Container
  private enemyBody?: Phaser.GameObjects.Rectangle
  private playerBody?: Phaser.GameObjects.Rectangle
  private bgOverlay?: Phaser.GameObjects.Rectangle

  // 战斗开始时记录原始位置
  private enemyOrigin = { x: 0, y: 0 }
  private playerOrigin = { x: 0, y: 0 }

  constructor() {
    super({ key: 'CombatScene' })
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0d0510')

    // 背景渐变遮罩
    this.bgOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0)

    // 地面线
    const ground = this.add.graphics()
    ground.lineStyle(1, 0x3a2a4a, 0.4)
    ground.lineBetween(width * 0.05, height * 0.72, width * 0.95, height * 0.72)

    this._buildEnemyDisplay(width, height)
    this._buildPlayerDisplay(width, height)

    this.scale.on('resize', (gs: Phaser.Structs.Size) => {
      this._repositionOnResize(gs.width, gs.height)
    })
  }

  // ─── 内部构建 ─────────────────────────────────────────────────────────────

  private _buildEnemyDisplay(w: number, h: number) {
    const x = w * 0.65
    const y = h * 0.38

    // 敌人身体（圆角矩形）
    const body = this.add.rectangle(0, 0, 80, 90, 0xcc4466).setStrokeStyle(2, 0xff6688)
    // 发光眼睛
    const eye1 = this.add.ellipse(-14, -10, 14, 14, 0xff2255)
    const eye2 = this.add.ellipse(14, -10, 14, 14, 0xff2255)
    // 阴影
    const shadow = this.add.ellipse(0, 50, 70, 18, 0x000000, 0.35)

    this.enemyDisplay = this.add.container(x, y, [shadow, body, eye1, eye2])
    this.enemyBody = body
    this.enemyOrigin = { x, y }

    // 眼睛呼吸动画
    this.tweens.add({
      targets: [eye1, eye2],
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    // 敌人轻微悬浮
    this.tweens.add({
      targets: this.enemyDisplay,
      y: y - 8,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private _buildPlayerDisplay(w: number, h: number) {
    const x = w * 0.3
    const y = h * 0.58

    // 玩家身体
    const body = this.add.rectangle(0, 0, 56, 76, 0x4466ff).setStrokeStyle(2, 0x88aaff)
    // 玩家头部
    const head = this.add.circle(0, -52, 22, 0x6688ff).setStrokeStyle(2, 0xaaccff)
    // 装备/剑（右侧）
    const sword = this.add.rectangle(36, 4, 8, 50, 0xddddcc).setStrokeStyle(1, 0xffffff)
    // 阴影
    const shadow = this.add.ellipse(0, 44, 60, 16, 0x000000, 0.35)

    this.playerDisplay = this.add.container(x, y, [shadow, body, sword, head])
    this.playerBody = body
    this.playerOrigin = { x, y }
  }

  private _repositionOnResize(w: number, h: number) {
    const ex = w * 0.65, ey = h * 0.38
    const px = w * 0.3, py = h * 0.58
    this.enemyDisplay?.setPosition(ex, ey)
    this.playerDisplay?.setPosition(px, py)
    this.enemyOrigin = { x: ex, y: ey }
    this.playerOrigin = { x: px, y: py }
    this.bgOverlay?.setPosition(w / 2, h / 2).setSize(w, h)
  }

  // ─── 公开动画接口 ─────────────────────────────────────────────────────────

  startBattleIntro(_enemySpriteKey: string) {
    if (!this.enemyDisplay || !this.playerDisplay) return
    const { width } = this.scale

    // 入场：敌人从右侧滑入
    this.enemyDisplay.x = width + 100
    this.tweens.add({
      targets: this.enemyDisplay,
      x: this.enemyOrigin.x,
      duration: 500,
      ease: 'Back.easeOut',
    })
    // 玩家从左侧滑入
    this.playerDisplay.x = -100
    this.tweens.add({
      targets: this.playerDisplay,
      x: this.playerOrigin.x,
      duration: 500,
      delay: 120,
      ease: 'Back.easeOut',
    })

    // 闪烁背景
    this.tweens.add({
      targets: this.bgOverlay,
      fillAlpha: 0.35,
      duration: 250,
      yoyo: true,
      repeat: 1,
    })
  }

  playPlayerAttack(onComplete?: () => void) {
    if (!this.playerDisplay) { onComplete?.(); return }
    const origin = this.playerOrigin
    const rushX = origin.x + (this.scale.width * 0.65 - origin.x) * 0.55

    this.tweens.chain({
      targets: this.playerDisplay,
      tweens: [
        { x: rushX, duration: 130, ease: 'Cubic.easeIn' },
        { x: origin.x, duration: 220, ease: 'Back.easeOut',
          onComplete: () => onComplete?.() },
      ],
    })

    // 攻击轨迹拖尾（连续小矩形）
    this._spawnSlashTrail()
  }

  playEnemyHit() {
    if (!this.enemyDisplay) return

    // 红色闪烁
    this.tweens.add({
      targets: this.enemyBody,
      fillColor: { from: 0xffffff, to: 0xcc4466 },
      duration: 80,
      yoyo: true,
      repeat: 2,
    })

    // 左右抖动
    const ox = this.enemyOrigin.x
    this.tweens.add({
      targets: this.enemyDisplay,
      x: { from: ox - 8, to: ox + 8 },
      duration: 40,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
      onComplete: () => this.enemyDisplay?.setX(ox),
    })

    // 伤害粒子
    this._spawnHitParticles(this.enemyOrigin.x, this.enemyOrigin.y - 20)
  }

  playEnemyAttack(onComplete?: () => void) {
    if (!this.enemyDisplay) { onComplete?.(); return }
    const origin = this.enemyOrigin
    const rushX = origin.x - (origin.x - this.scale.width * 0.3) * 0.55

    this.tweens.chain({
      targets: this.enemyDisplay,
      tweens: [
        { x: rushX, duration: 130, ease: 'Cubic.easeIn' },
        { x: origin.x, duration: 200, ease: 'Back.easeOut',
          onComplete: () => onComplete?.() },
      ],
    })

    // 屏幕轻微震动
    this.cameras.main.shake(180, 0.006)

    // 玩家受击闪烁
    this.tweens.add({
      targets: this.playerBody,
      fillColor: { from: 0xff4444, to: 0x4466ff },
      duration: 100,
      yoyo: true,
      repeat: 2,
    })
  }

  playVictory() {
    const { width, height } = this.scale
    // 金色粒子爆发
    this._spawnVictoryParticles(width, height)
    // 屏幕金色闪烁
    this.tweens.add({
      targets: this.bgOverlay,
      fillColor: 0xffdd00,
      fillAlpha: 0.18,
      duration: 200,
      yoyo: true,
      repeat: 2,
    })
  }

  playDefeat() {
    // 屏幕暗红色渐渐遮罩
    this.tweens.add({
      targets: this.bgOverlay,
      fillColor: 0x660000,
      fillAlpha: 0.55,
      duration: 800,
      ease: 'Cubic.easeIn',
    })
    // 摄像机缓慢震动
    this.cameras.main.shake(600, 0.012)
  }

  // ─── 粒子工厂 ─────────────────────────────────────────────────────────────

  private _spawnSlashTrail() {
    const startX = this.playerOrigin.x + 36
    const y = this.playerOrigin.y
    for (let i = 0; i < 5; i++) {
      const slash = this.add.rectangle(
        startX + i * 30,
        y + (Math.random() - 0.5) * 30,
        3 + Math.random() * 6,
        2,
        0xffffff,
        0.8,
      )
      this.tweens.add({
        targets: slash,
        x: slash.x + 80,
        alpha: 0,
        scaleX: 3,
        duration: 180 + i * 20,
        ease: 'Cubic.easeOut',
        onComplete: () => slash.destroy(),
      })
    }
  }

  private _spawnHitParticles(cx: number, cy: number) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const speed = 60 + Math.random() * 80
      const particle = this.add.circle(
        cx,
        cy,
        3 + Math.random() * 4,
        Phaser.Display.Color.HSLToColor(0, 0.8 + Math.random() * 0.2, 0.6).color,
        1,
      )
      this.tweens.add({
        targets: particle,
        x: cx + Math.cos(angle) * speed,
        y: cy + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 300 + Math.random() * 200,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      })
    }
  }

  private _spawnVictoryParticles(w: number, h: number) {
    const cx = w * 0.65
    const cy = h * 0.38
    for (let i = 0; i < 30; i++) {
      const delay = Math.random() * 300
      const angle = (Math.random() * Math.PI * 2)
      const radius = 60 + Math.random() * 120
      const colors = [0xffd700, 0xffaa00, 0xffffff, 0xff8844]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const star = this.add.circle(cx, cy, 2 + Math.random() * 5, color, 1)

      this.tweens.add({
        targets: star,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius - 40,
        alpha: 0,
        scale: 0.1,
        duration: 600 + Math.random() * 400,
        delay,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy(),
      })
    }
  }
}
