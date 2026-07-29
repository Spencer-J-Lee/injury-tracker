import { db } from "@/db/schema";

export function listHabitCompletionsForWeek(startDate: string, endDate: string) {
  return db.habitCompletions
    .where("date")
    .between(startDate, endDate, true, true)
    .toArray();
}

export async function toggleHabitCompletion(habitId: string, date: string) {
  await db.transaction("rw", db.habitCompletions, async () => {
    const existing = await db.habitCompletions
      .where("[habitId+date]")
      .equals([habitId, date])
      .first();

    if (existing) {
      await db.habitCompletions.delete(existing.id);
    } else {
      await db.habitCompletions.add({
        id: crypto.randomUUID(),
        habitId,
        date,
        createdAt: new Date().toISOString(),
      });
    }
  });
}
