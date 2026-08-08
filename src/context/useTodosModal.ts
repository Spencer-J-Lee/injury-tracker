import { useContext } from 'react';
import { TodosModalContext } from '@/context/todosModalStore';

export function useTodosModal() {
  const ctx = useContext(TodosModalContext);
  if (!ctx)
    throw new Error('useTodosModal must be used within TodosModalProvider');
  return ctx;
}
