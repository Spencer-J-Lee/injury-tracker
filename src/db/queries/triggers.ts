import { db } from '@/db/schema';
import type { TriggerCategory, Trigger } from '@/types/models';
import { TRIGGER_CATEGORIES, sortByCategoryThenName } from '@/lib/categories';

export async function listActiveTriggersForInjury(injuryId: string) {
  const triggers = await db.triggers
    .where('injuryId')
    .equals(injuryId)
    .filter((trigger) => !trigger.archivedAt)
    .toArray();
  return sortByCategoryThenName(triggers, TRIGGER_CATEGORIES);
}

export async function listAllTriggersForInjury(injuryId: string) {
  const triggers = await db.triggers
    .where('injuryId')
    .equals(injuryId)
    .toArray();
  return sortByCategoryThenName(triggers, TRIGGER_CATEGORIES);
}

export async function createTrigger(input: {
  injuryId: string;
  name: string;
  description?: string;
  category?: TriggerCategory;
  isHighReactivity?: boolean;
}): Promise<Trigger> {
  const trigger: Trigger = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    name: input.name,
    description: input.description,
    category: input.category,
    isHighReactivity: input.isHighReactivity,
    createdAt: new Date().toISOString(),
  };
  await db.triggers.add(trigger);
  return trigger;
}

export async function updateTrigger(
  id: string,
  changes: Partial<
    Pick<Trigger, 'name' | 'description' | 'category' | 'isHighReactivity'>
  >,
) {
  await db.triggers.update(id, changes);
}

export async function archiveTrigger(id: string) {
  await db.triggers.update(id, { archivedAt: new Date().toISOString() });
}

export async function listArchivedTriggersForInjury(injuryId: string) {
  const triggers = await db.triggers
    .where('injuryId')
    .equals(injuryId)
    .filter((trigger) => !!trigger.archivedAt)
    .toArray();
  return sortByCategoryThenName(triggers, TRIGGER_CATEGORIES);
}

export async function unarchiveTrigger(id: string) {
  await db.triggers.update(id, { archivedAt: undefined });
}

export async function deleteTrigger(id: string) {
  await db.transaction('rw', db.triggers, db.logEntries, async () => {
    await db.logEntries
      .where('triggerIds')
      .equals(id)
      .modify((entry) => {
        entry.triggerIds = entry.triggerIds.filter(
          (triggerId) => triggerId !== id,
        );
      });
    await db.triggers.delete(id);
  });
}
