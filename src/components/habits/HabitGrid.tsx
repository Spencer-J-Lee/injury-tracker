import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Lottie from 'lottie-react';
import confettiAnimation from '@/assets/lottie/confetti.json';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { toggleHabitCompletion } from '@/db/queries/habitCompletions';
import type { Habit, HabitCompletion } from '@/types/models';

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
              {habits.map((habit, habitIndex) => {
                const isLastRow = habitIndex === habits.length - 1;
                return (
                  <tr key={habit.id}>
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
                                    celebrationCellRefs.current.set(date, el);
                                  } else {
                                    celebrationCellRefs.current.delete(date);
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
                              onChange={() => toggleCompletion(habit.id, date)}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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
