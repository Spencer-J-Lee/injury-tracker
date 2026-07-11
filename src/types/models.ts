export type InjuryStatus = "active" | "monitoring" | "resolved";
export type RemedyType = "relief" | "longterm";

export interface Injury {
  id: string;
  bodyPart: string;
  injuryType: string;
  description?: string;
  status: InjuryStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface Remedy {
  id: string;
  injuryId: string;
  name: string;
  description?: string;
  type: RemedyType;
  createdAt: string;
  archivedAt?: string;
}

export interface Trigger {
  id: string;
  injuryId: string;
  name: string;
  description?: string;
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
