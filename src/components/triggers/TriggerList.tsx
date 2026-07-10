import { useState } from 'react'
import { faPen, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { EntityForm } from '@/components/ui/EntityForm'
import { useTriggers } from '@/hooks/useTriggers'
import { createTrigger, archiveTrigger, updateTrigger } from '@/db/queries/triggers'

export function TriggerList({ injuryId }: { injuryId: string }) {
  const triggers = useTriggers(injuryId) ?? []
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card>
      <h3 className="mb-5 font-heading text-sm font-semibold text-ink-emphasis">Triggers</h3>

      {triggers.length > 0 && (
        <ul className="space-y-2 mb-2">
          {triggers.map((trigger) =>
            editingId === trigger.id ? (
              <li key={trigger.id}>
                <EntityForm
                  nameLabel="Trigger Name"
                  initial={{ name: trigger.name, description: trigger.description ?? '' }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateTrigger(trigger.id, values)
                    setEditingId(null)
                  }}
                />
              </li>
            ) : (
              <li
                key={trigger.id}
                className="rounded-[10px] border border-subtle px-3 py-[9px]"
              >
                <div className="min-w-0 flex justify-between gap-2 items-center">
                  <p className="text-[13px] text-ink">{trigger.name}</p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <IconButton icon={faPen} label="Edit trigger" onClick={() => setEditingId(trigger.id)} />
                    <IconButton
                      icon={faBoxArchive}
                      tone="danger"
                      label="Archive trigger"
                      onClick={() => archiveTrigger(trigger.id)}
                    />
                  </div>
                </div>
                {trigger.description && (
                  <p className="mt-1 text-xs text-ink-muted">{trigger.description}</p>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <EntityForm
            nameLabel="Trigger Name"
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createTrigger({ injuryId, ...values })
            }}
          />
        </div>
      ) : (
        <Button variant="dashed" onClick={() => setAdding(true)} className="w-full">
          + Add trigger
        </Button>
      )}
    </Card>
  )
}
