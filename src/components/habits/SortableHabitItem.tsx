import { faPen, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton } from '@/components/ui/IconButton';
import { SortableCard } from '@/components/ui/SortableCard';
import { HabitForm } from '@/components/habits/HabitForm';
import { archiveHabit } from '@/db/queries/habits';
import type { Habit } from '@/types/models';

interface SortableHabitItemProps {
  habit: Habit;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (values: {
    name: string;
    description?: string;
  }) => Promise<void>;
}

export function SortableHabitItem({
  habit,
  editing,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
}: SortableHabitItemProps) {
  const { setNodeRef, transform, transition } = useSortable({
    id: habit.id,
    disabled: editing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <li ref={setNodeRef} style={style}>
        <HabitForm
          initial={{
            name: habit.name,
            description: habit.description ?? '',
          }}
          submitLabel="Save"
          onCancel={onCancelEdit}
          onSubmit={onSubmitEdit}
        />
      </li>
    );
  }

  return (
    <SortableCard
      id={habit.id}
      as="li"
      title={habit.name}
      description={
        habit.description && (
          <p className="text-ink-muted mt-1.5 text-base text-pretty whitespace-pre-line">
            {habit.description}
          </p>
        )
      }
      actions={
        <>
          <IconButton icon={faPen} label="Edit habit" onClick={onEdit} />
          <IconButton
            icon={faBoxArchive}
            tone="danger"
            label="Archive habit"
            onClick={() => archiveHabit(habit.id)}
          />
        </>
      }
    />
  );
}
