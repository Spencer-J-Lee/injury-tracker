import { useState } from "react";
import { useEntitiesForInjury } from "@/hooks/useEntitiesForInjury";

const PAGE_SIZE = 15;

export function usePaginatedEntitiesForInjury<T>(
  listFn: (injuryId: string, limit?: number) => Promise<T[]>,
  injuryId: string,
) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const entities = useEntitiesForInjury(listFn, injuryId, visibleCount + 1);

  const hasMore = (entities ?? []).length > visibleCount;
  const visibleRows = (entities ?? []).slice(0, visibleCount);

  return {
    visibleRows,
    hasMore,
    loadMore: () => setVisibleCount((v) => v + PAGE_SIZE),
  };
}
