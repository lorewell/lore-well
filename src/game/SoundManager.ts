/**
 * SoundManager —— Web Audio API 程序化音效管理器
 *
 * 无需任何外部音频文件，所有音效均通过 Web Audio API 实时合成。
 * 符合浏览器自动播放策略：音频上下文在第一次用户交互后才会激活。
 */

type SfxType =
  | 'attack'     // 玩家普通攻击
  | 'skill'      // 技能释放
  | 'hit'        // 敌人受击
  | 'heal'       // 治疗/回血
  | 'victory'    // 战斗胜利
  | 'defeat'     // 战斗失败
  | 'levelup'    // 升级
  | 'click'      // UI 点击
  | 'coin'       // 获得金币/购买
  | 'open'       // 开启面板/宝箱
  | 'flee'       // 逃跑成功
  | 'step'       // 地点移动

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let _muted = false
let _volume = 0.6

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = _muted ? 0 : _volume
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function getMaster(): GainNode {
  getCtx()
  return masterGain!
}

// ─── 基础合成辅助 ─────────────────────────────────────────────────────────────

function playTone(
  frequency: number,
  type: OscillatorType,
  duration: number,
  gainPeak: number,
  attackTime = 0.01,
  releaseTime?: number,
): void {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  const release = releaseTime ?? duration * 0.5

  osc.type = type
  osc.frequency.setValueAtTime(frequency, c.currentTime)

  gain.gain.setValueAtTime(0, c.currentTime)
  gain.gain.linearRampToValueAtTime(gainPeak, c.currentTime + attackTime)
  gain.gain.setValueAtTime(gainPeak, c.currentTime + duration - release)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + duration)

  osc.connect(gain)
  gain.connect(getMaster())
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

function playFreqSweep(
  startFreq: number,
  endFreq: number,
  type: OscillatorType,
  duration: number,
  gainPeak: number,
): void {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(startFreq, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(endFreq, c.currentTime + duration)

  gain.gain.setValueAtTime(gainPeak, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)

  osc.connect(gain)
  gain.connect(getMaster())
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

function playNoise(duration: number, gainPeak: number, lowpass = 3000): void {
  const c = getCtx()
  const bufferSize = Math.ceil(c.sampleRate * duration)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const source = c.createBufferSource()
  source.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = lowpass

  const gain = c.createGain()
  gain.gain.setValueAtTime(gainPeak, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(getMaster())
  source.start(c.currentTime)
}

// ─── 具体音效实现 ──────────────────────────────────────────────────────────────

const SFX: Record<SfxType, () => void> = {
  attack() {
    // 短促的金属撞击感
    playNoise(0.06, 0.5, 4000)
    playFreqSweep(500, 200, 'sawtooth', 0.08, 0.3)
  },

  skill() {
    // 上升的魔法音调
    playFreqSweep(200, 800, 'sine', 0.2, 0.25)
    playFreqSweep(400, 1200, 'triangle', 0.15, 0.15)
    setTimeout(() => playTone(1200, 'sine', 0.12, 0.2), 80)
  },

  hit() {
    // 低沉的受击冲击声
    playNoise(0.1, 0.7, 800)
    playFreqSweep(300, 80, 'sawtooth', 0.1, 0.5)
  },

  heal() {
    // 清脆上升的治愈音
    ;[0, 50, 100].forEach((delay, i) => {
      setTimeout(() => playTone(440 + i * 220, 'sine', 0.18, 0.18), delay)
    })
  },

  victory() {
    // 欢快的胜利和弦
    const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 'triangle', 0.4, 0.25, 0.02, 0.3)
      }, i * 80)
    })
    setTimeout(() => playTone(1047, 'sine', 0.6, 0.3, 0.01, 0.5), 360)
  },

  defeat() {
    // 低沉下降的失败音
    playFreqSweep(400, 100, 'sawtooth', 0.8, 0.4)
    setTimeout(() => playFreqSweep(300, 80, 'square', 0.6, 0.4), 200)
    setTimeout(() => playTone(60, 'sine', 0.5, 0.3, 0.05, 0.4), 500)
  },

  levelup() {
    // 五声音阶上升，充满喜悦感
    const scale = [523, 659, 784, 880, 1047, 1175]
    scale.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'triangle', 0.22, 0.22, 0.01, 0.18), i * 60)
    })
  },

  click() {
    // 简短的 UI 点击音
    playTone(800, 'sine', 0.05, 0.15, 0.003, 0.04)
  },

  coin() {
    // 清脆的硬币叮当
    playTone(1200, 'sine', 0.12, 0.3, 0.005, 0.1)
    setTimeout(() => playTone(1600, 'sine', 0.1, 0.25, 0.005, 0.08), 60)
  },

  open() {
    // 开启/发现 的拟声
    playFreqSweep(300, 600, 'sine', 0.2, 0.3)
    setTimeout(() => playTone(800, 'sine', 0.12, 0.2), 150)
  },

  flee() {
    // 快速奔跑的嗖嗖声
    playFreqSweep(600, 200, 'sine', 0.15, 0.3)
    playNoise(0.15, 0.2, 2000)
  },

  step() {
    // 轻柔的脚步声
    playNoise(0.06, 0.25, 600)
  },
}

// ─── 公开 API ─────────────────────────────────────────────────────────────────

export const SoundManager = {
  /** 播放一次音效（如果静音则跳过） */
  play(sfx: SfxType): void {
    try {
      SFX[sfx]()
    } catch {
      // Web Audio API 可能在某些环境下不可用，静默失败
    }
  },

  /** 设置主音量 0–1 */
  setVolume(v: number): void {
    _volume = Math.max(0, Math.min(1, v))
    if (masterGain) masterGain.gain.value = _muted ? 0 : _volume
  },

  /** 切换静音状态，返回新状态 */
  toggleMute(): boolean {
    _muted = !_muted
    if (masterGain) masterGain.gain.value = _muted ? 0 : _volume
    return _muted
  },

  get muted(): boolean {
    return _muted
  },

  get volume(): number {
    return _volume
  },

  /** 预热 AudioContext（需在用户交互事件中调用一次） */
  resume(): void {
    getCtx()
  },
}
