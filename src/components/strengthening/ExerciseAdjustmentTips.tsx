import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { LinkButton } from "@/components/ui/LinkButton";
import { Label } from "../ui/Label";

interface Tip {
  id: string;
  text: string;
  note?: string;
}

const FORM_TIPS: Tip[] = [
  { id: "form-rom", text: "Reduce range of motion" },
  { id: "form-angle", text: "Adjust the angle of the lift" },
  { id: "form-engage-more", text: "Engage supporting muscles more" },
  {
    id: "form-engage-less",
    text: "Engage supporting muscles less",
    note: "In the past, intense engagement of other muscles have aggravated symptoms during a lift",
  },
];

const VOLUME_TIPS: Tip[] = [
  { id: "volume-sessions", text: "Reduce sessions per week" },
  { id: "volume-sets", text: "Reduce sets per session" },
  { id: "volume-reps", text: "Reduce reps per set" },
  { id: "volume-resistance", text: "Reduce resistance per rep" },
];

const STORAGE_KEY = "strengthening:exercise-adjustment-tips-checked";

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  if (Object.keys(checked).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }
}

function TipList({
  tips,
  checked,
  onToggle,
}: {
  tips: Tip[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {tips.map((tip) => (
        <div key={tip.id}>
          <Checkbox
            id={tip.id}
            label={tip.text}
            checked={checked[tip.id] ?? false}
            onChange={() => onToggle(tip.id)}
          />
          {tip.note && (
            <p className="text-ink-faint pl-8.5 text-sm">{tip.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ExerciseAdjustmentTips() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(next);
      return next;
    });
  };

  const clear = () => {
    setChecked({});
    saveChecked({});
  };

  const hasChecked = Object.values(checked).some(Boolean);

  return (
    <Card variant="subtle" size="sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-ink text-lg font-semibold">
          Is the exercise aggravating symptoms?
        </h3>
        {hasChecked && (
          <LinkButton type="button" onClick={clear}>
            clear all
          </LinkButton>
        )}
      </div>

      <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <Label>Adjust form</Label>
          <TipList tips={FORM_TIPS} checked={checked} onToggle={toggle} />
        </div>
        <div>
          <Label>Adjust volume</Label>
          <TipList tips={VOLUME_TIPS} checked={checked} onToggle={toggle} />
        </div>
      </div>
    </Card>
  );
}
