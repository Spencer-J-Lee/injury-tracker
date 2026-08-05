import { useLiveQuery } from 'dexie-react-hooks';
import { listActiveHabits } from '@/db/queries/habits';

export function useHabits() {
  return useLiveQuery(() => listActiveHabits(), [], []);
}
