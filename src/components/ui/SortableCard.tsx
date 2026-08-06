import type { ElementType, ReactNode } from 'react';
import clsx from 'clsx';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/Card';

const SIDEBAR_CLASSES =
  'bg-surface-raised flex w-7 shrink-0 items-center justify-center self-stretch';

interface SortableCardProps {
  id: string;
  as?: ElementType;
  draggable?: boolean;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function SortableCard({
  id,
  as = 'div',
  draggable = true,
  title,
  description,
  actions,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: !draggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      as={as}
      ref={setNodeRef}
      style={style}
      size="md"
      variant="muted"
      padding={false}
      className="flex h-full overflow-hidden text-pretty"
    >
      {draggable ? (
        <button
          type="button"
          title="Drag to reorder"
          className={clsx(
            SIDEBAR_CLASSES,
            'text-ink-muted hover:text-ink cursor-grab touch-none active:cursor-grabbing',
          )}
          {...attributes}
          {...listeners}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </button>
      ) : (
        <div className={SIDEBAR_CLASSES} />
      )}
      <div className="min-w-0 flex-1 p-4 pl-3.5">
        <div className="flex min-h-7 min-w-0 items-start justify-between gap-2.5">
          <p className="text-ink font-medium">{title}</p>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
        {description}
      </div>
    </Card>
  );
}
