import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Phaser from 'phaser'
import MainMenuScene from '../game/scenes/MainMenuScene'
import { useGameStore } from '../store/gameStore'

export default function MainMenuScreen() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const navigate = useNavigate()
  const startNewGame = useGameStore((s) => s.startNewGame)
  const started = useGameStore((s) => s.started)

  const [showNameInput, setShowNameInput] = useState(false)
  const [nameValue, setNameValue] = useState('')

  // 初始化 Phaser
  useEffect(() => {
    if (!canvasRef.current || gameRef.current) return

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#0a0a1a',
      parent: canvasRef.current,
      scene: [MainMenuScene],
      audio: { disableWebAudio: false },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: { antialias: true, pixelArt: false },
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  const handleNewGame = () => {
    setShowNameInput(true)
  }

  const handleConfirmName = () => {
    const name = nameValue.trim() || '旅行者'
    startNewGame(name)
    navigate('/game')
  }

  const handleContinue = () => {
    navigate('/game')
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Phaser 画布容器 */}
      <div ref={canvasRef} className="absolute inset-0" />

      {/* React UI 叠加层 */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-8">
        {/* 标题区域 */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <h1
            className="text-7xl font-bold tracking-widest select-none"
            style={{
              color: '#e2d8f0',
              textShadow: '0 0 40px #aa55ff, 0 0 80px #6600cc, 0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.15em',
            }}
          >
            LORE WELL
          </h1>
          <p
            className="text-sm tracking-[0.4em] uppercase"
            style={{ color: '#9070b0', textShadow: '0 0 10px #6600cc' }}
          >
            深入传说之源
          </p>
        </div>

        {/* 菜单按钮区 */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {!showNameInput ? (
            <>
              <MenuButton onClick={handleNewGame}>新的旅程</MenuButton>
              {started && (
                <MenuButton onClick={handleContinue} variant="secondary">
                  继续冒险
                </MenuButton>
              )}
              <MenuButton variant="ghost" onClick={() => {}}>
                设置
              </MenuButton>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-sm tracking-widest" style={{ color: '#c0a0e0' }}>
                请输入你的名字
              </p>
              <input
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
                placeholder="旅行者"
                maxLength={12}
                className="w-full text-center bg-transparent border-b-2 outline-none text-lg py-2 px-4 placeholder-purple-900"
                style={{
                  borderColor: '#6600cc',
                  color: '#e2d8f0',
                  caretColor: '#aa55ff',
                }}
              />
              <MenuButton onClick={handleConfirmName}>踏上旅途</MenuButton>
              <button
                onClick={() => setShowNameInput(false)}
                className="text-xs tracking-widest cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: '#9070b0' }}
              >
                返回
              </button>
            </div>
          )}
        </div>

        {/* 底部版本号 */}
        <p className="text-xs tracking-widest" style={{ color: '#4a3060' }}>
          v0.1.0 · PROTOTYPE
        </p>
      </div>
    </div>
  )
}

// ─── 菜单按钮组件 ────────────────────────────────────────────────────────────

interface MenuButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

function MenuButton({ children, onClick, variant = 'primary' }: MenuButtonProps) {
  const base =
    'w-full py-3 px-8 text-sm tracking-[0.3em] uppercase font-medium transition-all duration-300 cursor-pointer select-none border'

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, rgba(102,0,204,0.4), rgba(170,85,255,0.2))',
      borderColor: '#6600cc',
      color: '#e2d8f0',
      boxShadow: '0 0 20px rgba(102,0,204,0.3)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.04)',
      borderColor: '#3a2050',
      color: '#c0a0e0',
    },
    ghost: {
      background: 'transparent',
      borderColor: 'transparent',
      color: '#9070b0',
    },
  }

  return (
    <button
      className={base}
      style={styles[variant]}
      onClick={onClick}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.3)'
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.filter = ''
        ;(e.currentTarget as HTMLButtonElement).style.transform = ''
      }}
    >
      {children}
    </button>
  )
}
