import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { LoadMoreButton } from "@/components/ui/LoadMoreButton";
import { listLogEntriesForInjury } from "@/db/queries/logEntries";
import { usePaginatedEntitiesForInjury } from "@/hooks/usePaginatedEntitiesForInjury";
import { useAllRemediesForInjury } from "@/hooks/useAllRemediesForInjury";
import { useAllTriggersForInjury } from "@/hooks/useAllTriggersForInjury";
import { LogTimelineItem } from "@/components/logs/LogTimelineItem";

export function LogTimeline({ injuryId }: { injuryId: string }) {
  const {
    visibleRows: visibleEntries,
    hasMore,
    loadMore,
  } = usePaginatedEntitiesForInjury(listLogEntriesForInjury, injuryId);
  const remedies = useAllRemediesForInjury(injuryId);
  const triggers = useAllTriggersForInjury(injuryId);

  const remedyMap = useMemo(
    () => new Map((remedies ?? []).map((r) => [r.id, r])),
    [remedies],
  );
  const triggerMap = useMemo(
    () => new Map((triggers ?? []).map((t) => [t.id, t])),
    [triggers],
  );

  return (
    <Card>
      <h3 className="font-heading text-ink-emphasis mb-4 text-lg font-semibold">
        Main History
      </h3>
      {visibleEntries.length === 0 ? (
        <p className="text-ink-muted text-lg">No log entries yet.</p>
      ) : (
        <ul className="space-y-4">
          {visibleEntries.map((entry) => (
            <LogTimelineItem
              key={entry.id}
              entry={entry}
              remedyMap={remedyMap}
              triggerMap={triggerMap}
            />
          ))}
        </ul>
      )}
      {hasMore && <LoadMoreButton onClick={loadMore} />}
    </Card>
  );
}
