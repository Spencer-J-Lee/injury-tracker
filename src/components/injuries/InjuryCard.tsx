import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { Injury } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InjuryPriorityBadge } from "@/components/injuries/InjuryPriorityBadge";
import { statusLabels } from "@/lib/injuryStatus";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { useLastLogEntryForInjury } from "@/hooks/useLastLogEntryForInjury";
import { useLogModal } from "@/context/useLogModal";
import { LogEntryEditModal } from "@/components/logs/LogEntryEditModal";
import { formatRelative } from "@/lib/dates";
import { isToday } from "date-fns";
import { painTone, freqTone, type PainTone } from "@/lib/pain";
import { MiniPainTrendChart } from "@/components/charts/MiniPainTrendChart";

const meterFillClasses: Record<PainTone, string> = {
  slate: "bg-ink-faint",
  green: "bg-pain-green-text",
  amber: "bg-pain-amber-text",
  red: "bg-pain-red-text",
};

const meterTextClasses: Record<PainTone, string> = {
  slate: "text-ink-muted",
  green: "text-pain-green-text",
  amber: "text-pain-amber-text",
  red: "text-pain-red-text",
};

function MeterRow({
  label,
  value,
  displayValue,
  tone,
}: {
  label: string;
  value: number;
  displayValue: string;
  tone: PainTone;
}) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-ink-muted w-[72px] shrink-0 font-semibold">
        {label}
      </span>
      <div className="bg-control h-2 flex-1 rounded-full">
        <div
          className={clsx("h-2 rounded-full", meterFillClasses[tone])}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <span
        className={clsx(
          "w-11 shrink-0 text-right font-bold",
          meterTextClasses[tone],
        )}
      >
        {displayValue}
      </span>
    </div>
  );
}

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
  const [editingToday, setEditingToday] = useState(false);
  const loggedToday = lastLog ? isToday(new Date(lastLog.timestamp)) : false;
  const todayEntry = loggedToday ? lastLog : undefined;

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
      className={clsx(
        "relative flex cursor-pointer flex-col justify-between gap-[18px] transition-colors",
        "[&:hover:not(:has(button:hover))]:border-accent",
        selectable && selected && "border-accent! bg-accent-soft/20",
      )}
    >
      {selectable && selected && (
        <span className="border-canvas bg-accent text-accent-on absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-ink text-[0.625rem]"
            aria-hidden="true"
          />
        </span>
      )}

      <div className="flex flex-col gap-[18px]">
        <h3 className="text-ink min-w-0 text-xl font-semibold">
          <InjuryTitle injury={injury} />
        </h3>

        {lastLog &&
          (lastLog.painLevel !== undefined ||
            lastLog.painFrequency !== undefined) && (
            <Card
              size="sm"
              variant="subtle"
              className="flex flex-col justify-between gap-3"
            >
              {lastLog.painLevel !== undefined && (
                <MeterRow
                  label="Intensity"
                  value={(lastLog.painLevel / 10) * 100}
                  displayValue={`${lastLog.painLevel}/10`}
                  tone={painTone(lastLog.painLevel)}
                />
              )}
              {lastLog.painFrequency !== undefined && (
                <MeterRow
                  label="Frequency"
                  value={lastLog.painFrequency}
                  displayValue={`${lastLog.painFrequency}%`}
                  tone={freqTone(lastLog.painFrequency)}
                />
              )}
            </Card>
          )}

        <MiniPainTrendChart injuryId={injury.id} />
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <InjuryPriorityBadge priority={injury.priority} />
          <span className="text-ink-muted text-xs font-bold tracking-widest uppercase">
            {statusLabels[injury.status]}
          </span>
        </div>

        <div className="flex min-w-0 items-center text-right gap-2.5 text-sm">
          {loggedToday && lastLog ? (
            <span className="text-ink-faint">
              Updated {formatRelative(lastLog.updatedAt)}
            </span>
          ) : (
            <span className="text-ink-faint">Not logged today</span>
          )}
          {!selectable && (
            <Button
              variant={loggedToday ? "secondary" : "primary"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (todayEntry) {
                  setEditingToday(true);
                } else {
                  openLogModal(injury.id);
                }
              }}
            >
              {loggedToday ? "Update Entry" : "Log Entry"}
            </Button>
          )}
        </div>
      </div>

      {todayEntry && (
        <LogEntryEditModal
          entry={todayEntry}
          open={editingToday}
          onClose={() => setEditingToday(false)}
        />
      )}
    </Card>
  );
}
