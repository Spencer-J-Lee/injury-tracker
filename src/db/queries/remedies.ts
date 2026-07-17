import { db } from "@/db/schema";
import type { RemedyCategory, Remedy } from "@/types/models";
import { REMEDY_CATEGORIES, sortByCategoryThenName } from "@/lib/categories";

export async function listRemediesForInjury(injuryId: string) {
  const remedies = await db.remedies
    .where("injuryId")
    .equals(injuryId)
    .filter((remedy) => !remedy.archivedAt)
    .toArray();
  return sortByCategoryThenName(remedies, REMEDY_CATEGORIES);
}

export async function listAllRemediesForInjury(injuryId: string) {
  const remedies = await db.remedies
    .where("injuryId")
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
}): Promise<Remedy> {
  const remedy: Remedy = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    name: input.name,
    description: input.description,
    providesImmediateRelief: input.providesImmediateRelief,
    category: input.category,
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
      "name" | "description" | "category" | "providesImmediateRelief"
    >
  >,
) {
  await db.remedies.update(id, changes);
}

export async function archiveRemedy(id: string) {
  await db.remedies.update(id, { archivedAt: new Date().toISOString() });
}

export async function getRemediesByIds(ids: string[]): Promise<Remedy[]> {
  if (ids.length === 0) return [];
  const remedies = await db.remedies.bulkGet(ids);
  return remedies.filter((r): r is Remedy => r !== undefined);
}
