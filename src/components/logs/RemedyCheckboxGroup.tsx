import { useState } from 'react'
import clsx from 'clsx'
import type { Remedy } from '@/types/models'
import { useRemedies } from '@/hooks/useRemedies'
import { createRemedy } from '@/db/queries/remedies'
import { Input } from '@/components/ui/Input'
import { Label } from '../ui/Label'

interface RemedyCheckboxGroupProps {
  injuryId: string
  selectedRemedyIds: string[]
  onToggle: (remedyId: string) => void
}

function RemedySection({
  title,
  remedies,
  selectedRemedyIds,
  onToggle,
  onQuickAdd,
}: {
  title: string
  remedies: Remedy[]
  selectedRemedyIds: string[]
  onToggle: (remedyId: string) => void
  onQuickAdd: (name: string) => void
}) {
  const [quickAddValue, setQuickAddValue] = useState('')

  return (
    <div>
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {remedies.map((remedy) => {
          const selected = selectedRemedyIds.includes(remedy.id)
          return (
            <button
              key={remedy.id}
              type="button"
              onClick={() => onToggle(remedy.id)}
              className={clsx(
                'rounded-full border px-[10px] py-1 text-xs font-semibold transition-colors',
                selected
                  ? 'border-transparent bg-accent-soft text-accent-soft-text'
                  : 'border-strong bg-transparent text-ink-secondary hover:bg-surface-raised',
              )}
            >
              {remedy.name}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5">
        <Input
          value={quickAddValue}
          onChange={(e) => setQuickAddValue(e.target.value)}
          placeholder={`+ quick add ${title.toLowerCase()} remedy`}
          className="text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && quickAddValue.trim()) {
              e.preventDefault()
              onQuickAdd(quickAddValue.trim())
              setQuickAddValue('')
            }
          }}
        />
      </div>
    </div>
  )
}

export function RemedyCheckboxGroup({ injuryId, selectedRemedyIds, onToggle }: RemedyCheckboxGroupProps) {
  const remedies = useRemedies(injuryId) ?? []
  const relief = remedies.filter((r) => r.type === 'relief')
  const longterm = remedies.filter((r) => r.type === 'longterm')

  const handleQuickAdd = async (type: 'relief' | 'longterm', name: string) => {
    const created = await createRemedy({ injuryId, name, type })
    onToggle(created.id)
  }

  return (
    <div className="space-y-3">
      <RemedySection
        title="Relief"
        remedies={relief}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        onQuickAdd={(name) => handleQuickAdd('relief', name)}
      />
      <RemedySection
        title="Long-term"
        remedies={longterm}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        onQuickAdd={(name) => handleQuickAdd('longterm', name)}
      />
    </div>
  )
}
