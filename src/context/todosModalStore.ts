import { createContext } from 'react';

export interface TodosModalContextValue {
  open: boolean;
  openTodosModal: () => void;
  closeTodosModal: () => void;
}

export const TodosModalContext = createContext<TodosModalContextValue | null>(
  null,
);
