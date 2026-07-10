import { createContext } from "react";

export interface LogModalState {
  open: boolean;
  initialInjuryIds: string[];
}

export interface LogModalContextValue {
  state: LogModalState;
  openLogModal: (initialInjuryIds?: string[]) => void;
  closeLogModal: () => void;
}

export const LogModalContext = createContext<LogModalContextValue | null>(null);
