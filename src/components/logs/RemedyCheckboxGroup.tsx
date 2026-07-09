import { useState } from 'react'
import type { Remedy, RemedyType } from '@/types/models'
import { useRemedies } from '@/hooks/useRemedies'
import { createRemedy } from '@/db/queries/remedies'
import { Label } from '../ui/Label'
import { TogglePill } from '@/components/ui/TogglePill'
import { Button } from '../ui/Button'
import { RemedyForm } from '../remedies/RemedyForm'

interface RemedyCheckboxGroupProps {
  injuryId: string
  selectedRemedyIds: string[]
  onToggle: (remedyId: string) => void
}

function RemedySection({
  title,
  type,
  remedies,
  selectedRemedyIds,
  onToggle,
  onAdd,
}: {
  title: string
  type: RemedyType
  remedies: Remedy[]
  selectedRemedyIds: string[]
  onToggle: (remedyId: string) => void
  onAdd: (values: { name: string; description: string }) => void | Promise<void>
}) {
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {remedies.map((remedy) => {
          const selected = selectedRemedyIds.includes(remedy.id)
          return (
            <TogglePill key={remedy.id} selected={selected} onClick={() => onToggle(remedy.id)}>
              {remedy.name}
            </TogglePill>
          )
        })}
        <Button variant="dashed" size="sm" onClick={() => setAdding(true)}>
          + Add
        </Button>
      </div>
      {adding && (
        <div className="mt-1.5">
          <RemedyForm
            type={type}
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await onAdd(values)
              setAdding(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

export function RemedyCheckboxGroup({ injuryId, selectedRemedyIds, onToggle }: RemedyCheckboxGroupProps) {
  const remedies = useRemedies(injuryId) ?? []
  const relief = remedies.filter((r) => r.type === 'relief')
  const longterm = remedies.filter((r) => r.type === 'longterm')

  const handleAdd = async (type: RemedyType, values: { name: string; description: string }) => {
    const created = await createRemedy({
      injuryId,
      name: values.name,
      description: values.description || undefined,
      type,
    })
    onToggle(created.id)
  }

  return (
    <div className="space-y-3">
      <RemedySection
        title="Relief"
        type="relief"
        remedies={relief}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        onAdd={(values) => handleAdd('relief', values)}
      />
      <RemedySection
        title="Long-term"
        type="longterm"
        remedies={longterm}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        onAdd={(values) => handleAdd('longterm', values)}
      />
    </div>
  )
}
