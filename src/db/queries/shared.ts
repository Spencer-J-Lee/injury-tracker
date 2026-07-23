import type { EntityTable } from "dexie";

export function listForInjuryOrderedByTimestamp<T extends { id: string }>(
  table: EntityTable<T, "id">,
  injuryId: string,
  limit?: number,
) {
  const collection = table
    .where("[injuryId+timestamp]")
    .between([injuryId, ""], [injuryId, "￿"])
    .reverse();
  return limit ? collection.limit(limit).toArray() : collection.toArray();
}
