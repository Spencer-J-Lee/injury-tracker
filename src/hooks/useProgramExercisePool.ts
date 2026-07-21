import { useLiveQuery } from "dexie-react-hooks";
import { listProgramExerciseRemedies } from "@/db/queries/remedies";

export function useProgramExercisePool() {
  return useLiveQuery(() => listProgramExerciseRemedies(), [], []);
}
