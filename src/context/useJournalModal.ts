import { useContext } from "react";
import { JournalModalContext } from "@/context/journalModalStore";

export function useJournalModal() {
  const ctx = useContext(JournalModalContext);
  if (!ctx)
    throw new Error(
      "useJournalModal must be used within JournalModalProvider",
    );
  return ctx;
}
