import { createContext } from "react";

export interface JournalModalContextValue {
  open: boolean;
  openJournalModal: () => void;
  closeJournalModal: () => void;
}

export const JournalModalContext =
  createContext<JournalModalContextValue | null>(null);
