import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { NumbnessDuration, NumbnessSuspectedCause } from "@/types/models";
import {
  NUMBNESS_DURATION_OPTIONS,
  NUMBNESS_SUSPECTED_CAUSE_OPTIONS,
} from "@/lib/morningCheckInOptions";

interface NumbnessCheckInProps {
  present: boolean | undefined;
  onPresentChange: (present: boolean) => void;
  duration: NumbnessDuration | undefined;
  onDurationChange: (duration: NumbnessDuration | undefined) => void;
  suspectedCause: NumbnessSuspectedCause | undefined;
  onSuspectedCauseChange: (cause: NumbnessSuspectedCause | undefined) => void;
}

export function NumbnessCheckIn({
  present,
  onPresentChange,
  duration,
  onDurationChange,
  suspectedCause,
  onSuspectedCauseChange,
}: NumbnessCheckInProps) {
  return (
    <>
      <Label>Numbness/tingling present</Label>
      <SegmentedControl
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        value={present === undefined ? undefined : present ? "yes" : "no"}
        onChange={(value) => onPresentChange(value === "yes")}
      />

      {present === true && (
        <>
          <div>
            <Label>Duration</Label>
            <Select
              value={duration ?? ""}
              onChange={(e) =>
                onDurationChange(
                  (e.target.value || undefined) as NumbnessDuration | undefined,
                )
              }
            >
              <option value="">Not rated</option>
              {NUMBNESS_DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label>Suspected cause</Label>
            <Select
              value={suspectedCause ?? ""}
              onChange={(e) =>
                onSuspectedCauseChange(
                  (e.target.value || undefined) as
                    | NumbnessSuspectedCause
                    | undefined,
                )
              }
            >
              <option value="">Not sure</option>
              {NUMBNESS_SUSPECTED_CAUSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </>
      )}
    </>
  );
}
