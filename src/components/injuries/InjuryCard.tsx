import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { Injury } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InjuryStatusBadge } from "@/components/injuries/InjuryStatusBadge";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { useLastLogEntryForInjury } from "@/hooks/useLastLogEntryForInjury";
import { useLogModal } from "@/context/useLogModal";
import { formatRelative } from "@/lib/dates";
import { painTone, freqTone } from "@/lib/pain";

interface InjuryCardProps {
  injury: Injury;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function InjuryCard({
  injury,
  selectable,
  selected,
  onToggleSelect,
}: InjuryCardProps) {
  const lastLog = useLastLogEntryForInjury(injury.id);
  const { openLogModal } = useLogModal();
  const navigate = useNavigate();

  const handleClick = () => {
    if (selectable) {
      onToggleSelect?.(injury.id);
    } else {
      navigate(`/injuries/${injury.id}`);
    }
  };

  return (
    <Card
      role={selectable ? "checkbox" : "link"}
      aria-checked={selectable ? Boolean(selected) : undefined}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={clsx(
        "hover:border-accent relative flex cursor-pointer flex-col justify-between gap-[14px] transition-colors",
        selectable && selected && "border-accent! bg-accent-soft/20",
      )}
    >
      {selectable && selected && (
        <span className="border-canvas bg-accent text-accent-on absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full border-2">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-ink text-[0.625rem]"
            aria-hidden="true"
          />
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <h3 className="text-ink min-w-0 flex-1 text-base font-semibold">
            <InjuryTitle injury={injury} />
          </h3>
        </div>
        <InjuryStatusBadge status={injury.status} />
      </div>

      <div className="flex items-end justify-between">
        <div className="text-ink-muted flex items-center gap-1.5 text-[13px]">
          {lastLog ? (
            <>
              <Badge tone={painTone(lastLog.painLevel)}>
                {lastLog.painLevel ?? "—"}/10
              </Badge>
              {lastLog.painFrequency !== undefined && (
                <Badge tone={freqTone(lastLog.painFrequency)}>
                  {lastLog.painFrequency}% freq
                </Badge>
              )}
              <span>{formatRelative(lastLog.timestamp)}</span>
            </>
          ) : (
            <span>No entries yet</span>
          )}
        </div>
        {!selectable && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openLogModal([injury.id]);
            }}
          >
            Log Entry
          </Button>
        )}
      </div>
    </Card>
  );
}
