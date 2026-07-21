import { useLiveQuery } from "dexie-react-hooks";
import { listPlannedExercisesForWeek } from "@/db/queries/plannedExercises";
import { getRemediesByIds } from "@/db/queries/remedies";
import { getWeekEnd } from "@/lib/weeks";
import type { PlannedExercise, Remedy } from "@/types/models";

export interface PlannedExerciseWithRemedy extends PlannedExercise {
  remedy: Remedy | undefined;
}

export function useWeekPlannedExercises(weekStart: string) {
  return useLiveQuery(
    async (): Promise<PlannedExerciseWithRemedy[]> => {
      const weekEnd = getWeekEnd(weekStart);
      const planned = await listPlannedExercisesForWeek(weekStart, weekEnd);
      const remedies = await getRemediesByIds([
        ...new Set(planned.map((entry) => entry.remedyId)),
      ]);
      const byId = new Map(remedies.map((remedy) => [remedy.id, remedy]));
      return planned.map((entry) => ({
        ...entry,
        remedy: byId.get(entry.remedyId),
      }));
    },
    [weekStart],
    [],
  );
}
