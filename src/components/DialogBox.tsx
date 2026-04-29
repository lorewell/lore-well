import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { NPCS } from '../data/npcs'

export default function DialogBox() {
  const activeDialogue = useGameStore((s) => s.activeDialogue)
  const advanceDialogue = useGameStore((s) => s.advanceDialogue)
  const closeDialogue = useGameStore((s) => s.closeDialogue)
  const restoreHpMp = useGameStore((s) => s.restoreHpMp)
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
    if (nextNodeId) {
      advanceDialogue(nextNodeId)
    } else {
      closeDialogue()
    }
  }

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-32 px-6 pointer-events-none">
      <div
        ref={boxRef}
        className="w-full max-w-2xl pointer-events-auto border"
        style={{
          background: 'rgba(10,5,20,0.92)',
          borderColor: '#3a1a5a',
          boxShadow: '0 0 30px rgba(102,0,204,0.3)',
        }}
      >
        {/* NPC 名字 */}
        <div
          className="px-4 py-2 border-b text-xs tracking-widest"
          style={{ borderColor: '#2a1040', color: '#aa55ff' }}
        >
          {npc.name}
        </div>

        {/* 对话文本 */}
        <div className="px-4 py-4 text-sm leading-relaxed" style={{ color: '#e2d8f0' }}>
          {node.text}
        </div>

        {/* 选项 / 关闭 */}
        <div className="px-4 pb-4 flex flex-col gap-1.5">
          {node.options && node.options.length > 0 ? (
            node.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt.next)}
                className="text-left text-xs px-3 py-2 border cursor-pointer transition-all duration-150 hover:brightness-125"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: '#2a1040',
                  color: '#c0a0e0',
                }}
              >
                ▶ {opt.text}
              </button>
            ))
          ) : (
            <button
              onClick={() => closeDialogue()}
              className="text-left text-xs px-3 py-2 border cursor-pointer transition-all duration-150 hover:brightness-125"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: '#2a1040',
                color: '#9070b0',
              }}
            >
              ▶ [关闭]
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
