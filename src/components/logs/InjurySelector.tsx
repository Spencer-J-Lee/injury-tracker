import { useState } from "react";
import type { Injury } from "@/types/models";
import { TogglePill } from "@/components/ui/TogglePill";
import { formatInjuryName } from "@/lib/injuries";

interface InjurySelectorProps {
  injuries: Injury[];
  selectedId: string | undefined;
  onSelect: (injuryId: string) => void;
}

export function InjurySelector({
  injuries,
  selectedId,
  onSelect,
}: InjurySelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? injuries
    : injuries.filter((i) => i.status === "active");

  return (
    <div>
      <div className="text-ink-muted mb-2 flex items-center justify-between font-semibold">
        <span>Injury</span>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-accent-soft-text font-semibold hover:underline"
        >
          {showAll ? "Show active only" : "Show all"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {visible.map((injury) => {
          const selected = injury.id === selectedId;
          return (
            <TogglePill
              key={injury.id}
              selected={selected}
              onClick={() => onSelect(injury.id)}
            >
              {formatInjuryName(injury)}
            </TogglePill>
          );
        })}
        {visible.length === 0 && (
          <p className="text-ink-muted text-lg">
            No injuries yet — add one first.
          </p>
        )}
      </div>
    </div>
  );
}
