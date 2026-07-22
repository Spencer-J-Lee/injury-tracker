import { useLiveQuery } from "dexie-react-hooks";
import { listPlannedExercisesForWeek } from "@/db/queries/plannedExercises";
import { getRemediesByIds } from "@/db/queries/remedies";
import { getWindowEnd } from "@/lib/weeks";
import type { PlannedExercise, Remedy } from "@/types/models";

export interface PlannedExerciseWithRemedy extends PlannedExercise {
  remedy: Remedy | undefined;
}

export function useWeekPlannedExercises(windowStart: string, size: number) {
  return useLiveQuery(
    async (): Promise<PlannedExerciseWithRemedy[]> => {
      const windowEnd = getWindowEnd(windowStart, size);
      const planned = await listPlannedExercisesForWeek(windowStart, windowEnd);
      const remedies = await getRemediesByIds([
        ...new Set(planned.map((entry) => entry.remedyId)),
      ]);
      const byId = new Map(remedies.map((remedy) => [remedy.id, remedy]));
      return planned.map((entry) => ({
        ...entry,
        remedy: byId.get(entry.remedyId),
      }));
    },
    [windowStart, size],
    [],
  );
}
