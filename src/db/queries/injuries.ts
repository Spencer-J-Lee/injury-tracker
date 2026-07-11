import { db } from "@/db/schema";
import type { Injury, InjuryStatus } from "@/types/models";

export function listInjuries() {
  return db.injuries.filter((injury) => !injury.archivedAt).toArray();
}

export function getInjury(id: string) {
  return db.injuries.get(id);
}

export async function createInjury(input: {
  bodyPart: string;
  injuryType: string;
  description?: string;
  status?: InjuryStatus;
}): Promise<Injury> {
  const now = new Date().toISOString();
  const injury: Injury = {
    id: crypto.randomUUID(),
    bodyPart: input.bodyPart,
    injuryType: input.injuryType,
    description: input.description,
    status: input.status ?? "active",
    createdAt: now,
    updatedAt: now,
  };
  await db.injuries.add(injury);
  return injury;
}

export async function updateInjury(
  id: string,
  changes: Partial<
    Pick<Injury, "bodyPart" | "injuryType" | "description" | "status">
  >,
) {
  await db.injuries.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function setInjuryStatus(id: string, status: InjuryStatus) {
  await updateInjury(id, { status });
}

export async function archiveInjury(id: string) {
  await db.injuries.update(id, { archivedAt: new Date().toISOString() });
}

export async function deleteInjuries(ids: string[]) {
  await db.transaction(
    "rw",
    db.injuries,
    db.remedies,
    db.logEntries,
    async () => {
      await db.logEntries.where("injuryId").anyOf(ids).delete();
      await db.remedies.where("injuryId").anyOf(ids).delete();
      await db.injuries.bulkDelete(ids);
    },
  );
}

export async function deleteInjury(id: string) {
  await deleteInjuries([id]);
}
