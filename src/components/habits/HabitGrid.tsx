import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { faCloudSun, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Lottie from 'lottie-react';
import confettiAnimation from '@/assets/lottie/confetti.json';
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
          editable: isToday(parsed) || isYesterday(parsed),
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

  const [celebration, setCelebration] = useState<{
    date: string;
    key: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const celebrationCellRefs = useRef<Map<string, HTMLTableCellElement>>(
    new Map(),
  );
  const [confettiPosition, setConfettiPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!celebration) {
      setConfettiPosition(null);
      return;
    }
    const cell = celebrationCellRefs.current.get(celebration.date);
    const container = containerRef.current;
    if (!cell || !container) {
      return;
    }
    const cellRect = cell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setConfettiPosition({
      left: cellRect.left - containerRect.left + cellRect.width / 2,
      top: cellRect.bottom - containerRect.top,
    });
  }, [celebration]);

  function toggleCompletion(habitId: string, date: string) {
    const key = completionKey(habitId, date);
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
          setCelebration({ date, key: Date.now() });
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
      <div ref={containerRef} className="relative">
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
                    <td
                      colSpan={dateInfo.length}
                      className="bg-canvas/50 py-3"
                    />
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
                        {dateInfo.map(({ date, today, editable }) => {
                          const checked = completedKeys.has(
                            completionKey(habit.id, date),
                          );
                          return (
                            <td
                              key={date}
                              ref={
                                isLastRow
                                  ? (el) => {
                                      if (el) {
                                        celebrationCellRefs.current.set(
                                          date,
                                          el,
                                        );
                                      } else {
                                        celebrationCellRefs.current.delete(
                                          date,
                                        );
                                      }
                                    }
                                  : undefined
                              }
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
                                  disabled={!editable}
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
        {celebration && confettiPosition && (
          <Lottie
            key={celebration.key}
            animationData={confettiAnimation}
            loop={false}
            onComplete={() => setCelebration(null)}
            style={{
              left: confettiPosition.left,
              top: confettiPosition.top,
            }}
            className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 -translate-y-[calc(100%-10px)]"
          />
        )}
      </div>
    </Card>
  );
}
