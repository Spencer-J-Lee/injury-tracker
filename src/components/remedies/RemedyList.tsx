import { useMemo, useState } from 'react'
import { faPen, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import type { RemedyType } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { RemedyForm } from '@/components/remedies/RemedyForm'
import { useRemedies } from '@/hooks/useRemedies'
import { useLogEntriesForInjury } from '@/hooks/useLogEntriesForInjury'
import { createRemedy, archiveRemedy, updateRemedy } from '@/db/queries/remedies'

function RemedyGroup({
  title,
  type,
  injuryId,
  usageCounts,
}: {
  title: string
  type: RemedyType
  injuryId: string
  usageCounts: Map<string, number>
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
                  type={remedy.type}
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
                className="flex items-center justify-between gap-2 rounded-[10px] border border-subtle px-3 py-[9px]"
              >
                <div className="min-w-0 truncate">
                  <p className="text-[13px] text-ink">{remedy.name}</p>
                  {remedy.description && (
                    <p className="text-xs text-ink-muted">{remedy.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {/* <span className="text-xs text-ink-muted">×{usageCounts.get(remedy.id) ?? 0}</span> */}
                  <IconButton icon={faPen} label="Edit remedy" onClick={() => setEditingId(remedy.id)} />
                  <IconButton
                    icon={faBoxArchive}
                    tone="danger"
                    label="Archive remedy"
                    onClick={() => archiveRemedy(remedy.id)}
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <RemedyForm
            type={type}
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
  const logEntries = useLogEntriesForInjury(injuryId)

  const usageCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of logEntries ?? []) {
      for (const remedyId of entry.remedyIds) {
        counts.set(remedyId, (counts.get(remedyId) ?? 0) + 1)
      }
    }
    return counts
  }, [logEntries])

  return (
    <Card className="space-y-5">
      <h3 className="font-heading text-sm font-semibold text-ink-emphasis">Remedies</h3>
      <RemedyGroup title="Relief" type="relief" injuryId={injuryId} usageCounts={usageCounts} />
      <RemedyGroup title="Long-term" type="longterm" injuryId={injuryId} usageCounts={usageCounts} />
    </Card>
  )
}
