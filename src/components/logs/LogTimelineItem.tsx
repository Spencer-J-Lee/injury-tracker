import { useState } from 'react'
import clsx from 'clsx'
import type { LogEntry, Remedy } from '@/types/models'
import { Badge } from '@/components/ui/Badge'
import { formatTimestamp } from '@/lib/dates'
import { deleteLogEntry } from '@/db/queries/logEntries'
import { LogEntryEditModal } from '@/components/logs/LogEntryEditModal'

function painTone(painLevel: number | undefined): 'slate' | 'green' | 'amber' | 'red' {
  if (painLevel === undefined) return 'slate'
  if (painLevel <= 3) return 'green'
  if (painLevel <= 6) return 'amber'
  return 'red'
}

function painLabel(painLevel: number | undefined): string {
  if (painLevel === undefined) return 'Not rated'
  if (painLevel === 0) return 'None'
  if (painLevel <= 3) return 'Mild'
  if (painLevel <= 6) return 'Moderate'
  if (painLevel <= 9) return 'Severe'
  return 'Extreme'
}

function freqTone(painFrequency: number | undefined): 'slate' | 'green' | 'amber' | 'red' {
  if (painFrequency === undefined) return 'slate'
  if (painFrequency <= 33) return 'green'
  if (painFrequency <= 66) return 'amber'
  return 'red'
}

export function LogTimelineItem({ entry, remedyMap }: { entry: LogEntry; remedyMap: Map<string, Remedy> }) {
  const [editing, setEditing] = useState(false)
  const hasDetails = entry.remedyIds.length > 0 || Boolean(entry.notes)

  return (
    <li className="rounded-[12px] border border-subtle px-[14px] py-3">
      <div className={clsx('flex items-center justify-between gap-2', hasDetails && 'mb-2')}>
        <span className="text-[13px] text-ink-muted">{formatTimestamp(entry.timestamp)}</span>
        <div className="flex items-center gap-1.5">
          <Badge tone={painTone(entry.painLevel)}>
            {entry.painLevel === undefined ? 'Not rated' : `${painLabel(entry.painLevel)} · ${entry.painLevel}/10`}
          </Badge>
          {entry.painFrequency !== undefined && (
            <Badge tone={freqTone(entry.painFrequency)}>{entry.painFrequency}% freq</Badge>
          )}
          <button
            onClick={() => setEditing(true)}
            className="rounded-md px-1.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent-soft-text"
          >
            edit
          </button>
          <button
            onClick={() => deleteLogEntry(entry.id)}
            className="rounded-md px-1.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-pain-red-bg hover:text-pain-red"
          >
            delete
          </button>
        </div>
      </div>

      {entry.remedyIds.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {entry.remedyIds.map((remedyId) => {
            const remedy = remedyMap.get(remedyId)
            return (
              <Badge key={remedyId} tone="indigo">
                {remedy?.name ?? 'Unknown remedy'}
              </Badge>
            )
          })}
        </div>
      )}

      {entry.notes && <p className="text-[13px] text-ink-secondary">{entry.notes}</p>}

      <LogEntryEditModal entry={entry} open={editing} onClose={() => setEditing(false)} />
    </li>
  )
}
