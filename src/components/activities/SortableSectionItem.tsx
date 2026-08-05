import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { faPen, faBoxArchive, faPlus, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Activity, Section } from '@/types/models';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SectionForm } from '@/components/activities/SectionForm';
import { ActivityGrid } from '@/components/activities/ActivityGrid';
import { archiveSection } from '@/db/queries/sections';

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

export function SortableSectionItem({
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
