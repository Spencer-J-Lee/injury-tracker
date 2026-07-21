import { useMemo, useState } from "react";
import clsx from "clsx";
import { isToday, parseISO } from "date-fns";
import { Button } from "@/components/ui/Button";
import { EditExercisesModal } from "@/components/strengthening/EditExercisesModal";
import {
  createPlannedExercise,
  deletePlannedExercise,
} from "@/db/queries/plannedExercises";
import { getRemediesByIds } from "@/db/queries/remedies";
import { formatShortDateWithDay } from "@/lib/dates";
import { getWeekDates } from "@/lib/weeks";
import type { PlannedExerciseWithRemedy } from "@/hooks/useWeekPlannedExercises";

interface WeekGridProps {
  weekStart: string;
  plannedExercises: PlannedExerciseWithRemedy[];
}

export function WeekGrid({ weekStart, plannedExercises }: WeekGridProps) {
  const dates = getWeekDates(weekStart);

  return (
    <div className="divide-subtle grid grid-cols-1 divide-x sm:grid-cols-2 lg:grid-cols-7">
      {dates.map((date) => (
        <DayColumn
          key={date}
          date={date}
          exercises={plannedExercises.filter(
            (exercise) => exercise.date === date,
          )}
        />
      ))}
    </div>
  );
}

function DayColumn({
  date,
  exercises,
}: {
  date: string;
  exercises: PlannedExerciseWithRemedy[];
}) {
  const [managing, setManaging] = useState(false);
  const today = isToday(parseISO(date));
  const remedyIdsKey = exercises.map((exercise) => exercise.remedyId).join(",");
  const existingRemedyIds = useMemo(
    () => (remedyIdsKey ? remedyIdsKey.split(",") : []),
    [remedyIdsKey],
  );

  const handleSave = async (remedyIds: string[]) => {
    const toRemove = exercises.filter(
      (exercise) => !remedyIds.includes(exercise.remedyId),
    );
    const toAddIds = remedyIds.filter(
      (remedyId) =>
        !exercises.some((exercise) => exercise.remedyId === remedyId),
    );
    const remediesToAdd = await getRemediesByIds(toAddIds);
    await Promise.all([
      ...toRemove.map((exercise) => deletePlannedExercise(exercise.id)),
      ...remediesToAdd.map((remedy) =>
        createPlannedExercise({
          date,
          remedyId: remedy.id,
        }),
      ),
    ]);
    setManaging(false);
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      <div
        className={clsx(
          "flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase",
          today ? "text-ink" : "text-ink-muted",
        )}
      >
        <span className="leading-relaxed">{formatShortDateWithDay(date)}</span>
      </div>

      <Button
        variant={exercises.length > 0 ? "secondary" : "dashed"}
        size="sm"
        onClick={() => setManaging(true)}
        className="w-full"
      >
        Edit
      </Button>

      {exercises.length > 0 && (
        <ul className="divide-subtle flex flex-col divide-y">
          {exercises.map((exercise) => (
            <li key={exercise.id} className="py-3">
              <div className="text-ink truncate text-xs font-medium">
                {exercise.remedy?.name ?? "Exercise"}
              </div>
            </li>
          ))}
        </ul>
      )}

      <EditExercisesModal
        open={managing}
        date={date}
        existingRemedyIds={existingRemedyIds}
        onSubmit={handleSave}
        onCancel={() => setManaging(false)}
      />
    </div>
  );
}
