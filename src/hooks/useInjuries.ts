import { useLiveQuery } from "dexie-react-hooks";
import { listInjuries } from "@/db/queries/injuries";

export function useInjuries() {
  return useLiveQuery(() => listInjuries(), [], []);
}
