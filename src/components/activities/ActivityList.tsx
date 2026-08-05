import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
import type { Activity, ActivityBodyPart, Section } from '@/types/models';
import { Divider } from '@/components/ui/Divider';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { TogglePill } from '@/components/ui/TogglePill';
import { Label } from '@/components/ui/Label';
import { SectionForm } from '@/components/activities/SectionForm';
import { ActivityGrid } from '@/components/activities/ActivityGrid';
import { SortableSectionItem } from '@/components/activities/SortableSectionItem';
import { useActivities } from '@/hooks/useActivities';
import { useSections } from '@/hooks/useSections';
import { useActivitiesEditingEnabled } from '@/lib/activitiesEditStore';
import { updateSection, createSection, reorderSections } from '@/db/queries/sections';
import {
  ACTIVITY_BODY_PARTS,
  groupActivitiesBySections,
} from '@/lib/activities';

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
