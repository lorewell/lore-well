import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  onClose: () => void
}

export default function PauseMenu({ onClose }: Props) {
  const navigate = useNavigate()
  const [confirmLeave, setConfirmLeave] = useState(false)

  const handleLeave = () => {
    if (confirmLeave) {
      navigate('/')
    } else {
      setConfirmLeave(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="flex flex-col items-center gap-4 w-72 py-8 px-6 rounded-xl border"
        style={{
          background: 'linear-gradient(160deg, rgba(15,8,30,0.97), rgba(20,10,40,0.97))',
          borderColor: '#3a2060',
          boxShadow: '0 0 40px rgba(100,0,180,0.25)',
        }}
      >
        <h2
          className="text-xl font-bold tracking-[0.25em] uppercase mb-2"
          style={{ color: '#c0a0e0' }}
        >
          暂停
        </h2>

        {/* 游戏已自动存档提示 */}
        <p className="text-xs text-center" style={{ color: '#7050a0' }}>
          游戏状态已自动保存至本地
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          <PauseButton onClick={onClose}>继续游戏</PauseButton>

          {!confirmLeave ? (
            <PauseButton variant="ghost" onClick={handleLeave}>
              返回主菜单
            </PauseButton>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-center" style={{ color: '#e07070' }}>
                进度已自动保存，确认返回？
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleLeave}
                  className="flex-1 py-2 text-xs tracking-wider rounded border cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: '#c03030', color: '#e07070', background: 'rgba(180,30,30,0.15)' }}
                >
                  确认
                </button>
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="flex-1 py-2 text-xs tracking-wider rounded border cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: '#3a2060', color: '#9070b0' }}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PauseButton({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'ghost'
}) {
  const style: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, rgba(102,0,204,0.3), rgba(170,85,255,0.15))',
          borderColor: '#6600cc',
          color: '#e2d8f0',
        }
      : {
          background: 'transparent',
          borderColor: '#3a2060',
          color: '#9070b0',
        }

  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 text-sm tracking-[0.2em] uppercase border rounded cursor-pointer transition-all hover:brightness-125"
      style={style}
    >
      {children}
    </button>
  )
}
