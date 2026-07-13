import { createContext } from "react";

export interface LogModalState {
  open: boolean;
  initialInjuryId: string | undefined;
}

export interface LogModalContextValue {
  state: LogModalState;
  openLogModal: (initialInjuryId?: string) => void;
  closeLogModal: () => void;
}

export const LogModalContext = createContext<LogModalContextValue | null>(null);
