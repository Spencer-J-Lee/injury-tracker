import { useMemo, useState } from 'react'
import type { RemedyType } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
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

      {filtered.length === 0 && !adding && (
        <p className="mb-2 text-[13px] text-ink-muted">None added yet.</p>
      )}

      <ul className="space-y-2">
        {filtered.map((remedy) =>
          editingId === remedy.id ? (
            <li key={remedy.id}>
              <RemedyForm
                type={remedy.type}
                initial={{ name: remedy.name, description: remedy.description ?? '' }}
                submitLabel="Save changes"
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
                <span className="text-[13px] text-ink">{remedy.name}</span>
                {remedy.description && (
                  <span className="ml-2 text-xs text-ink-muted">{remedy.description}</span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-ink-muted">×{usageCounts.get(remedy.id) ?? 0}</span>
                <button
                  onClick={() => setEditingId(remedy.id)}
                  className="rounded-md px-1.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent-soft-text"
                >
                  edit
                </button>
                <button
                  onClick={() => archiveRemedy(remedy.id)}
                  className="rounded-md px-1.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-pain-red-bg hover:text-pain-red"
                >
                  archive
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {adding ? (
        <div className="mt-2">
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
        <Button variant="dashed" onClick={() => setAdding(true)} className="mt-2 w-full">
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
