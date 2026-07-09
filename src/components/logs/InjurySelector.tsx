import { useState } from 'react'
import clsx from 'clsx'
import type { Injury } from '@/types/models'

interface InjurySelectorProps {
  injuries: Injury[]
  selectedIds: string[]
  onToggle: (injuryId: string) => void
}

export function InjurySelector({ injuries, selectedIds, onToggle }: InjurySelectorProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? injuries : injuries.filter((i) => i.status === 'active')

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
        <span>Injuries</span>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="font-semibold text-accent-soft-text hover:underline"
        >
          {showAll ? 'Show active only' : 'Show all'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {visible.map((injury) => {
          const selected = selectedIds.includes(injury.id)
          return (
            <button
              key={injury.id}
              type="button"
              onClick={() => onToggle(injury.id)}
              className={clsx(
                'whitespace-nowrap rounded-full border px-3 py-[5px] text-xs font-semibold transition-colors',
                selected
                  ? 'border-accent bg-accent-soft text-accent-soft-text'
                  : 'border-strong bg-transparent text-ink-secondary hover:bg-surface-raised',
              )}
            >
              {injury.name}
            </button>
          )
        })}
        {visible.length === 0 && (
          <p className="text-sm text-ink-muted">No injuries yet — add one first.</p>
        )}
      </div>
    </div>
  )
}
