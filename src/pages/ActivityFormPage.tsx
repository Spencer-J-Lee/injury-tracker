import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useActivity } from '@/hooks/useActivity';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { PageTitle } from '@/components/ui/PageTitle';
import { createActivity, updateActivity } from '@/db/queries/activities';

export function ActivityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const activity = useActivity(id);
  const prefilledSectionId = searchParams.get('sectionId') ?? '';

  if (isEdit && activity === undefined) {
    return <p className="text-ink-muted">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>{isEdit ? 'Edit activity' : 'Add activity'}</PageTitle>
      <ActivityForm
        initial={
          activity
            ? {
                name: activity.name,
                description: activity.description ?? '',
                sectionId: activity.sectionId ?? '',
                bodyPartsRested: activity.bodyPartsRested,
              }
            : prefilledSectionId
              ? {
                  name: '',
                  description: '',
                  sectionId: prefilledSectionId,
                  bodyPartsRested: [],
                }
              : undefined
        }
        submitLabel={isEdit ? 'Save' : 'Submit'}
        onSubmit={async (values) => {
          const payload = {
            ...values,
            sectionId: values.sectionId || undefined,
          };
          if (isEdit && id) {
            await updateActivity(id, payload);
          } else {
            await createActivity(payload);
          }
          navigate('/activities');
        }}
        onCancel={() => navigate('/activities')}
      />
    </div>
  );
}
