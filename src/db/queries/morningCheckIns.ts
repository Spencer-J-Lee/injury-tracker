import { db } from "@/db/schema";
import type {
  MorningCheckIn,
  PainMechanism,
  StiffnessDuration,
  NumbnessDuration,
  NumbnessSuspectedCause,
} from "@/types/models";
import { listForInjuryOrderedByTimestamp } from "@/db/queries/shared";

export interface CreateMorningCheckInInput {
  injuryId: string;
  timestamp: string;
  painMechanisms: PainMechanism[];
  painLevel?: number;
  stiffnessLevel?: number;
  stiffnessDuration?: StiffnessDuration;
  numbnessPresent?: boolean;
  numbnessDuration?: NumbnessDuration;
  numbnessSuspectedCause?: NumbnessSuspectedCause;
  notes?: string;
}

export async function createMorningCheckIn(
  input: CreateMorningCheckInInput,
): Promise<MorningCheckIn> {
  const now = new Date().toISOString();
  const row: MorningCheckIn = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    timestamp: input.timestamp,
    painMechanisms: input.painMechanisms,
    painLevel: input.painLevel,
    stiffnessLevel: input.stiffnessLevel,
    stiffnessDuration: input.stiffnessDuration,
    numbnessPresent: input.numbnessPresent,
    numbnessDuration: input.numbnessDuration,
    numbnessSuspectedCause: input.numbnessSuspectedCause,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  await db.morningCheckIns.add(row);
  return row;
}

export function listMorningCheckInsForInjury(injuryId: string, limit?: number) {
  return listForInjuryOrderedByTimestamp(db.morningCheckIns, injuryId, limit);
}

export async function getLastMorningCheckInForInjury(injuryId: string) {
  const [latest] = await listMorningCheckInsForInjury(injuryId, 1);
  return latest;
}

export interface UpdateMorningCheckInInput {
  timestamp: string;
  painLevel: number | undefined;
  stiffnessLevel: number | undefined;
  stiffnessDuration: StiffnessDuration | undefined;
  numbnessPresent: boolean | undefined;
  numbnessDuration: NumbnessDuration | undefined;
  numbnessSuspectedCause: NumbnessSuspectedCause | undefined;
  notes: string | undefined;
}

export async function updateMorningCheckIn(
  id: string,
  changes: UpdateMorningCheckInInput,
) {
  await db.morningCheckIns.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMorningCheckIn(id: string) {
  await db.morningCheckIns.delete(id);
}
