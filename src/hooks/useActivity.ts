import { useLiveQuery } from "dexie-react-hooks";
import { getActivity } from "@/db/queries/activities";

export function useActivity(id: string | undefined) {
  return useLiveQuery(() => (id ? getActivity(id) : undefined), [id]);
}
