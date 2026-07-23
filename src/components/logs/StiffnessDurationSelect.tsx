import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import type { StiffnessDuration } from "@/types/models";
import { STIFFNESS_DURATION_OPTIONS } from "@/lib/morningCheckInOptions";

interface StiffnessDurationSelectProps {
  value: StiffnessDuration | undefined;
  onChange: (value: StiffnessDuration | undefined) => void;
}

export function StiffnessDurationSelect({
  value,
  onChange,
}: StiffnessDurationSelectProps) {
  return (
    <div>
      <Label>Morning stiffness duration</Label>
      <Select
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            (e.target.value || undefined) as StiffnessDuration | undefined,
          )
        }
      >
        <option value="">Not rated</option>
        {STIFFNESS_DURATION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
