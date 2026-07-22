import { useSearchParams } from "react-router-dom";
import { WeekNav } from "@/components/strengthening/WeekNav";
import { WeekGrid } from "@/components/strengthening/WeekGrid";
import { TogglePill } from "@/components/ui/TogglePill";
import { PageTitle } from "@/components/ui/PageTitle";
import { useWeekPlannedExercises } from "@/hooks/useWeekPlannedExercises";
import {
  get4DayWindowStart,
  getNextWindowStart,
  getPreviousWindowStart,
  getTodayDateString,
  getWeekStart,
} from "@/lib/weeks";

type ViewMode = "week" | "4day";

const WINDOW_SIZE: Record<ViewMode, number> = { week: 7, "4day": 4 };

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "week", label: "7 Day" },
  { value: "4day", label: "4 Day" },
];

export function StrengtheningWeekPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view: ViewMode = searchParams.get("view") === "4day" ? "4day" : "week";
  const size = WINDOW_SIZE[view];

  const today = getTodayDateString();
  const currentWindowStart =
    view === "week" ? getWeekStart(today) : get4DayWindowStart(today);

  const startParam = searchParams.get("start");
  const windowStart = startParam
    ? view === "week"
      ? getWeekStart(startParam)
      : startParam
    : currentWindowStart;

  const plannedExercises = useWeekPlannedExercises(windowStart, size) ?? [];
  const isCurrentWindow = windowStart === currentWindowStart;

  const goToWindow = (next: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === currentWindowStart) {
        params.delete("start");
      } else {
        params.set("start", next);
      }
      return params;
    });
  };

  const setView = (next: ViewMode) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("start");
      if (next === "week") {
        params.delete("view");
      } else {
        params.set("view", next);
      }
      return params;
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle
        actions={
          <div className="flex gap-2.5">
            {VIEW_OPTIONS.map((option) => (
              <TogglePill
                key={option.value}
                selected={view === option.value}
                onClick={() => setView(option.value)}
              >
                {option.label}
              </TogglePill>
            ))}
          </div>
        }
      >
        Strengthening
      </PageTitle>

      <WeekNav
        windowStart={windowStart}
        size={size}
        isCurrentWindow={isCurrentWindow}
        onPrevious={() => goToWindow(getPreviousWindowStart(windowStart, size))}
        onNext={() => goToWindow(getNextWindowStart(windowStart, size))}
        onToday={() => goToWindow(currentWindowStart)}
      />

      <WeekGrid
        windowStart={windowStart}
        size={size}
        plannedExercises={plannedExercises}
      />
    </div>
  );
}
