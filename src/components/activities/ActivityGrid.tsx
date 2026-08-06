import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { Activity } from '@/types/models';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SortableActivityCard } from '@/components/activities/SortableActivityCard';
import { deleteActivity, reorderActivities } from '@/db/queries/activities';

export function ActivityGrid({
  items,
  navigate,
  editingEnabled,
  reorderable = true,
}: {
  items: Activity[];
  navigate: ReturnType<typeof useNavigate>;
  editingEnabled: boolean;
  reorderable?: boolean;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const confirmingActivity = items.find((item) => item.id === confirmingId);
  const draggable = editingEnabled && reorderable;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    try {
      await reorderActivities(reordered.map((item) => item.id));
    } catch (error) {
      console.error('Failed to reorder activities', error);
    }
  };

  const grid = (
    <ul className="grid grid-cols-4 gap-2.5">
      {items.map((activity) => (
        <SortableActivityCard
          key={activity.id}
          activity={activity}
          navigate={navigate}
          editingEnabled={editingEnabled}
          draggable={draggable}
          onDeleteRequest={() => setConfirmingId(activity.id)}
        />
      ))}
    </ul>
  );

  return (
    <>
      {draggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            {grid}
          </SortableContext>
        </DndContext>
      ) : (
        grid
      )}
      <ConfirmDialog
        open={confirmingActivity !== undefined}
        title="Delete activity?"
        message={`"${confirmingActivity?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmingActivity) deleteActivity(confirmingActivity.id);
          setConfirmingId(null);
        }}
        onCancel={() => setConfirmingId(null)}
      />
    </>
  );
}
