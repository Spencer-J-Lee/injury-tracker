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
          iconBefore={<FontAwesomeIcon icon={faChevronLeft} />}
          onClick={onPrevious}
          aria-label={`Previous ${size} days`}
        />

        <h2 className="font-heading text-ink w-70 text-center text-2xl font-semibold">
          {formatWindowRangeLabel(windowStart, size)}
        </h2>

        <Button
          variant="secondary"
          iconBefore={<FontAwesomeIcon icon={faChevronRight} />}
          onClick={onNext}
          aria-label={`Next ${size} days`}
        />
      </div>

      <div className="flex h-9 items-center">
        {!isCurrentWindow && (
          <LinkButton onClick={onToday}>Jump to today</LinkButton>
        )}
      </div>
    </div>
  );
}
