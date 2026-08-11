import { useSortable } from '@dnd-kit/sortable';
import { HABIT_SECTION_LABELS } from '@/lib/categories';
import type { HabitSection } from '@/types/models';

interface HabitSectionHeaderProps {
  section: HabitSection;
}

export function HabitSectionHeader({ section }: HabitSectionHeaderProps) {
  const { setNodeRef } = useSortable({
    id: `header:${section}`,
    disabled: { draggable: true, droppable: false },
  });

  return (
    <li ref={setNodeRef} className="flex items-center gap-2 py-1">
      <span className="text-ink-faint text-xs font-semibold tracking-wide uppercase">
        {HABIT_SECTION_LABELS[section]}
      </span>
      <div className="border-subtle h-px flex-1 border-t border-dashed" />
    </li>
  );
}
