import { useState } from "react";
import {
  faPen,
  faBoxArchive,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/Card";
import { CollapsibleCard } from "@/components/ui/CollapsibleCard";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { HabitForm } from "@/components/habits/HabitForm";
import { useHabits } from "@/hooks/useHabits";
import {
  createHabit,
  archiveHabit,
  updateHabit,
  reorderHabits,
} from "@/db/queries/habits";
import type { Habit } from "@/types/models";

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

function SortableHabitItem({
  habit,
  editing,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
}: SortableHabitItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: habit.id, disabled: editing });

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
            description: habit.description ?? "",
          }}
          submitLabel="Save"
          onCancel={onCancelEdit}
          onSubmit={onSubmitEdit}
        />
      </li>
    );
  }

  return (
    <li ref={setNodeRef} style={style}>
      <Card
        size="md"
        variant="muted"
        padding={false}
        className="flex overflow-hidden"
      >
        <button
          type="button"
          title="Drag to reorder"
          className="bg-surface-raised text-ink-muted hover:text-ink flex w-8 shrink-0 cursor-grab touch-none items-center justify-center self-stretch active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </button>
        <div className="min-w-0 flex-1 p-4 pl-3.5">
          <div className="flex min-w-0 items-start justify-between gap-2.5">
            <p className="text-ink">{habit.name}</p>
            <div className="flex shrink-0 gap-2">
              <IconButton icon={faPen} label="Edit habit" onClick={onEdit} />
              <IconButton
                icon={faBoxArchive}
                tone="danger"
                label="Archive habit"
                onClick={() => archiveHabit(habit.id)}
              />
            </div>
          </div>
          {habit.description && (
            <p className="text-ink-muted mt-1.5 text-base text-pretty">
              {habit.description}
            </p>
          )}
        </div>
      </Card>
    </li>
  );
}

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
      console.error("Failed to reorder habits", error);
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
          variant={habits.length > 0 ? "ghost" : "dashed"}
          size={habits.length > 0 ? "sm" : "md"}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </CollapsibleCard>
  );
}
