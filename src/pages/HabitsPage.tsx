import { useSearchParams } from 'react-router-dom';
import { WeekNav } from '@/components/strengthening/WeekNav';
import { HabitGrid } from '@/components/habits/HabitGrid';
import { HabitList } from '@/components/habits/HabitList';
import { PageTitle } from '@/components/ui/PageTitle';
import { useHabits } from '@/hooks/useHabits';
import { useWeekHabitCompletions } from '@/hooks/useWeekHabitCompletions';
import {
  getNextWindowStart,
  getPreviousWindowStart,
  getTodayDateString,
  getWeekStart,
  getWindowDates,
} from '@/lib/weeks';

const WEEK_SIZE = 7;

export function HabitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const today = getTodayDateString();
  const currentWindowStart = getWeekStart(today);

  const startParam = searchParams.get('start');
  const windowStart = startParam
    ? getWeekStart(startParam)
    : currentWindowStart;

  const weekDates = getWindowDates(windowStart, WEEK_SIZE);
  const habits = useHabits() ?? [];
  const completions =
    useWeekHabitCompletions(weekDates[0], weekDates[WEEK_SIZE - 1]) ?? [];
  const isCurrentWindow = windowStart === currentWindowStart;

  const goToWindow = (next: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === currentWindowStart) {
        params.delete('start');
      } else {
        params.set('start', next);
      }
      return params;
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle>Daily Habits</PageTitle>

      <div className="mx-auto max-w-275 space-y-6">
        <div className="flex flex-col gap-2">
          <WeekNav
            windowStart={windowStart}
            size={WEEK_SIZE}
            isCurrentWindow={isCurrentWindow}
            onPrevious={() =>
              goToWindow(getPreviousWindowStart(windowStart, WEEK_SIZE))
            }
            onNext={() =>
              goToWindow(getNextWindowStart(windowStart, WEEK_SIZE))
            }
            onToday={() => goToWindow(currentWindowStart)}
          />

          <HabitGrid
            habits={habits}
            completions={completions}
            weekDates={weekDates}
          />
        </div>

        <HabitList />
      </div>
    </div>
  );
}
