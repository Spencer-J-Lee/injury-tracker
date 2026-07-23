import { Card } from "@/components/ui/Card";
import { LoadMoreButton } from "@/components/ui/LoadMoreButton";
import { useInjury } from "@/hooks/useInjury";
import { listMorningCheckInsForInjury } from "@/db/queries/morningCheckIns";
import { usePaginatedEntitiesForInjury } from "@/hooks/usePaginatedEntitiesForInjury";
import { MorningCheckInTimelineItem } from "@/components/logs/MorningCheckInTimelineItem";

export function MorningCheckInTimeline({ injuryId }: { injuryId: string }) {
  const injury = useInjury(injuryId);
  const { visibleRows, hasMore, loadMore } = usePaginatedEntitiesForInjury(
    listMorningCheckInsForInjury,
    injuryId,
  );

  return (
    <Card>
      <h3 className="font-heading text-ink-emphasis mb-4 text-lg font-semibold">
        Morning Check-Ins
      </h3>
      {visibleRows.length === 0 ? (
        <p className="text-ink-muted text-lg">No morning check-ins yet.</p>
      ) : (
        <ul className="space-y-4">
          {visibleRows.map((entry) => (
            <MorningCheckInTimelineItem
              key={entry.id}
              entry={entry}
              injury={injury ?? undefined}
            />
          ))}
        </ul>
      )}
      {hasMore && <LoadMoreButton onClick={loadMore} />}
    </Card>
  );
}
