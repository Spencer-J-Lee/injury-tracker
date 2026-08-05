import { useState } from 'react';
import clsx from 'clsx';
import { LogEntryEditModal } from '@/components/logs/LogEntryEditModal';
import { DayColumn } from '@/components/strengthening/DayColumn';
import { getLastLogEntryForInjury } from '@/db/queries/logEntries';
import { useInjuries } from '@/hooks/useInjuries';
import { useLogModal } from '@/context/useLogModal';
import { todayEntryOnly } from '@/lib/dates';
import { getWindowDates } from '@/lib/weeks';
import type { PlannedExerciseWithRemedy } from '@/hooks/useWeekPlannedExercises';
import type { LogEntry } from '@/types/models';

interface WeekGridProps {
  windowStart: string;
  size: number;
  plannedExercises: PlannedExerciseWithRemedy[];
}

export function WeekGrid({
  windowStart,
  size,
  plannedExercises,
}: WeekGridProps) {
  const dates = getWindowDates(windowStart, size);
  const injuries = useInjuries() ?? [];
  const { openLogModal } = useLogModal();
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);

  const handleInjuryClick = async (injuryId: string) => {
    const todayEntry = todayEntryOnly(await getLastLogEntryForInjury(injuryId));
    if (todayEntry) {
      setEditingEntry(todayEntry);
    } else {
      openLogModal(injuryId);
    }
  };

  return (
    <div
      className={clsx(
        'divide-subtle grid min-h-96 grid-cols-1 divide-x sm:grid-cols-2',
        size === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-7',
      )}
    >
      {dates.map((date) => (
        <DayColumn
          key={date}
          date={date}
          exercises={plannedExercises.filter(
            (exercise) => exercise.date === date,
          )}
          injuries={injuries}
          onInjuryClick={handleInjuryClick}
        />
      ))}

      {editingEntry && (
        <LogEntryEditModal
          entry={editingEntry}
          open={!!editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}
