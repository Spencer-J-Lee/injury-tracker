import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ActivityList } from '@/components/activities/ActivityList';
import { IconButton } from '@/components/ui/IconButton';
import { PageTitle } from '@/components/ui/PageTitle';
import {
  setActivitiesEditingEnabled,
  useActivitiesEditingEnabled,
} from '@/lib/activitiesEditStore';

export function ActivitiesPage() {
  const editingEnabled = useActivitiesEditingEnabled();

  return (
    <div className="space-y-6">
      <PageTitle
        actions={
          <div className="flex items-center gap-2">
            <IconButton
              icon={editingEnabled ? faLockOpen : faLock}
              label={editingEnabled ? 'Disable editing' : 'Enable editing'}
              size="md"
              onClick={() => setActivitiesEditingEnabled(!editingEnabled)}
            />
          </div>
        }
      >
        Rest Activities
      </PageTitle>

      <ActivityList />
    </div>
  );
}
