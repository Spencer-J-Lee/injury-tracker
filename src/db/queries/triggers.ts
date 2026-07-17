import { db } from "@/db/schema";
import type { TriggerCategory, Trigger } from "@/types/models";
import { TRIGGER_CATEGORIES, sortByCategoryThenName } from "@/lib/categories";

export async function listActiveTriggersForInjury(injuryId: string) {
  const triggers = await db.triggers
    .where("injuryId")
    .equals(injuryId)
    .filter((trigger) => !trigger.archivedAt)
    .toArray();
  return sortByCategoryThenName(triggers, TRIGGER_CATEGORIES);
}

export async function listAllTriggersForInjury(injuryId: string) {
  const triggers = await db.triggers.where("injuryId").equals(injuryId).toArray();
  return sortByCategoryThenName(triggers, TRIGGER_CATEGORIES);
}

export async function createTrigger(input: {
  injuryId: string;
  name: string;
  description?: string;
  category?: TriggerCategory;
}): Promise<Trigger> {
  const trigger: Trigger = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    name: input.name,
    description: input.description,
    category: input.category,
    createdAt: new Date().toISOString(),
  };
  await db.triggers.add(trigger);
  return trigger;
}

export async function updateTrigger(
  id: string,
  changes: Partial<Pick<Trigger, "name" | "description" | "category">>,
) {
  await db.triggers.update(id, changes);
}

export async function archiveTrigger(id: string) {
  await db.triggers.update(id, { archivedAt: new Date().toISOString() });
}

export async function getTriggersByIds(ids: string[]): Promise<Trigger[]> {
  if (ids.length === 0) return [];
  const triggers = await db.triggers.bulkGet(ids);
  return triggers.filter((t): t is Trigger => t !== undefined);
}
