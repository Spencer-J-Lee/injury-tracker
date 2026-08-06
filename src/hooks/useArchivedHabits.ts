import { useLiveQuery } from 'dexie-react-hooks';
import { listArchivedHabits } from '@/db/queries/habits';

export function useArchivedHabits() {
  return useLiveQuery(() => listArchivedHabits(), [], []);
}
