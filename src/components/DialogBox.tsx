import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { NPCS } from '../data/dialogues'
import type { DialogueCondition, DialogueOption } from '../types'

/** 根据游戏状态对条件求值 */
function evaluateCondition(
  cond: DialogueCondition,
  gameState: ReturnType<typeof useGameStore.getState>,
): boolean {
  switch (cond.type) {
    case 'hasItem':
      return gameState.inventory.some((i) => i.item.id === cond.itemId)
    case 'questStatus': {
      const q = gameState.quests.find((q) => q.id === cond.questId)
      if (!q) return false
      const statuses = Array.isArray(cond.status) ? cond.status : [cond.status]
      return statuses.includes(q.status)
    }
    case 'not':
      return !evaluateCondition(cond.condition, gameState)
    case 'and':
      return cond.conditions.every((c) => evaluateCondition(c, gameState))
    case 'or':
      return cond.conditions.some((c) => evaluateCondition(c, gameState))
  }
}

export default function DialogBox() {
  const activeDialogue = useGameStore((s) => s.activeDialogue)
  const advanceDialogue = useGameStore((s) => s.advanceDialogue)
  const closeDialogue = useGameStore((s) => s.closeDialogue)
  const dispatchDialogueAction = useGameStore((s) => s.dispatchDialogueAction)
  // 用于条件求值的完整游戏状态（仅读取，不订阅具体字段以避免过多重渲染）
  const inventory = useGameStore((s) => s.inventory)
  const quests = useGameStore((s) => s.quests)
  const boxRef = useRef<HTMLDivElement>(null)
  const lastNodeActionKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialogue()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeDialogue])

  useEffect(() => {
    if (!activeDialogue) {
      lastNodeActionKeyRef.current = null
      return
    }

    const node = NPCS[activeDialogue.npcId]?.dialogues.find((d) => d.id === activeDialogue.nodeId)
    if (!node?.action) return

    const key = `${activeDialogue.npcId}:${activeDialogue.nodeId}`
    if (lastNodeActionKeyRef.current === key) return
    lastNodeActionKeyRef.current = key
    dispatchDialogueAction(node.action, activeDialogue.npcId)
  }, [activeDialogue, dispatchDialogueAction])

  if (!activeDialogue) return null

  const npc = NPCS[activeDialogue.npcId]
  if (!npc) return null

  const node = npc.dialogues.find((d) => d.id === activeDialogue.nodeId)
  if (!node) return null

  // 构造轻量 gameState 快照用于条件求值
  const snapState = { inventory, quests } as ReturnType<typeof useGameStore.getState>

  // 过滤掉条件不满足的选项
  const visibleOptions: DialogueOption[] = (node.options ?? []).filter(
    (opt) => !opt.condition || evaluateCondition(opt.condition, snapState),
  )

  const isRootNode = activeDialogue.nodeId === 'greeting'
  const showDismissOption = isRootNode
  const showEndOption = !isRootNode && visibleOptions.length === 0

  const handleOption = (opt?: DialogueOption) => {
    // 分发声明式动作（openShop 需要关闭对话框，优先处理）
    if (opt?.action) {
      if (opt.action.type === 'openShop') {
        dispatchDialogueAction(opt.action, activeDialogue.npcId)
        closeDialogue()
        return
      }
      dispatchDialogueAction(opt.action, activeDialogue.npcId)
    }
    if (opt?.next) {
      advanceDialogue(opt.next)
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
            {visibleOptions.map((opt, i) => (
              <button
                type="button"
                key={i}
                onClick={() => handleOption(opt)}
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
                type="button"
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
                type="button"
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
