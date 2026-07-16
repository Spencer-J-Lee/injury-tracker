export type InjuryStatus = "active" | "monitoring" | "resolved";
export type InjuryPriority = "low" | "medium" | "high" | "urgent";
export type Category =
  "Mobility" | "Strengthening" | "Lifestyle" | "Overuse" | "Posture" | "Rest";

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
  category?: Category;
  createdAt: string;
  archivedAt?: string;
}

export interface Trigger {
  id: string;
  injuryId: string;
  name: string;
  description?: string;
  category?: Category;
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
