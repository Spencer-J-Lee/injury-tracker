import { useState, useCallback, type ReactNode } from 'react';
import { JournalModalContext } from '@/context/journalModalStore';

export function JournalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openJournalModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeJournalModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <JournalModalContext.Provider
      value={{ open, openJournalModal, closeJournalModal }}
    >
      {children}
    </JournalModalContext.Provider>
  );
}
