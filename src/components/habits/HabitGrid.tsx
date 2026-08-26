import { Fragment, useEffect, useMemo, useState } from 'react';
import { faCloudSun, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { confetti } from '@tsparticles/confetti';
import { format, isToday, parseISO } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { toggleHabitCompletion } from '@/db/queries/habitCompletions';
import { groupHabitsBySection } from '@/lib/habits';
import type { Habit, HabitCompletion, HabitSection } from '@/types/models';

const HABIT_SECTION_ICONS: Record<HabitSection, IconDefinition> = {
  morning: faSun,
  midday: faCloudSun,
  night: faMoon,
};

interface HabitGridProps {
  habits: Habit[];
  completions: HabitCompletion[];
  weekDates: string[];
}

function completionKey(habitId: string, date: string) {
  return `${habitId}:${date}`;
}

const REFERENCE_VIEWPORT_WIDTH = 800;
const DEFAULT_START_VELOCITY = 45;
const CONFETTI_COLORS = [
  '#0a4475',
  '#225b90',
  '#3772ac',
  '#528ac3',
  '#7b3700',
  '#974c00',
  '#b16325',
  '#c57b45',
];

function fireRealisticConfetti() {
  const scale = Math.min(
    Math.max(window.innerWidth / REFERENCE_VIEWPORT_WIDTH, 0.75),
    2.5,
  );
  const count = 200;
  const defaults = {
    origin: { x: 0.5, y: 0.9 },
    colors: CONFETTI_COLORS,
    ticks: 1000,
  };

  function fire(particleRatio: number, options: Record<string, unknown>) {
    const startVelocity =
      (typeof options.startVelocity === 'number'
        ? options.startVelocity
        : DEFAULT_START_VELOCITY) * scale;
    void confetti({
      ...defaults,
      ...options,
      startVelocity,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 33, startVelocity: 55 });
  fire(0.2, { spread: 75 });
  fire(0.35, { spread: 125, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 150, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 150, startVelocity: 45 });
}

export function HabitGrid({ habits, completions, weekDates }: HabitGridProps) {
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(
    () =>
      new Set(
        completions.map((entry) => completionKey(entry.habitId, entry.date)),
      ),
  );

  useEffect(() => {
    setCompletedKeys(
      new Set(
        completions.map((entry) => completionKey(entry.habitId, entry.date)),
      ),
    );
  }, [completions]);

  const dateInfo = useMemo(
    () =>
      weekDates.map((date) => {
        const parsed = parseISO(date);
        return {
          date,
          today: isToday(parsed),
          dayLabel: format(parsed, 'EEE'),
          dateLabel: format(parsed, 'MMM d'),
        };
      }),
    [weekDates],
  );

  const requiredHabits = useMemo(
    () => habits.filter((habit) => !habit.optional),
    [habits],
  );

  const groupedHabits = useMemo(() => groupHabitsBySection(habits), [habits]);

  const lastHabitId = useMemo(() => {
    const lastGroup = groupedHabits[groupedHabits.length - 1];
    return lastGroup?.habits[lastGroup.habits.length - 1]?.id;
  }, [groupedHabits]);

  const completeDates = useMemo(
    () =>
      new Set(
        weekDates.filter(
          (date) =>
            requiredHabits.length > 0 &&
            requiredHabits.every((habit) =>
              completedKeys.has(completionKey(habit.id, date)),
            ),
        ),
      ),
    [requiredHabits, weekDates, completedKeys],
  );

  const [animatedKeys, setAnimatedKeys] = useState<Set<string>>(new Set());

  function toggleCompletion(habitId: string, date: string) {
    const key = completionKey(habitId, date);
    setAnimatedKeys((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setCompletedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        const completesDay =
          requiredHabits.length > 0 &&
          requiredHabits.every((habit) =>
            next.has(completionKey(habit.id, date)),
          );
        if (completesDay) {
          fireRealisticConfetti();
        }
      }
      return next;
    });
    toggleHabitCompletion(habitId, date);
  }

  if (habits.length === 0) {
    return (
      <Card>
        <p className="text-ink-muted text-sm">
          No habits yet — add one below to start tracking.
        </p>
      </Card>
    );
  }

  return (
    <Card className="pt-3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-subtle border-b text-lg tracking-wide uppercase">
              <th className="text-ink-muted w-full max-w-60 pr-6 pb-3 text-right align-bottom font-medium">
                Habit
              </th>
              {dateInfo.map(({ date, today, dayLabel, dateLabel }) => (
                <th
                  key={date}
                  className={clsx(
                    'w-24 min-w-24 px-2 pb-3 text-center whitespace-nowrap',
                    today && 'bg-accent-soft/70 rounded-t-lg',
                  )}
                >
                  <p className="text-accent h-[2em] pt-1.5 text-xs font-bold tracking-[0.2em] uppercase">
                    {today && 'Today'}
                  </p>
                  <div
                    className={clsx(
                      'text-xs tracking-wide uppercase',
                      today ? 'text-ink-muted' : 'text-ink-faint',
                    )}
                  >
                    {dayLabel}
                  </div>
                  <div
                    className={clsx(
                      'font-medium',
                      today ? 'text-ink' : 'text-ink-faint',
                    )}
                  >
                    {dateLabel}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-subtle divide-y divide-dashed">
            {groupedHabits.map((group) => (
              <Fragment key={group.section}>
                <tr key={`${group.section}-header`} className="border-solid">
                  <td className="bg-canvas/50 w-full max-w-60 py-3 pr-6 text-right">
                    <FontAwesomeIcon
                      icon={HABIT_SECTION_ICONS[group.section]}
                      className="text-ink-faint text-xl"
                    />
                  </td>
                  <td colSpan={dateInfo.length} className="bg-canvas/50 py-3" />
                </tr>
                {group.habits.map((habit, habitIndex) => {
                  const isLastRow = habit.id === lastHabitId;
                  const isFirstInGroup = habitIndex === 0;
                  return (
                    <tr
                      key={habit.id}
                      className={isFirstInGroup ? 'border-t-0' : undefined}
                    >
                      <th
                        scope="row"
                        className="text-ink max-w-60 py-1.5 pr-6 text-right leading-snug font-medium whitespace-pre-line"
                      >
                        {habit.name}
                      </th>
                      {dateInfo.map(({ date, today }) => {
                        const key = completionKey(habit.id, date);
                        const checked = completedKeys.has(key);
                        return (
                          <td
                            key={date}
                            className={clsx(
                              'w-24 min-w-24 py-1.5 text-center',
                              today && 'bg-accent-soft/70',
                              today && isLastRow && 'rounded-b-lg',
                            )}
                          >
                            <div className="flex justify-center">
                              <Checkbox
                                id={`${habit.id}-${date}`}
                                label=""
                                checked={checked}
                                variant={
                                  habit.optional
                                    ? 'optional'
                                    : completeDates.has(date)
                                      ? 'gold'
                                      : 'default'
                                }
                                onChange={() =>
                                  toggleCompletion(habit.id, date)
                                }
                                animated={animatedKeys.has(key)}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
