import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackwardStep,
  faForwardStep,
  faForwardFast,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";

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
        onClick={() => onPageChange(1)}
      >
        <FontAwesomeIcon icon={faBackwardFast} />
        First
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <FontAwesomeIcon icon={faBackwardStep} />
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
        onClick={() => onPageChange(page + 1)}
      >
        Older
        <FontAwesomeIcon icon={faForwardStep} />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        Last
        <FontAwesomeIcon icon={faForwardFast} />
      </Button>
    </div>
  );
}
