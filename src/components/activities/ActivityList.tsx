import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  faPen,
  faBoxArchive,
  faPlus,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Activity, ActivityBodyPart, Section } from '@/types/models';
import { Divider } from '@/components/ui/Divider';
import { IconButton } from '@/components/ui/IconButton';
import { SortableCard } from '@/components/ui/SortableCard';
import { Button } from '@/components/ui/Button';
import { TogglePill } from '@/components/ui/TogglePill';
import { Label } from '@/components/ui/Label';
import { RichTextContent } from '@/components/journal/RichTextEditor';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SectionForm } from '@/components/activities/SectionForm';
import { useActivities } from '@/hooks/useActivities';
import { useSections } from '@/hooks/useSections';
import { useActivitiesEditingEnabled } from '@/lib/activitiesEditStore';
import {
  archiveActivity,
  reorderActivities,
  updateActivity,
} from '@/db/queries/activities';
import {
  createSection,
  updateSection,
  archiveSection,
  reorderSections,
} from '@/db/queries/sections';
import {
  ACTIVITY_BODY_PARTS,
  groupActivitiesBySections,
} from '@/lib/activities';

function SortableActivityCard({
  activity,
  navigate,
  editingEnabled,
  draggable,
  onArchiveRequest,
}: {
  activity: Activity;
  navigate: ReturnType<typeof useNavigate>;
  editingEnabled: boolean;
  draggable: boolean;
  onArchiveRequest: () => void;
}) {
  return (
    <SortableCard
      id={activity.id}
      as="li"
      draggable={draggable}
      title={activity.name}
      description={
        activity.description && (
          <RichTextContent
            html={activity.description}
            className="text-ink-muted mt-1.5 text-sm text-pretty"
            onChange={(description) =>
              updateActivity(activity.id, { description })
            }
          />
        )
      }
      actions={
        editingEnabled && (
          <>
            <IconButton
              icon={faPen}
              label="Edit activity"
              onClick={() => navigate(`/activities/${activity.id}/edit`)}
            />
            <IconButton
              icon={faBoxArchive}
              tone="danger"
              label="Archive activity"
              onClick={onArchiveRequest}
            />
          </>
        )
      }
    />
  );
}

function ActivityGrid({
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
          onArchiveRequest={() => setConfirmingId(activity.id)}
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
        title="Archive activity?"
        message={`"${confirmingActivity?.name}" will be archived and hidden from this list.`}
        confirmLabel="Archive"
        onConfirm={() => {
          if (confirmingActivity) archiveActivity(confirmingActivity.id);
          setConfirmingId(null);
        }}
        onCancel={() => setConfirmingId(null)}
      />
    </>
  );
}

interface SortableSectionItemProps {
  section: Section;
  items: Activity[];
  editing: boolean;
  editingEnabled: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (values: { name: string }) => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
}

function SortableSectionItem({
  section,
  items,
  editing,
  editingEnabled,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
  navigate,
}: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id, disabled: editing || !editingEnabled });
  const [confirmingArchive, setConfirmingArchive] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div className="mb-3">
        {editing ? (
          <SectionForm
            initial={{ name: section.name }}
            onSubmit={onSubmitEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <div className="flex min-h-7 items-center">
            {editingEnabled && (
              <button
                type="button"
                title="Drag to reorder"
                className="text-ink-faint hover:text-ink cursor-grab touch-none active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <FontAwesomeIcon icon={faGripVertical} className="text-sm" />
              </button>
            )}

            <h3
              className={clsx(
                'text-ink-faint text-sm font-semibold tracking-wide uppercase',
                editingEnabled && 'ml-2',
              )}
            >
              {section.name}
            </h3>

            {editingEnabled && (
              <div className="ml-4 flex items-center gap-1">
                <IconButton
                  icon={faPen}
                  label="Rename section"
                  onClick={onEdit}
                />
                <IconButton
                  icon={faBoxArchive}
                  tone="danger"
                  label="Archive section"
                  onClick={() => setConfirmingArchive(true)}
                />
                <IconButton
                  icon={faPlus}
                  label={`Add activity to ${section.name}`}
                  onClick={() =>
                    navigate(`/activities/new?sectionId=${section.id}`)
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
      <ActivityGrid
        items={items}
        navigate={navigate}
        editingEnabled={editingEnabled}
      />
      <ConfirmDialog
        open={confirmingArchive}
        title="Archive section?"
        message={`"${section.name}" will be archived. Its activities will be hidden until the section is restored.`}
        confirmLabel="Archive"
        onConfirm={() => {
          archiveSection(section.id);
          setConfirmingArchive(false);
        }}
        onCancel={() => setConfirmingArchive(false)}
      />
    </li>
  );
}

export function ActivityList() {
  const activities = useActivities() ?? [];
  const sections = useSections() ?? [];
  const navigate = useNavigate();
  const editingEnabled = useActivitiesEditingEnabled();
  const [restingParts, setRestingParts] = useState<ActivityBodyPart[]>([]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);

  const toggleRestingPart = (part: ActivityBodyPart) => {
    setRestingParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const visibleActivities =
    restingParts.length === 0
      ? activities
      : activities.filter((activity) =>
          restingParts.every((part) => activity.bodyPartsRested.includes(part)),
        );

  const filterActive = restingParts.length > 0;
  const groups = groupActivitiesBySections(visibleActivities, sections, {
    hideEmpty: filterActive,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);
    try {
      await reorderSections(reordered.map((section) => section.id));
    } catch (error) {
      console.error('Failed to reorder sections', error);
    }
  };

  const sectionGroups = groups.filter(
    (group) => group.section !== undefined,
  ) as Array<{
    section: Section;
    items: Activity[];
  }>;
  const otherGroup = groups.find((group) => group.section === undefined);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label size="md" noMargin>
          What needs rest right now?
        </Label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_BODY_PARTS.map((part) => (
            <TogglePill
              key={part}
              type="button"
              tone="accent"
              selected={restingParts.includes(part)}
              onClick={() => toggleRestingPart(part)}
            >
              {part}
            </TogglePill>
          ))}
        </div>
      </div>

      <Divider />

      {filterActive ? (
        <div className="space-y-6">
          {sectionGroups.map(({ section, items }) => (
            <div key={section.id}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-ink-faint text-sm font-semibold tracking-wide uppercase">
                  {section.name}
                </h3>
              </div>
              <ActivityGrid
                items={items}
                navigate={navigate}
                editingEnabled={editingEnabled}
                reorderable={false}
              />
            </div>
          ))}
        </div>
      ) : (
        sections.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-6">
                {sectionGroups.map(({ section, items }) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    items={items}
                    editing={editingSectionId === section.id}
                    editingEnabled={editingEnabled}
                    onEdit={() => setEditingSectionId(section.id)}
                    onCancelEdit={() => setEditingSectionId(null)}
                    onSubmitEdit={async (values) => {
                      await updateSection(section.id, values);
                      setEditingSectionId(null);
                    }}
                    navigate={navigate}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )
      )}

      {otherGroup && (
        <div>
          <div className="mb-3 flex min-h-7 items-center gap-2">
            <h3 className="text-ink-faint text-sm font-semibold tracking-wide uppercase">
              Other
            </h3>
            {editingEnabled && (
              <IconButton
                icon={faPlus}
                label="Add activity to Other"
                onClick={() => navigate('/activities/new')}
              />
            )}
          </div>
          <ActivityGrid
            items={otherGroup.items}
            navigate={navigate}
            editingEnabled={editingEnabled}
          />
        </div>
      )}

      {editingEnabled &&
        !filterActive &&
        (addingSection ? (
          <SectionForm
            onCancel={() => setAddingSection(false)}
            onSubmit={async (values) => {
              await createSection(values);
              setAddingSection(false);
            }}
          />
        ) : (
          <Button
            variant={sections.length > 0 ? 'ghost' : 'dashed'}
            size={sections.length > 0 ? 'sm' : 'md'}
            onClick={() => setAddingSection(true)}
          >
            + Add section
          </Button>
        ))}

      {activities.length === 0 && (
        <p className="text-ink-muted text-sm">
          No activities yet — add one to get started.
        </p>
      )}

      {activities.length > 0 && visibleActivities.length === 0 && (
        <p className="text-ink-muted text-sm">
          No activities match the selected filters.
        </p>
      )}
    </div>
  );
}
