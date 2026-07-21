import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { formatWeekRangeLabel } from "@/lib/weeks";

interface WeekNavProps {
  weekStart: string;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNav({
  weekStart,
  isCurrentWeek,
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
          aria-label="Previous week"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>

        <h2 className="font-heading text-ink w-56 text-center text-xl font-semibold">
          {formatWeekRangeLabel(weekStart)}
        </h2>

        <Button
          variant="secondary"
          onClick={onNext}
          aria-label="Next week"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>

      <div className="flex h-7 items-center">
        {!isCurrentWeek && (
          <Button variant="ghost" size="sm" onClick={onToday}>
            Jump to this week
          </Button>
        )}
      </div>
    </div>
  );
}
