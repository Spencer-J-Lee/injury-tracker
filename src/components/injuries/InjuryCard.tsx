import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { Injury } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InjuryPriorityTag } from '@/components/injuries/InjuryPriorityTag';
import { InjuryStatusTag } from '@/components/injuries/InjuryStatusTag';
import { InjuryTitle } from '@/components/injuries/InjuryTitle';
import { useLastLogEntryForInjury } from '@/hooks/useLastLogEntryForInjury';
import { useLogModal } from '@/context/useLogModal';
import { LogEntryEditModal } from '@/components/logs/LogEntryEditModal';
import { formatRelative, todayEntryOnly } from '@/lib/dates';
import { painTone, freqTone } from '@/lib/pain';
import { MiniPainTrendChart } from '@/components/charts/MiniPainTrendChart';
import { MeterRow } from '@/components/ui/MeterRow';

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
  const todayEntry = todayEntryOnly(lastLog);

  const actionButtonProps = todayEntry
    ? {
        variant: 'secondary' as const,
        label: 'Update Entry',
        onClick: () => setEditingToday(true),
      }
    : {
        variant: 'primary' as const,
        label: 'Log Entry',
        onClick: () => openLogModal(injury.id),
      };

  const handleClick = () => {
    if (selectable) {
      onToggleSelect?.(injury.id);
    } else {
      navigate(`/injuries/${injury.id}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={clsx(
        'relative flex cursor-pointer flex-col justify-between gap-4.5',
        '[&:hover:not(:has(button:hover))]:border-accent',
        selectable && selected && 'border-accent! bg-accent-soft/20',
      )}
    >
      {selectable && selected && (
        <span className="border-canvas bg-accent text-accent-on absolute -top-2.5 -left-2.5 flex size-6 items-center justify-center rounded-full border-2">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-ink text-[0.625rem]"
          />
        </span>
      )}

      <div className="flex flex-col gap-4.5">
        <h3 className="text-ink min-w-0 text-xl font-semibold">
          <InjuryTitle injury={injury} />
        </h3>

        {lastLog &&
          (lastLog.painLevel !== undefined ||
            lastLog.painFrequency !== undefined) && (
            <Card
              size="sm"
              variant="muted"
              rounded={false}
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
          <InjuryPriorityTag priority={injury.priority} />
          <InjuryStatusTag status={injury.status} />
        </div>

        <div className="flex min-w-0 items-center gap-2.5 text-right text-sm">
          {todayEntry && lastLog && (
            <span className="text-ink-faint">
              Updated {formatRelative(lastLog.updatedAt)}
            </span>
          )}
          {!selectable && (
            <Button
              variant={actionButtonProps.variant}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                actionButtonProps.onClick();
              }}
            >
              {actionButtonProps.label}
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
