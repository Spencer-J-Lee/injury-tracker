import { useState } from 'react';
import { faPen, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { SortableCard } from '@/components/ui/SortableCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
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
    optional?: boolean;
  }) => Promise<void>;
}

export function SortableHabitItem({
  habit,
  editing,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
}: SortableHabitItemProps) {
  const [confirmingArchive, setConfirmingArchive] = useState(false);

  if (editing) {
    return (
      <li>
        <HabitForm
          initial={{
            name: habit.name,
            description: habit.description ?? '',
            optional: habit.optional ?? false,
          }}
          submitLabel="Save"
          onCancel={onCancelEdit}
          onSubmit={onSubmitEdit}
        />
      </li>
    );
  }

  return (
    <>
      <SortableCard
        id={habit.id}
        as="li"
        title={
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate">{habit.name}</span>
            {habit.optional && <Badge>Optional</Badge>}
          </span>
        }
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
              tone="warning"
              label="Archive habit"
              onClick={() => setConfirmingArchive(true)}
            />
          </>
        }
      />
      <ConfirmDialog
        open={confirmingArchive}
        title="Archive habit?"
        message={`"${habit.name}" will be moved to the archived list.`}
        confirmLabel="Archive"
        confirmVariant="warning"
        onConfirm={() => {
          archiveHabit(habit.id);
          setConfirmingArchive(false);
        }}
        onCancel={() => setConfirmingArchive(false)}
      />
    </>
  );
}
