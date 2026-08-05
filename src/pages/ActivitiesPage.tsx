import { Link, useNavigate } from 'react-router-dom';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ActivityList } from '@/components/activities/ActivityList';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Kbd } from '@/components/ui/Kbd';
import { PageTitle } from '@/components/ui/PageTitle';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useAnyModalOpen } from '@/lib/modalStore';
import {
  setActivitiesEditingEnabled,
  useActivitiesEditingEnabled,
} from '@/lib/activitiesEditStore';
import { addActivityShortcutLabel } from '@/lib/shortcuts';

export function ActivitiesPage() {
  const navigate = useNavigate();
  const anyModalOpen = useAnyModalOpen();
  const editingEnabled = useActivitiesEditingEnabled();

  useKeyboardShortcut('n', () => navigate('/activities/new'), !anyModalOpen);

  return (
    <div className="space-y-6">
      <PageTitle
        actions={
          <div className="flex items-center gap-2">
            {editingEnabled && (
              <Link to="/activities/new">
                <Button iconAfter={<Kbd>{addActivityShortcutLabel}</Kbd>}>
                  Add Activity
                </Button>
              </Link>
            )}
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
