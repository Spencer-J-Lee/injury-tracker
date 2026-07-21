import { db } from "@/db/schema";
import type { PlannedExercise } from "@/types/models";

export async function createPlannedExercise(input: {
  date: string;
  remedyId: string;
}): Promise<PlannedExercise> {
  const plannedExercise: PlannedExercise = {
    id: crypto.randomUUID(),
    date: input.date,
    remedyId: input.remedyId,
    createdAt: new Date().toISOString(),
  };
  await db.plannedExercises.add(plannedExercise);
  return plannedExercise;
}

export async function deletePlannedExercise(id: string) {
  await db.plannedExercises.delete(id);
}

export function listPlannedExercisesForDate(date: string) {
  return db.plannedExercises.where("date").equals(date).sortBy("createdAt");
}

export function listPlannedExercisesForWeek(
  weekStart: string,
  weekEnd: string,
) {
  return db.plannedExercises
    .where("date")
    .between(weekStart, weekEnd, true, true)
    .sortBy("createdAt");
}
