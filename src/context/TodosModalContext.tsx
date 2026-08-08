import { useState, useCallback, type ReactNode } from 'react';
import { TodosModalContext } from '@/context/todosModalStore';

export function TodosModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openTodosModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeTodosModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <TodosModalContext.Provider
      value={{ open, openTodosModal, closeTodosModal }}
    >
      {children}
    </TodosModalContext.Provider>
  );
}
