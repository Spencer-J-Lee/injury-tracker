import { useState, type ReactNode } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";

interface CollapsibleCardProps {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsibleCard({
  title,
  defaultOpen = true,
  children,
  className,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <Card
      size="lg"
      onClick={toggle}
      className={clsx("cursor-pointer", className)}
    >
      <div className="font-heading text-ink-emphasis flex items-center justify-between gap-2 text-lg font-semibold">
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={clsx(
            "text-ink-muted shrink-0 text-sm transition-transform",
            open && "rotate-180",
          )}
        />
      </div>
      {open && (
        <div className="mt-6" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </Card>
  );
}
