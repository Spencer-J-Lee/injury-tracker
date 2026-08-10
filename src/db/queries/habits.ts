import { db } from '@/db/schema';
import type { Habit } from '@/types/models';

export async function listActiveHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter((habit) => !habit.archivedAt)
    .sort((a, b) => a.position - b.position);
}

export async function createHabit(input: {
  name: string;
  description?: string;
  optional?: boolean;
}): Promise<Habit> {
  return db.transaction('rw', db.habits, async () => {
    const existing = await db.habits.toArray();
    const nextPosition =
      existing.length > 0
        ? Math.max(...existing.map((habit) => habit.position)) + 1
        : 0;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      optional: input.optional,
      position: nextPosition,
      createdAt: new Date().toISOString(),
    };
    await db.habits.add(habit);
    return habit;
  });
}

export async function updateHabit(
  id: string,
  changes: Partial<Pick<Habit, 'name' | 'description' | 'optional'>>,
) {
  await db.habits.update(id, changes);
}

export async function archiveHabit(id: string) {
  await db.habits.update(id, { archivedAt: new Date().toISOString() });
}

export async function listArchivedHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter((habit) => !!habit.archivedAt)
    .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''));
}

export async function unarchiveHabit(id: string) {
  await db.transaction('rw', db.habits, async () => {
    const active = await listActiveHabits();
    const nextPosition =
      active.length > 0
        ? Math.max(...active.map((habit) => habit.position)) + 1
        : 0;
    await db.habits.update(id, {
      archivedAt: undefined,
      position: nextPosition,
    });
  });
}

export async function deleteHabit(id: string) {
  await db.transaction('rw', db.habits, db.habitCompletions, async () => {
    await db.habitCompletions.where('habitId').equals(id).delete();
    await db.habits.delete(id);
  });
}

export async function reorderHabits(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.habits, async () => {
    await Promise.all(
      orderedIds.map((id, index) => db.habits.update(id, { position: index })),
    );
  });
}
