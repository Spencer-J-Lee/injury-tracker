export type InjuryStatus = "active" | "monitoring" | "resolved";
export type InjuryPriority = "low" | "medium" | "high" | "urgent";
export type RemedyCategory =
  "Strengthening" | "Mobility" | "Lifestyle" | "Rest";
export type TriggerCategory =
  "Activity" | "Overuse" | "Load" | "Posture" | "Muscle Tightness";

export interface Injury {
  id: string;
  bodyPart: string;
  injuryType: string;
  locationDetail?: string;
  description?: string;
  status: InjuryStatus;
  priority: InjuryPriority | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface Remedy {
  id: string;
  injuryId: string;
  name: string;
  description?: string;
  providesImmediateRelief: boolean;
  category?: RemedyCategory;
  isProgramExercise?: boolean;
  createdAt: string;
  archivedAt?: string;
}

export interface Trigger {
  id: string;
  injuryId: string;
  name: string;
  description?: string;
  category?: TriggerCategory;
  createdAt: string;
  archivedAt?: string;
}

export interface LogEntry {
  id: string;
  sessionId: string;
  injuryId: string;
  timestamp: string;
  painLevel?: number;
  painFrequency?: number;
  remedyIds: string[];
  triggerIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppMeta {
  key: string;
  value: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date (yyyy-mm-dd) — the day the entry is "for"
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannedExercise {
  id: string;
  date: string; // yyyy-MM-dd — the day this exercise is done/planned
  remedyId: string;
  createdAt: string;
}
