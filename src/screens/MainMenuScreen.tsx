import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Phaser from 'phaser'
import MainMenuScene from '../game/scenes/MainMenuScene'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'

export default function MainMenuScreen() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const navigate = useNavigate()
  const startNewGame = useGameStore((s) => s.startNewGame)
  const started = useGameStore((s) => s.started)
  const player = useGameStore((s) => s.player)
  const currentLocationId = useGameStore((s) => s.currentLocationId)
  const locationName = LOCATIONS[currentLocationId]?.name ?? '未知之地'

  const [showNameInput, setShowNameInput] = useState(false)
  const [nameValue, setNameValue] = useState('')

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
      render: { antialias: true, pixelArt: true },
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
    <div className="pixel-root relative w-full h-full overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0" />

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,12,17,0.15) 0%, rgba(6,8,8,0.62) 50%, rgba(4,3,2,0.94) 100%)',
        }}
      />

      <main className="pixel-ui flex h-full flex-col px-5 py-6 sm:px-10 sm:py-9">
        <section className="mt-4 max-w-4xl sm:mt-8">
          <div className="pixel-label mb-3">AN OLD WELL CALLS FROM THE WOODS</div>
          <h1 className="pixel-title text-5xl leading-none sm:text-7xl">LORE WELL</h1>
          <p className="pixel-subtitle mt-4 text-xs sm:text-sm">
            传说之井 · 失落记忆的冒险
          </p>
        </section>

        <section className="mt-auto grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="pixel-panel pixel-panel--parchment hidden max-w-2xl p-5 sm:block">
            <div className="pixel-label mb-3">PROLOGUE</div>
            <p className="text-sm leading-7" style={{ color: '#f0d8a0' }}>
              暮光落在瀑布村的石阶上，古井深处传来断续的回声。你醒来时只记得一个名字：
              Lore Well。森林、矿洞与神殿遗迹都指向同一个谜题。
            </p>
          </div>

          <div className="pixel-panel p-4 sm:p-5">
            {!showNameInput ? (
              <div className="flex flex-col gap-4">
                <MenuButton onClick={handleNewGame}>新的旅程</MenuButton>
                {started && (
                  <>
                    <MenuButton onClick={handleContinue} variant="secondary">
                      继续冒险
                    </MenuButton>
                    <div className="border-2 p-3" style={{ borderColor: '#59442a', background: 'rgba(7,8,8,0.72)' }}>
                      <div className="pixel-label mb-2">LAST SAVE</div>
                      <div className="flex items-center justify-between gap-3 text-xs" style={{ color: '#f2d89a' }}>
                        <span className="truncate">{player.name}</span>
                        <span className="shrink-0">LV {player.level}</span>
                      </div>
                      <div className="mt-2 text-[11px]" style={{ color: '#b68f59' }}>
                        当前地点：{locationName}
                      </div>
                    </div>
                  </>
                )}
                <MenuButton variant="ghost" onClick={() => {}}>
                  设置
                </MenuButton>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="pixel-label mb-3">NAME THE WANDERER</div>
                  <input
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
                    placeholder="旅行者"
                    maxLength={12}
                    className="pixel-input w-full px-4 py-3 text-center text-sm outline-none"
                  />
                </div>
                <MenuButton onClick={handleConfirmName}>踏上旅途</MenuButton>
                <button
                  onClick={() => setShowNameInput(false)}
                  className="pixel-button pixel-button--ghost px-4 py-3 text-xs tracking-[0.18em]"
                >
                  返回
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between text-[10px]" style={{ color: '#7b6242' }}>
          <span>BUILD v0.9 PROTOTYPE</span>
          <span>THE WELL REMEMBERS</span>
        </div>
      </main>
    </div>
  )
}

interface MenuButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

function MenuButton({ children, onClick, variant = 'primary' }: MenuButtonProps) {
  const variantClass =
    variant === 'secondary'
      ? 'pixel-button--secondary'
      : variant === 'ghost'
        ? 'pixel-button--ghost'
        : ''

  return (
    <button
      className={`pixel-button ${variantClass} w-full px-6 py-3 text-sm font-bold tracking-[0.18em]`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
