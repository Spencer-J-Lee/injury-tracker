import { useLiveQuery } from 'dexie-react-hooks';
import { listTodos } from '@/db/queries/todos';

export function useTodos() {
  return useLiveQuery(() => listTodos(), [], []);
}
