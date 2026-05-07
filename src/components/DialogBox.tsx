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

  const isRootNode = activeDialogue.nodeId === 'greeting'
  const hasOptions = Boolean(node.options?.length)
  const showDismissOption = isRootNode
  const showEndOption = !isRootNode && !hasOptions

  const handleOption = (nextNodeId?: string) => {
    // 特殊动作：innkeeper 休息
    if (activeDialogue.npcId === 'innkeeper' && nextNodeId === 'rest') {
      restoreHpMp()
    }
    // 特殊动作：瀑布水池沐浴
    if (activeDialogue.npcId === 'waterfall_pool' && nextNodeId === 'bathe') {
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
    <div ref={boxRef} className="pixel-bottom-shell">
      <div
        className="pixel-panel flex"
        style={{ minHeight: '164px' }}
      >
        {/* NPC 名字竖栏 */}
        <div
          className="shrink-0 flex flex-col justify-center pt-3 pb-3 pr-3"
          style={{ width: 'clamp(90px, 14vw, 120px)', borderRight: '2px solid #1d2932' }}
        >
          <span className="text-[9px] tracking-widest mb-1" style={{ color: '#3b4a4c' }}>对话中</span>
          <span className="text-xs font-medium leading-tight" style={{ color: 'var(--pixel-violet)' }}>{npc.name}</span>
        </div>

        {/* 对话内容区 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center pt-3 pb-3 pl-4 pr-2">
          {/* 对话文本 */}
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#e7d09a' }}>
            {node.text}
          </p>

          {/* 根节点可直接收起；深层终点只保留明确的结束动作，避免误中断分支 */}
          <div className="flex flex-col gap-1">
            {node.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt.next)}
                className="text-left text-xs px-2.5 py-1.5 border cursor-pointer transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: '#3b4a4c',
                  color: '#e7d09a',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--pixel-gold)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3b4a4c' }}
              >
                ▶ {opt.text}
              </button>
            ))}
            {showDismissOption && (
              <button
                onClick={() => closeDialogue()}
                className="text-left text-xs px-2.5 py-1.5 border cursor-pointer transition-all duration-150"
                style={{
                  background: 'transparent',
                  borderColor: '#263032',
                  color: '#6d5434',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#b68f59' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6d5434' }}
              >
                ▶ 没事了。
              </button>
            )}
            {showEndOption && (
              <button
                onClick={() => closeDialogue()}
                className="text-left text-xs px-2.5 py-1.5 border cursor-pointer transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: '#3b4a4c',
                  color: '#e7d09a',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--pixel-gold)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3b4a4c' }}
              >
                ▶ 结束对话
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
