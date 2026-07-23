import { useEntitiesForInjury } from "@/hooks/useEntitiesForInjury";
import { listLogEntriesForInjury } from "@/db/queries/logEntries";

export function useLogEntriesForInjury(
  injuryId: string | undefined,
  limit?: number,
) {
  return useEntitiesForInjury(listLogEntriesForInjury, injuryId, limit);
}
