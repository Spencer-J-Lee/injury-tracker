import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { isToday, parseISO } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';
import { Modal } from '@/components/ui/Modal';
import { RichTextContent } from '@/components/journal/RichTextContent';
import { EditExercisesModal } from '@/components/strengthening/EditExercisesModal';
import {
  createPlannedExercise,
  deletePlannedExercise,
} from '@/db/queries/plannedExercises';
import { getRemediesByIds, updateRemedy } from '@/db/queries/remedies';
import { compareInjuries } from '@/lib/injuries';
import { formatShortDateWithDay } from '@/lib/dates';
import type { PlannedExerciseWithRemedy } from '@/hooks/useWeekPlannedExercises';
import type { Injury } from '@/types/models';

export function DayColumn({
  date,
  exercises,
  injuries,
  onInjuryClick,
}: {
  date: string;
  exercises: PlannedExerciseWithRemedy[];
  injuries: Injury[];
  onInjuryClick: (injuryId: string) => void;
}) {
  const [managing, setManaging] = useState(false);
  const [viewingRemedy, setViewingRemedy] = useState<
    PlannedExerciseWithRemedy['remedy'] | null
  >(null);
  const today = isToday(parseISO(date));
  const remedyIdsKey = exercises.map((exercise) => exercise.remedyId).join(',');
  const existingRemedyIds = useMemo(
    () => (remedyIdsKey ? remedyIdsKey.split(',') : []),
    [remedyIdsKey],
  );

  const groups = useMemo(() => {
    return [...injuries]
      .sort(compareInjuries)
      .map((injury) => ({
        injury,
        exercises: exercises.filter(
          (exercise) => exercise.remedy?.injuryId === injury.id,
        ),
      }))
      .filter((group) => group.exercises.length > 0);
  }, [injuries, exercises]);

  const handleSave = async (remedyIds: string[]) => {
    const toRemove = exercises.filter(
      (exercise) => !remedyIds.includes(exercise.remedyId),
    );
    const toAddIds = remedyIds.filter(
      (remedyId) =>
        !exercises.some((exercise) => exercise.remedyId === remedyId),
    );
    const remediesToAdd = await getRemediesByIds(toAddIds);
    await Promise.all([
      ...toRemove.map((exercise) => deletePlannedExercise(exercise.id)),
      ...remediesToAdd.map((remedy) =>
        createPlannedExercise({
          date,
          remedyId: remedy.id,
        }),
      ),
    ]);
    setManaging(false);
  };

  return (
    <div className="first:pl-0 last:pr-0">
      <div
        className={clsx(
          'flex flex-col gap-2.5 px-4 pt-2 pb-4',
          today && 'bg-accent-soft/70',
        )}
      >
        <div
          className={clsx(
            'flex flex-col tracking-wide uppercase',
            today ? 'text-ink' : 'text-ink-muted',
          )}
        >
          <p className="text-accent mb-1 h-[1em] text-xs font-bold tracking-[0.2em] uppercase">
            {today && 'Today'}
          </p>
          <p className="text-lg leading-relaxed font-medium">
            {formatShortDateWithDay(date)}
          </p>
        </div>

        <Button
          variant={exercises.length > 0 ? 'secondary' : 'dashed'}
          size="sm"
          onClick={() => setManaging(true)}
          className="w-full"
        >
          Edit
        </Button>
      </div>

      {groups.length > 0 && (
        <div className="divide-subtle mt-3 flex flex-col divide-y divide-dashed px-4 wrap-break-word">
          {groups.map(({ injury, exercises }) => (
            <div className="py-3 first:pt-0 last:pb-0" key={injury.id}>
              <LinkButton onClick={() => onInjuryClick(injury.id)}>
                {injury.bodyPart}
              </LinkButton>
              <ul className="text-ink mt-2 flex flex-col items-start gap-2.5 pl-2">
                {exercises.map((exercise) => (
                  <li
                    className={clsx(
                      'font-medium',
                      exercise.remedy &&
                        'hover:text-ink-secondary cursor-pointer underline decoration-dotted underline-offset-2',
                    )}
                    key={exercise.id}
                    onClick={() =>
                      exercise.remedy && setViewingRemedy(exercise.remedy)
                    }
                  >
                    {exercise.remedy?.name ?? 'Exercise'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <EditExercisesModal
        open={managing}
        date={date}
        existingRemedyIds={existingRemedyIds}
        onSubmit={handleSave}
        onCancel={() => setManaging(false)}
      />

      <Modal
        open={!!viewingRemedy}
        onClose={() => setViewingRemedy(null)}
        title={viewingRemedy?.name ?? ''}
        size="sm"
      >
        {viewingRemedy?.description ? (
          <RichTextContent
            html={viewingRemedy.description}
            className="text-ink-muted text-pretty"
            onChange={(description) =>
              updateRemedy(viewingRemedy.id, { description })
            }
          />
        ) : (
          <p className="text-ink-muted text-pretty">No description added.</p>
        )}
      </Modal>
    </div>
  );
}
