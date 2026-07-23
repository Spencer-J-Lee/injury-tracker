import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WeekNav } from "@/components/strengthening/WeekNav";
import { WeekGrid } from "@/components/strengthening/WeekGrid";
import { TogglePill } from "@/components/ui/TogglePill";
import { PageTitle } from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/Button";
import { ExerciseAdjustmentTips } from "@/components/strengthening/ExerciseAdjustmentTips";
import { StrengtheningGuidelines } from "@/components/strengthening/StrengtheningGuidelines";
import { useWeekPlannedExercises } from "@/hooks/useWeekPlannedExercises";
import {
  getGuidelinesAckDate,
  setGuidelinesAckDate,
} from "@/lib/strengtheningGuidelinesAck";
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

  const [ackDate, setAckDate] = useState(getGuidelinesAckDate);

  const today = getTodayDateString();
  const hasReadGuidelinesToday = ackDate === today;
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

  const acknowledgeGuidelines = () => {
    setGuidelinesAckDate(today);
    setAckDate(today);
  };

  if (!hasReadGuidelinesToday) {
    return (
      <div className="space-y-6">
        <PageTitle>Strengthening</PageTitle>

        <div className="space-y-4">
          <StrengtheningGuidelines />

          <Button onClick={acknowledgeGuidelines}>
            I've read this, continue
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex flex-col gap-1">
        <WeekNav
          windowStart={windowStart}
          size={size}
          isCurrentWindow={isCurrentWindow}
          onPrevious={() =>
            goToWindow(getPreviousWindowStart(windowStart, size))
          }
          onNext={() => goToWindow(getNextWindowStart(windowStart, size))}
          onToday={() => goToWindow(currentWindowStart)}
        />

        <WeekGrid
          windowStart={windowStart}
          size={size}
          plannedExercises={plannedExercises}
        />
      </div>

      <ExerciseAdjustmentTips />

      <StrengtheningGuidelines />
    </div>
  );
}
