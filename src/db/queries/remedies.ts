import { db } from '@/db/schema';
import type { RemedyCategory, Remedy } from '@/types/models';
import { REMEDY_CATEGORIES, sortByCategoryThenName } from '@/lib/categories';

export async function listRemediesForInjury(injuryId: string) {
  const remedies = await db.remedies
    .where('injuryId')
    .equals(injuryId)
    .filter((remedy) => !remedy.archivedAt)
    .toArray();
  return sortByCategoryThenName(remedies, REMEDY_CATEGORIES);
}

export async function listAllRemediesForInjury(injuryId: string) {
  const remedies = await db.remedies
    .where('injuryId')
    .equals(injuryId)
    .toArray();
  return sortByCategoryThenName(remedies, REMEDY_CATEGORIES);
}

export async function createRemedy(input: {
  injuryId: string;
  name: string;
  description?: string;
  providesImmediateRelief: boolean;
  category?: RemedyCategory;
  isProgramExercise?: boolean;
}): Promise<Remedy> {
  const remedy: Remedy = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    name: input.name,
    description: input.description,
    providesImmediateRelief: input.providesImmediateRelief,
    category: input.category,
    isProgramExercise: input.isProgramExercise,
    createdAt: new Date().toISOString(),
  };
  await db.remedies.add(remedy);
  return remedy;
}

export async function updateRemedy(
  id: string,
  changes: Partial<
    Pick<
      Remedy,
      | 'name'
      | 'description'
      | 'category'
      | 'providesImmediateRelief'
      | 'isProgramExercise'
    >
  >,
) {
  await db.remedies.update(id, changes);
}

export async function listProgramExerciseRemedies(): Promise<Remedy[]> {
  const remedies = await db.remedies
    .filter((remedy) => !!remedy.isProgramExercise && !remedy.archivedAt)
    .toArray();
  return sortByCategoryThenName(remedies, REMEDY_CATEGORIES);
}

export async function archiveRemedy(id: string) {
  await db.remedies.update(id, { archivedAt: new Date().toISOString() });
}

export async function listArchivedRemediesForInjury(injuryId: string) {
  const remedies = await db.remedies
    .where('injuryId')
    .equals(injuryId)
    .filter((remedy) => !!remedy.archivedAt)
    .toArray();
  return sortByCategoryThenName(remedies, REMEDY_CATEGORIES);
}

export async function unarchiveRemedy(id: string) {
  await db.remedies.update(id, { archivedAt: undefined });
}

export async function deleteRemedy(id: string) {
  await db.transaction(
    'rw',
    db.remedies,
    db.plannedExercises,
    db.logEntries,
    async () => {
      await db.plannedExercises.where('remedyId').equals(id).delete();
      await db.logEntries
        .where('remedyIds')
        .equals(id)
        .modify((entry) => {
          entry.remedyIds = entry.remedyIds.filter(
            (remedyId) => remedyId !== id,
          );
        });
      await db.remedies.delete(id);
    },
  );
}

export async function getRemediesByIds(ids: string[]): Promise<Remedy[]> {
  if (ids.length === 0) return [];
  const remedies = await db.remedies.bulkGet(ids);
  return remedies.filter((r): r is Remedy => r !== undefined);
}
