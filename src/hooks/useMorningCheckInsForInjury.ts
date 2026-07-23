import { useEntitiesForInjury } from "@/hooks/useEntitiesForInjury";
import { listMorningCheckInsForInjury } from "@/db/queries/morningCheckIns";

export function useMorningCheckInsForInjury(
  injuryId: string | undefined,
  limit?: number,
) {
  return useEntitiesForInjury(listMorningCheckInsForInjury, injuryId, limit);
}
