import { HABIT_SECTIONS } from '@/lib/categories';
import type { Habit, HabitSection } from '@/types/models';

export interface HabitSectionGroup {
  section: HabitSection;
  habits: Habit[];
}

export function groupHabitsBySection(habits: Habit[]): HabitSectionGroup[] {
  return HABIT_SECTIONS.map((section) => ({
    section,
    habits: habits
      .filter((habit) => habit.section === section)
      .sort((a, b) => a.position - b.position),
  })).filter((group) => group.habits.length > 0);
}
