import { db } from "@/db/schema";
import type { Habit } from "@/types/models";

export async function listActiveHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter((habit) => !habit.archivedAt)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createHabit(input: {
  name: string;
  description?: string;
}): Promise<Habit> {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    createdAt: new Date().toISOString(),
  };
  await db.habits.add(habit);
  return habit;
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
