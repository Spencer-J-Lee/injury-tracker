import { useLiveQuery } from 'dexie-react-hooks';
import { listActiveSections } from '@/db/queries/sections';

export function useSections() {
  return useLiveQuery(() => listActiveSections(), [], []);
}
