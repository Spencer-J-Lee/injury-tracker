import { useLiveQuery } from "dexie-react-hooks";

export function useEntitiesForInjury<T>(
  listFn: (injuryId: string, limit?: number) => Promise<T[]>,
  injuryId: string | undefined,
  limit?: number,
) {
  return useLiveQuery(
    () => (injuryId ? listFn(injuryId, limit) : []),
    [injuryId, limit],
    [],
  );
}
