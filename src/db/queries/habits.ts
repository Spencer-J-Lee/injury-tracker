import { db } from "@/db/schema";
import type { Habit } from "@/types/models";

export async function listActiveHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter((habit) => !habit.archivedAt)
    .sort((a, b) => a.position - b.position);
}

export async function createHabit(input: {
  name: string;
  description?: string;
}): Promise<Habit> {
  return db.transaction("rw", db.habits, async () => {
    const existing = await db.habits.toArray();
    const nextPosition =
      existing.length > 0
        ? Math.max(...existing.map((habit) => habit.position)) + 1
        : 0;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      position: nextPosition,
      createdAt: new Date().toISOString(),
    };
    await db.habits.add(habit);
    return habit;
  });
}

export async function updateHabit(
  id: string,
  changes: Partial<Pick<Habit, "name" | "description">>,
) {
  await db.habits.update(id, changes);
}

export async function archiveHabit(id: string) {
  await db.habits.update(id, { archivedAt: new Date().toISOString() });
}

export async function reorderHabits(orderedIds: string[]): Promise<void> {
  await db.transaction("rw", db.habits, async () => {
    await Promise.all(
      orderedIds.map((id, index) => db.habits.update(id, { position: index })),
    );
  });
}
