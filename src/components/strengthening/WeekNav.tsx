import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { formatWindowRangeLabel } from "@/lib/weeks";
import { LinkButton } from "../ui/LinkButton";

interface WeekNavProps {
  windowStart: string;
  size: number;
  isCurrentWindow: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNav({
  windowStart,
  size,
  isCurrentWindow,
  onPrevious,
  onNext,
  onToday,
}: WeekNavProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onPrevious}
          aria-label={`Previous ${size} days`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>

        <h2 className="font-heading text-ink w-[280px] text-center text-2xl font-semibold">
          {formatWindowRangeLabel(windowStart, size)}
        </h2>

        <Button
          variant="secondary"
          onClick={onNext}
          aria-label={`Next ${size} days`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>

      <div className="flex h-9 items-center">
        {!isCurrentWindow && (
          <LinkButton onClick={onToday}>Jump to today</LinkButton>
        )}
      </div>
    </div>
  );
}
