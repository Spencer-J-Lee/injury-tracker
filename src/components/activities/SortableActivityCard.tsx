import { useNavigate } from 'react-router-dom';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Activity } from '@/types/models';
import { IconButton } from '@/components/ui/IconButton';
import { SortableCard } from '@/components/ui/SortableCard';
import { RichTextContent } from '@/components/journal/RichTextContent';
import { updateActivity } from '@/db/queries/activities';

export function SortableActivityCard({
  activity,
  navigate,
  editingEnabled,
  draggable,
  onDeleteRequest,
}: {
  activity: Activity;
  navigate: ReturnType<typeof useNavigate>;
  editingEnabled: boolean;
  draggable: boolean;
  onDeleteRequest: () => void;
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
              icon={faTrash}
              tone="danger"
              label="Delete activity"
              onClick={onDeleteRequest}
            />
          </>
        )
      }
    />
  );
}
