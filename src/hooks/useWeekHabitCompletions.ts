import { useLiveQuery } from "dexie-react-hooks";
import { listHabitCompletionsForWeek } from "@/db/queries/habitCompletions";

export function useWeekHabitCompletions(startDate: string, endDate: string) {
  return useLiveQuery(
    () => listHabitCompletionsForWeek(startDate, endDate),
    [startDate, endDate],
    [],
  );
}
