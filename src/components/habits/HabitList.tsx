import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HabitForm } from '@/components/habits/HabitForm';
import { SortableHabitItem } from '@/components/habits/SortableHabitItem';
import { useHabits } from '@/hooks/useHabits';
import { useArchivedHabits } from '@/hooks/useArchivedHabits';
import { useConfirmTarget } from '@/hooks/useConfirmTarget';
import {
  createHabit,
  updateHabit,
  unarchiveHabit,
  deleteHabit,
  reorderHabits,
} from '@/db/queries/habits';
import type { Habit } from '@/types/models';

export function HabitList() {
  const habits = useHabits() ?? [];
  const archivedHabits = useArchivedHabits() ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const confirmDelete = useConfirmTarget(archivedHabits);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex((habit) => habit.id === active.id);
    const newIndex = habits.findIndex((habit) => habit.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(habits, oldIndex, newIndex);
    try {
      await reorderHabits(reordered.map((habit) => habit.id));
    } catch (error) {
      console.error('Failed to reorder habits', error);
    }
  };

  return (
    <>
      <CollapsibleCard title="Manage Habits">
        {habits.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={habits.map((habit) => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="mb-2.5 space-y-2.5">
                {habits.map((habit) => (
                  <SortableHabitItem
                    key={habit.id}
                    habit={habit}
                    editing={editingId === habit.id}
                    onEdit={() => setEditingId(habit.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSubmitEdit={async (values) => {
                      await updateHabit(habit.id, values);
                      setEditingId(null);
                    }}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}

        {adding ? (
          <div>
            <HabitForm
              submitLabel="Add"
              onCancel={() => setAdding(false)}
              onSubmit={async (values) => {
                await createHabit(values);
                setAdding(false);
              }}
            />
          </div>
        ) : (
          <Button
            variant={habits.length > 0 ? 'ghost' : 'dashed'}
            size={habits.length > 0 ? 'sm' : 'md'}
            onClick={() => setAdding(true)}
            className="w-full"
          >
            + Add
          </Button>
        )}
      </CollapsibleCard>

      {archivedHabits.length > 0 && (
        <CollapsibleCard title="Archived" defaultOpen={false}>
          <ul className="space-y-2.5">
            {archivedHabits.map((habit) => (
              <ArchivedHabitRow
                key={habit.id}
                habit={habit}
                onDeleteRequest={() => confirmDelete.confirm(habit.id)}
              />
            ))}
          </ul>
        </CollapsibleCard>
      )}

      <ConfirmDialog
        open={confirmDelete.target !== undefined}
        title="Delete habit?"
        message={`"${confirmDelete.target?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDelete.target) deleteHabit(confirmDelete.target.id);
          confirmDelete.clear();
        }}
        onCancel={() => confirmDelete.clear()}
      />
    </>
  );
}

function ArchivedHabitRow({
  habit,
  onDeleteRequest,
}: {
  habit: Habit;
  onDeleteRequest: () => void;
}) {
  return (
    <Card as="li" size="md" variant="muted">
      <div className="flex min-w-0 items-start justify-between gap-2.5">
        <div>
          <p className="text-ink">{habit.name}</p>
          {habit.description && (
            <p className="text-ink-muted mt-1.5 text-sm text-pretty whitespace-pre-line">
              {habit.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <IconButton
            icon={faRotateLeft}
            label="Restore habit"
            onClick={() => unarchiveHabit(habit.id)}
          />
          <IconButton
            icon={faTrash}
            tone="danger"
            label="Delete habit"
            onClick={onDeleteRequest}
          />
        </div>
      </div>
    </Card>
  );
}
