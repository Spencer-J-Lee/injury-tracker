import { useState } from 'react'
import { faPen, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import type { RemedyType } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { RemedyForm } from '@/components/remedies/RemedyForm'
import { useRemedies } from '@/hooks/useRemedies'
import { createRemedy, archiveRemedy, updateRemedy } from '@/db/queries/remedies'

function RemedyGroup({
  title,
  type,
  injuryId,
}: {
  title: string
  type: RemedyType
  injuryId: string
}) {
  const remedies = useRemedies(injuryId)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const filtered = (remedies ?? []).filter((r) => r.type === type)

  return (
    <div>
      <h4 className="mb-2.5 text-[11px] font-semibold tracking-wide text-ink-faint uppercase">{title}</h4>

      {filtered.length > 0 && (
        <ul className="space-y-2 mb-2">
          {filtered.map((remedy) =>
            editingId === remedy.id ? (
              <li key={remedy.id}>
                <RemedyForm
                  initial={{ name: remedy.name, description: remedy.description ?? '' }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateRemedy(remedy.id, values)
                    setEditingId(null)
                  }}
                />
              </li>
            ) : (
              <li
                key={remedy.id}
                className="rounded-[10px] border border-subtle px-3 py-[9px]"
              >
                <div className="min-w-0 flex justify-between gap-2 items-center">
                  <p className="text-[13px] text-ink">{remedy.name}</p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <IconButton icon={faPen} label="Edit remedy" onClick={() => setEditingId(remedy.id)} />
                    <IconButton
                      icon={faBoxArchive}
                      tone="danger"
                      label="Archive remedy"
                      onClick={() => archiveRemedy(remedy.id)}
                    />
                  </div>
                </div>
                {remedy.description && (
                  <p className="mt-1 text-xs text-ink-muted">{remedy.description}</p>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <RemedyForm
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createRemedy({ injuryId, type, ...values })
            }}
          />
        </div>
      ) : (
        <Button variant="dashed" onClick={() => setAdding(true)} className="w-full">
          + Add {title.toLowerCase()} remedy
        </Button>
      )}
    </div>
  )
}

export function RemedyList({ injuryId }: { injuryId: string }) {
  return (
    <Card className="space-y-5">
      <h3 className="font-heading text-sm font-semibold text-ink-emphasis">Remedies</h3>
      <RemedyGroup title="Relief" type="relief" injuryId={injuryId} />
      <RemedyGroup title="Long-term" type="longterm" injuryId={injuryId} />
    </Card>
  )
}
