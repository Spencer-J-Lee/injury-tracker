import { db } from '@/db/schema';
import type { Activity, ActivityBodyPart } from '@/types/models';

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
  return db.transaction('rw', db.activities, async () => {
    const siblings = (await db.activities.toArray()).filter(
      (activity) => activity.sectionId === input.sectionId,
    );
    const nextPosition =
      siblings.length > 0
        ? Math.max(...siblings.map((activity) => activity.position)) + 1
        : 0;
    const activity: Activity = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      sectionId: input.sectionId,
      bodyPartsRested: input.bodyPartsRested,
      position: nextPosition,
      createdAt: new Date().toISOString(),
    };
    await db.activities.add(activity);
    return activity;
  });
}

export async function updateActivity(
  id: string,
  changes: Partial<
    Pick<Activity, 'name' | 'description' | 'sectionId' | 'bodyPartsRested'>
  >,
) {
  await db.activities.update(id, changes);
}

export async function archiveActivity(id: string) {
  await db.activities.update(id, { archivedAt: new Date().toISOString() });
}

export async function reorderActivities(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.activities, async () => {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.activities.update(id, { position: index }),
      ),
    );
  });
}
