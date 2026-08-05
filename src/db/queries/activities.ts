import { db } from "@/db/schema";
import type { Activity, ActivityBodyPart } from "@/types/models";

export async function listActiveActivities(): Promise<Activity[]> {
  const activities = await db.activities.toArray();
  return activities.filter((activity) => !activity.archivedAt);
}

export async function getActivity(id: string): Promise<Activity | undefined> {
  return db.activities.get(id);
}

export async function createActivity(input: {
  name: string;
  description?: string;
  sectionId?: string;
  bodyPartsRested: ActivityBodyPart[];
}): Promise<Activity> {
  const activity: Activity = {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    sectionId: input.sectionId,
    bodyPartsRested: input.bodyPartsRested,
    createdAt: new Date().toISOString(),
  };
  await db.activities.add(activity);
  return activity;
}

export async function updateActivity(
  id: string,
  changes: Partial<
    Pick<Activity, "name" | "description" | "sectionId" | "bodyPartsRested">
  >,
) {
  await db.activities.update(id, changes);
}

export async function archiveActivity(id: string) {
  await db.activities.update(id, { archivedAt: new Date().toISOString() });
}
