import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardFast,
  faBackwardStep,
  faForwardStep,
  faForwardFast,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        iconBefore={<FontAwesomeIcon icon={faBackwardFast} />}
        onClick={() => onPageChange(1)}
      >
        First
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        iconBefore={<FontAwesomeIcon icon={faBackwardStep} />}
        onClick={() => onPageChange(page - 1)}
      >
        Newer
      </Button>
      <span
        className="text-ink-muted inline-block text-center tabular-nums"
        style={{ minWidth: `${9 + String(totalPages).length * 2}ch` }}
      >
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === totalPages}
        iconAfter={<FontAwesomeIcon icon={faForwardStep} />}
        onClick={() => onPageChange(page + 1)}
      >
        Older
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === totalPages}
        iconAfter={<FontAwesomeIcon icon={faForwardFast} />}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </Button>
    </div>
  );
}
