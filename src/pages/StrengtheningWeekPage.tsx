import { useSearchParams } from "react-router-dom";
import { WeekNav } from "@/components/strengthening/WeekNav";
import { WeekGrid } from "@/components/strengthening/WeekGrid";
import { useWeekPlannedExercises } from "@/hooks/useWeekPlannedExercises";
import {
  getNextWeekStart,
  getPreviousWeekStart,
  getTodayDateString,
  getWeekStart,
} from "@/lib/weeks";

export function StrengtheningWeekPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentWeekStart = getWeekStart(getTodayDateString());
  const weekParam = searchParams.get("week");
  const weekStart = weekParam ? getWeekStart(weekParam) : currentWeekStart;
  const plannedExercises = useWeekPlannedExercises(weekStart) ?? [];
  const isCurrentWeek = weekStart === currentWeekStart;

  const goToWeek = (next: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === currentWeekStart) {
        params.delete("week");
      } else {
        params.set("week", next);
      }
      return params;
    });
  };

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-ink text-2xl font-semibold">
        Strengthening
      </h1>

      <WeekNav
        weekStart={weekStart}
        isCurrentWeek={isCurrentWeek}
        onPrevious={() => goToWeek(getPreviousWeekStart(weekStart))}
        onNext={() => goToWeek(getNextWeekStart(weekStart))}
        onToday={() => goToWeek(currentWeekStart)}
      />

      <WeekGrid weekStart={weekStart} plannedExercises={plannedExercises} />
    </div>
  );
}
