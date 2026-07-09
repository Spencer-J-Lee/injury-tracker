import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { isBefore, subDays } from 'date-fns'
import { getLastExportedAt } from '@/db/backup'
import { listRecentLogEntries } from '@/db/queries/logEntries'
import { listInjuries } from '@/db/queries/injuries'

export function BackupBanner() {
  const [dismissed, setDismissed] = useState(false)
  const lastExportedAt = useLiveQuery(getLastExportedAt, [])
  const recentLog = useLiveQuery(() => listRecentLogEntries(1), [])
  const injuries = useLiveQuery(listInjuries, [])

  useEffect(() => setDismissed(false), [lastExportedAt])

  if (dismissed) return null
  if (!injuries || injuries.length === 0) return null

  const fourteenDaysAgo = subDays(new Date(), 14)
  const needsReminder = lastExportedAt
    ? isBefore(new Date(lastExportedAt), fourteenDaysAgo) &&
      (!recentLog?.[0] || isBefore(new Date(lastExportedAt), new Date(recentLog[0].timestamp)))
    : true

  if (!needsReminder) return null

  return (
    <div
      className="mb-5 flex items-center justify-between gap-3 rounded-xl border px-[14px] py-[10px] text-[13px]"
      style={{
        background: 'oklch(0.24 0.035 85)',
        borderColor: 'oklch(0.32 0.05 85)',
        color: 'oklch(0.85 0.09 85)',
      }}
    >
      <span>
        {lastExportedAt ? "It's been a while since your last backup." : 'Back up your data — it only lives in this browser.'}{' '}
        <Link to="/settings" className="font-semibold underline">
          Export now
        </Link>
      </span>
      <button onClick={() => setDismissed(true)} className="shrink-0 opacity-70 transition-opacity hover:opacity-100">
        ✕
      </button>
    </div>
  )
}
