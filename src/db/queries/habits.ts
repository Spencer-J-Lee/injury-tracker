import { db } from '@/db/schema';
import { HABIT_SECTIONS } from '@/lib/categories';
import type { Habit, HabitSection } from '@/types/models';

export async function listActiveHabits(): Promise<Habit[]> {
  const habits = await db.habits.toArray();
  return habits
    .filter((habit) => !habit.archivedAt)
    .sort((a, b) => a.position - b.position);
}

async function getMaxPositionInSection(section: HabitSection): Promise<number> {
  const habits = await db.habits.where('section').equals(section).toArray();
  return habits.length > 0
    ? Math.max(...habits.map((habit) => habit.position))
    : -1;
}

export async function createHabit(input: {
  name: string;
  description?: string;
  optional?: boolean;
}): Promise<Habit> {
  return db.transaction('rw', db.habits, async () => {
    const [defaultSection] = HABIT_SECTIONS;
    const nextPosition = (await getMaxPositionInSection(defaultSection)) + 1;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      optional: input.optional,
      section: defaultSection,
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
    const habit = await db.habits.get(id);
    if (!habit) return;
    const nextPosition = (await getMaxPositionInSection(habit.section)) + 1;
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

export async function reorderHabits(
  order: Array<{ id: string; section: HabitSection }>,
): Promise<void> {
  await db.transaction('rw', db.habits, async () => {
    const positionsBySection = new Map<HabitSection, number>();
    await Promise.all(
      order.map(({ id, section }) => {
        const position = positionsBySection.get(section) ?? 0;
        positionsBySection.set(section, position + 1);
        return db.habits.update(id, { section, position });
      }),
    );
  });
}
