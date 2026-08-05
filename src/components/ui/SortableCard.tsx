import type { ElementType, ReactNode } from "react";
import clsx from "clsx";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/Card";

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
  as = "div",
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
      variant={draggable ? "muted" : "solid"}
      padding={!draggable}
      className={clsx("h-full text-pretty", draggable && "flex overflow-hidden")}
    >
      {draggable && (
        <button
          type="button"
          title="Drag to reorder"
          className="bg-surface-raised text-ink-muted hover:text-ink flex w-8 shrink-0 cursor-grab touch-none items-center justify-center self-stretch active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </button>
      )}
      <div className={clsx("min-w-0 flex-1", draggable && "p-4 pl-3.5")}>
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <p className="text-ink">{title}</p>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
        {description}
      </div>
    </Card>
  );
}
