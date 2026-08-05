import { useLiveQuery } from 'dexie-react-hooks';
import { listActiveActivities } from '@/db/queries/activities';

export function useActivities() {
  return useLiveQuery(() => listActiveActivities(), [], []);
}
