import { useLiveQuery } from "dexie-react-hooks";
import { listAllRemediesForInjury } from "@/db/queries/remedies";

export function useAllRemediesForInjury(injuryId: string | undefined) {
  return useLiveQuery(
    () => (injuryId ? listAllRemediesForInjury(injuryId) : []),
    [injuryId],
    [],
  );
}
