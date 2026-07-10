import { useLiveQuery } from "dexie-react-hooks";
import { listRecentLogEntries } from "@/db/queries/logEntries";

export function useRecentLogEntries(limit = 10) {
  return useLiveQuery(() => listRecentLogEntries(limit), [limit], []);
}
