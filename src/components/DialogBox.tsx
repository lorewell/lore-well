import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { NPCS } from '../data/npcs'

export default function DialogBox() {
  const activeDialogue = useGameStore((s) => s.activeDialogue)
  const advanceDialogue = useGameStore((s) => s.advanceDialogue)
  const closeDialogue = useGameStore((s) => s.closeDialogue)
  const restoreHpMp = useGameStore((s) => s.restoreHpMp)
  const openShop = useGameStore((s) => s.openShop)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialogue()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeDialogue])

  if (!activeDialogue) return null

  const npc = NPCS[activeDialogue.npcId]
  if (!npc) return null

  const node = npc.dialogues.find((d) => d.id === activeDialogue.nodeId)
  if (!node) return null

  const handleOption = (nextNodeId?: string) => {
    // 特殊动作：innkeeper 休息
    if (activeDialogue.npcId === 'innkeeper' && nextNodeId === 'rest') {
      restoreHpMp()
    }
    // 特殊动作：打开商店
    if (nextNodeId === 'shop') {
      openShop(activeDialogue.npcId)
      closeDialogue()
      return
    }
    if (nextNodeId) {
      advanceDialogue(nextNodeId)
    } else {
      closeDialogue()
    }
  }

  return (
    <div
      ref={boxRef}
      className="absolute bottom-0 left-0 right-0"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.96) 68%, transparent 100%)',
        borderTop: '1px solid #3a1a5a',
        minHeight: '160px',
      }}
    >
      <div
        className="flex"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          paddingLeft: 'max(12px, env(safe-area-inset-left))',
          paddingRight: 'max(12px, env(safe-area-inset-right))',
          minHeight: '160px',
        }}
      >
        {/* NPC 名字竖栏 */}
        <div
          className="shrink-0 flex flex-col justify-center pt-3 pb-3 pr-3"
          style={{ width: 'clamp(90px, 14vw, 120px)', borderRight: '1px solid #2a1040' }}
        >
          <span className="text-[9px] tracking-widest mb-1" style={{ color: '#4a3060' }}>对话中</span>
          <span className="text-xs font-medium leading-tight" style={{ color: '#aa55ff' }}>{npc.name}</span>
        </div>

        {/* 对话内容区 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center pt-3 pb-3 pl-4 pr-2">
          {/* 对话文本 */}
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#e2d8f0' }}>
            {node.text}
          </p>

          {/* 选项列表 + 始终追加"没事了" */}
          <div className="flex flex-col gap-1">
            {node.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt.next)}
                className="text-left text-xs px-2.5 py-1.5 border cursor-pointer transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: '#2a1040',
                  color: '#c0a0e0',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(170,85,255,0.12)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
              >
                ▶ {opt.text}
              </button>
            ))}
            <button
              onClick={() => closeDialogue()}
              className="text-left text-xs px-2.5 py-1.5 border cursor-pointer transition-all duration-150"
              style={{
                background: 'transparent',
                borderColor: '#1e1030',
                color: '#4a3060',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#9070b0' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#4a3060' }}
            >
              ▶ 没事了。
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
