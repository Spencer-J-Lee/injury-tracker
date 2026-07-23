export type InjuryStatus = "active" | "monitoring" | "resolved";
export type InjuryPriority = "low" | "medium" | "high" | "urgent";
export type RemedyCategory =
  "Strengthening" | "Mobility" | "Lifestyle" | "Rest";
export type TriggerCategory =
  "Activity" | "Overuse" | "Load" | "Posture" | "Muscle Tightness";

export type PainMechanism = "nociceptive" | "neuropathic" | "nociplastic";

export interface Injury {
  id: string;
  bodyPart: string;
  injuryType: string;
  locationDetail?: string;
  description?: string;
  status: InjuryStatus;
  priority: InjuryPriority | null;
  painMechanisms: PainMechanism[];
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

export type StiffnessDuration = "immediate" | "5-10min" | "15-30min" | "30plus";
export type NumbnessDuration = "brief" | "lingering" | "persistent";
export type NumbnessSuspectedCause = "sleep-posture" | "load-related" | "unsure";

export interface MorningCheckIn {
  id: string;
  injuryId: string;
  timestamp: string;
  painMechanisms: PainMechanism[]; // snapshot of the injury's mechanisms when this entry was logged
  painLevel?: number; // resting pain, same 0-10 scale as LogEntry.painLevel
  stiffnessLevel?: number; // stiffness severity, same 0-10 scale as painLevel
  stiffnessDuration?: StiffnessDuration;
  numbnessPresent?: boolean;
  numbnessDuration?: NumbnessDuration; // only meaningful when numbnessPresent
  numbnessSuspectedCause?: NumbnessSuspectedCause; // only meaningful when numbnessPresent
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
