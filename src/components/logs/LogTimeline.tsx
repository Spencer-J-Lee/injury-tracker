import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { useLogEntriesForInjury } from '@/hooks/useLogEntriesForInjury'
import { useAllRemediesForInjury } from '@/hooks/useAllRemediesForInjury'
import { useAllTriggersForInjury } from '@/hooks/useAllTriggersForInjury'
import { LogTimelineItem } from '@/components/logs/LogTimelineItem'

const PAGE_SIZE = 15

export function LogTimeline({ injuryId }: { injuryId: string }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const entries = useLogEntriesForInjury(injuryId, visibleCount + 1)
  const remedies = useAllRemediesForInjury(injuryId)
  const triggers = useAllTriggersForInjury(injuryId)

  const remedyMap = useMemo(() => new Map((remedies ?? []).map((r) => [r.id, r])), [remedies])
  const triggerMap = useMemo(() => new Map((triggers ?? []).map((t) => [t.id, t])), [triggers])
  const hasMore = (entries?.length ?? 0) > visibleCount
  const visibleEntries = (entries ?? []).slice(0, visibleCount)

  return (
    <Card>
      <h3 className="mb-3 font-heading text-sm font-semibold text-ink-emphasis">History</h3>
      {visibleEntries.length === 0 ? (
        <p className="text-sm text-ink-muted">No log entries yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {visibleEntries.map((entry) => (
            <LogTimelineItem key={entry.id} entry={entry} remedyMap={remedyMap} triggerMap={triggerMap} />
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          className="mt-3 text-[13px] font-semibold text-accent-soft-text hover:underline"
        >
          Load more
        </button>
      )}
    </Card>
  )
}
