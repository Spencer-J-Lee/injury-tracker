import { useState, type ReactNode } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { cardPaddingClasses } from '@/components/ui/cardStyles';

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
    <Card size="lg" padding={false} className={className}>
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          'font-heading text-ink-emphasis flex w-full cursor-pointer items-center justify-between gap-2 text-lg font-semibold',
          cardPaddingClasses.lg,
        )}
      >
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={clsx(
            'text-ink-muted shrink-0 text-sm transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className={clsx(cardPaddingClasses.lg, 'pt-0')}>{children}</div>
      )}
    </Card>
  );
}
