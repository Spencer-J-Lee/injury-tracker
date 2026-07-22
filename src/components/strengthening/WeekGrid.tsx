import { useMemo, useState } from "react";
import clsx from "clsx";
import { isToday, parseISO } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { EditExercisesModal } from "@/components/strengthening/EditExercisesModal";
import {
  createPlannedExercise,
  deletePlannedExercise,
} from "@/db/queries/plannedExercises";
import { getRemediesByIds } from "@/db/queries/remedies";
import { useInjuries } from "@/hooks/useInjuries";
import { compareInjuries } from "@/lib/injuries";
import { formatShortDateWithDay } from "@/lib/dates";
import { getWindowDates } from "@/lib/weeks";
import type { PlannedExerciseWithRemedy } from "@/hooks/useWeekPlannedExercises";
import type { Injury } from "@/types/models";
import { Badge } from "../ui/Badge";

interface WeekGridProps {
  windowStart: string;
  size: number;
  plannedExercises: PlannedExerciseWithRemedy[];
}

export function WeekGrid({ windowStart, size, plannedExercises }: WeekGridProps) {
  const dates = getWindowDates(windowStart, size);
  const injuries = useInjuries() ?? [];

  return (
    <div
      className={clsx(
        "divide-subtle grid grid-cols-1 divide-x sm:grid-cols-2",
        size === 4 ? "lg:grid-cols-4" : "lg:grid-cols-7",
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
        />
      ))}
    </div>
  );
}

function DayColumn({
  date,
  exercises,
  injuries,
}: {
  date: string;
  exercises: PlannedExerciseWithRemedy[];
  injuries: Injury[];
}) {
  const [managing, setManaging] = useState(false);
  const today = isToday(parseISO(date));
  const remedyIdsKey = exercises.map((exercise) => exercise.remedyId).join(",");
  const existingRemedyIds = useMemo(
    () => (remedyIdsKey ? remedyIdsKey.split(",") : []),
    [remedyIdsKey],
  );

  const groups = useMemo(() => {
    return [...injuries]
      .sort(compareInjuries)
      .map((injury) => ({
        injury,
        exercises: exercises.filter(
          (exercise) => exercise.remedy?.injuryId === injury.id,
        ),
      }))
      .filter((group) => group.exercises.length > 0);
  }, [injuries, exercises]);

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
    <div className="first:pl-0 last:pr-0">
      <div className={clsx("flex flex-col gap-2.5 px-4 pt-2 pb-4", today && "bg-accent-soft/40")}>
        <div
          className={clsx(
            "flex flex-col text-sm font-semibold tracking-wide uppercase",
            today ? "text-ink" : "text-ink-muted",
          )}
        >
          
          <p className="text-[10px] h-[1em] tracking-[0.2em] mb-0.5 uppercase text-accent">
            {today && 'Today'}
          </p>
          <p className="leading-relaxed">{formatShortDateWithDay(date)}</p>
        </div>

        <Button
          variant={exercises.length > 0 ? "secondary" : "dashed"}
          size="sm"
          onClick={() => setManaging(true)}
          className="w-full"
        >
          Edit
        </Button>
      </div>

      {groups.length > 0 && (
        <div className="divide-subtle flex flex-col divide-dashed divide-y wrap-break-word px-4 mt-3">
          {groups.map(({ injury, exercises }) => (
            <div className="py-3 first:pt-0 last:pb-0" key={injury.id}>
              <Label noMargin>{injury.bodyPart}</Label>
              <ul className="mt-2 flex flex-col items-start gap-1.5 text-ink text-sm">
                {exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <Badge tone="green">
                      {exercise.remedy?.name ?? "Exercise"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
