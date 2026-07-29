import { useMemo } from "react";
import clsx from "clsx";
import { format, isToday, parseISO } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatShortDateWithDay } from "@/lib/dates";
import { toggleHabitCompletion } from "@/db/queries/habitCompletions";
import type { Habit, HabitCompletion } from "@/types/models";

interface HabitGridProps {
  habits: Habit[];
  completions: HabitCompletion[];
  weekDates: string[];
}

export function HabitGrid({ habits, completions, weekDates }: HabitGridProps) {
  const completedKeys = useMemo(
    () => new Set(completions.map((entry) => `${entry.habitId}:${entry.date}`)),
    [completions],
  );

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
            <tr className="border-subtle border-b text-sm">
              <th className="text-ink-muted w-full max-w-60 pr-4 pb-3 text-right align-bottom font-semibold tracking-wide uppercase">
                Habit
              </th>
              {weekDates.map((date) => {
                const today = isToday(parseISO(date));
                return (
                  <th
                    key={date}
                    className={clsx(
                      "w-22 min-w-22 px-2 pb-3 text-center whitespace-nowrap",
                      today && "bg-accent-soft/50 rounded-t-lg",
                    )}
                  >
                    <p className="text-accent h-[2em] pt-1.5 text-[10px] tracking-[0.2em] uppercase">
                      {today && "Today"}
                    </p>
                    <div
                      className={clsx(
                        "font-bold tracking-wide uppercase",
                        today ? "text-ink-muted" : "text-ink-faint",
                      )}
                    >
                      {format(parseISO(date), "EEE")}
                    </div>
                    <div
                      className={clsx(
                        "text-base font-bold",
                        today ? "text-ink" : "text-ink-secondary",
                      )}
                    >
                      {format(parseISO(date), "MMM d")}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-subtle divide-y divide-dashed">
            {habits.map((habit, habitIndex) => {
              const isLastRow = habitIndex === habits.length - 1;
              return (
                <tr key={habit.id}>
                  <th
                    scope="row"
                    className="text-ink max-w-60 py-1.5 pr-4 text-right text-sm leading-snug font-semibold"
                  >
                    {habit.name}
                  </th>
                  {weekDates.map((date) => {
                    const today = isToday(parseISO(date));
                    const checked = completedKeys.has(`${habit.id}:${date}`);
                    return (
                      <td
                        key={date}
                        className={clsx(
                          "w-22 min-w-22 py-1.5 text-center",
                          today && "bg-accent-soft/50",
                          today && isLastRow && "rounded-b-lg",
                        )}
                      >
                        <Checkbox
                          id={`${habit.id}-${date}`}
                          label=""
                          aria-label={`${habit.name} — ${formatShortDateWithDay(date)}`}
                          checked={checked}
                          onChange={() => toggleHabitCompletion(habit.id, date)}
                          className="mx-auto"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
