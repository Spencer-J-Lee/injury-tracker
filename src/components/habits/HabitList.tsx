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
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { Button } from '@/components/ui/Button';
import { HabitForm } from '@/components/habits/HabitForm';
import { SortableHabitItem } from '@/components/habits/SortableHabitItem';
import { useHabits } from '@/hooks/useHabits';
import { createHabit, updateHabit, reorderHabits } from '@/db/queries/habits';

export function HabitList() {
  const habits = useHabits() ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
  );
}
