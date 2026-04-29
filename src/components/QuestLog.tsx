import { useGameStore } from '../store/gameStore'
import type { Quest } from '../types'

interface Props {
  onClose: () => void
}

function QuestCard({ quest }: { quest: Quest }) {
  const statusColor =
    quest.status === 'completed'
      ? 'border-green-600/50 bg-green-900/10'
      : quest.status === 'active'
      ? 'border-yellow-600/50 bg-yellow-900/10'
      : 'border-gray-700 bg-gray-900/30'

  const titleColor =
    quest.status === 'completed'
      ? 'text-green-300'
      : quest.status === 'active'
      ? 'text-yellow-200'
      : 'text-gray-500'

  return (
    <div className={`rounded-lg border p-3 ${statusColor}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className={`font-semibold text-sm ${titleColor}`}>{quest.title}</p>
        {quest.status === 'completed' && (
          <span className="text-green-400 text-xs shrink-0">✓ 已完成</span>
        )}
        {quest.status === 'locked' && (
          <span className="text-gray-600 text-xs shrink-0">🔒 未解锁</span>
        )}
      </div>
      <p className="text-gray-400 text-xs mb-2">{quest.description}</p>

      {quest.status !== 'locked' && (
        <div className="space-y-1">
          {quest.objectives.map((obj) => (
            <div key={obj.id} className="flex items-center gap-2 text-xs">
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                  obj.completed
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'border-gray-600'
                }`}
              >
                {obj.completed && '✓'}
              </span>
              <span className={obj.completed ? 'text-gray-500 line-through' : 'text-gray-300'}>
                {obj.description}
              </span>
            </div>
          ))}
        </div>
      )}

      {quest.reward && quest.status !== 'completed' && (
        <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-500">
          奖励：
          {quest.reward.exp && <span className="text-blue-400 mr-2">+{quest.reward.exp} EXP</span>}
          {quest.reward.gold && <span className="text-yellow-400 mr-2">+{quest.reward.gold} G</span>}
        </div>
      )}
    </div>
  )
}

export default function QuestLog({ onClose }: Props) {
  const quests = useGameStore((s) => s.quests)

  const active = quests.filter((q) => q.status === 'active')
  const locked = quests.filter((q) => q.status === 'locked')
  const completed = quests.filter((q) => q.status === 'completed')

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-600/40 rounded-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-600/30">
          <h2 className="text-yellow-300 font-bold text-lg tracking-wider">任务日志</h2>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="text-yellow-400">{active.length} 进行中</span>
            <span className="text-green-400">{completed.length} 已完成</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl leading-none ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 进行中 */}
          {active.length > 0 && (
            <section>
              <p className="text-yellow-500 text-xs uppercase tracking-wider mb-2">进行中</p>
              <div className="space-y-2">
                {active.map((q) => <QuestCard key={q.id} quest={q} />)}
              </div>
            </section>
          )}

          {/* 已完成 */}
          {completed.length > 0 && (
            <section>
              <p className="text-green-600 text-xs uppercase tracking-wider mb-2">已完成</p>
              <div className="space-y-2">
                {completed.map((q) => <QuestCard key={q.id} quest={q} />)}
              </div>
            </section>
          )}

          {/* 未解锁 */}
          {locked.length > 0 && (
            <section>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">未解锁</p>
              <div className="space-y-2">
                {locked.map((q) => <QuestCard key={q.id} quest={q} />)}
              </div>
            </section>
          )}

          {quests.length === 0 && (
            <p className="text-gray-600 text-sm italic text-center mt-8">暂无任务</p>
          )}
        </div>
      </div>
    </div>
  )
}
