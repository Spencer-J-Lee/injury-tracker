import { useState } from "react";
import type { RemedyCategory, Remedy } from "@/types/models";
import { useRemedies } from "@/hooks/useRemedies";
import { createRemedy } from "@/db/queries/remedies";
import { Label } from "../ui/Label";
import { TogglePill } from "@/components/ui/TogglePill";
import { Button } from "../ui/Button";
import { RemedyForm } from "@/components/remedies/RemedyForm";

interface RemedyCheckboxGroupProps {
  injuryId: string;
  selectedRemedyIds: string[];
  onToggle: (remedyId: string) => void;
}

interface RemedyDefaults {
  category?: RemedyCategory;
  providesImmediateRelief?: boolean;
}

function RemedySection({
  title,
  remedies,
  selectedRemedyIds,
  onToggle,
  defaults,
  onAdd,
}: {
  title: string;
  remedies: Remedy[];
  selectedRemedyIds: string[];
  onToggle: (remedyId: string) => void;
  defaults: RemedyDefaults;
  onAdd: (values: {
    name: string;
    description: string;
    category?: RemedyCategory;
    providesImmediateRelief: boolean;
  }) => void | Promise<void>;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {remedies.map((remedy) => (
          <TogglePill
            key={remedy.id}
            tone="green"
            selected={selectedRemedyIds.includes(remedy.id)}
            onClick={() => onToggle(remedy.id)}
          >
            {remedy.name}
          </TogglePill>
        ))}
        <Button
          variant={remedies.length > 0 ? "ghost" : "dashed"}
          size="sm"
          onClick={() => setAdding(true)}
        >
          + Add
        </Button>
      </div>
      {adding && (
        <div className="mt-1.5">
          <RemedyForm
            initial={defaults}
            submitLabel="Add"
            showShortcuts={false}
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await onAdd(values);
              setAdding(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function RemedyCheckboxGroup({
  injuryId,
  selectedRemedyIds,
  onToggle,
}: RemedyCheckboxGroupProps) {
  const remedies = useRemedies(injuryId) ?? [];
  const strengthening = remedies.filter((r) => r.category === "Strengthening");
  const mobility = remedies.filter((r) => r.category === "Mobility");
  const prevention = remedies
    .filter((r) => r.category !== "Strengthening" && r.category !== "Mobility")
    .sort((a, b) => {
      const categoryCompare = (a.category ?? "").localeCompare(
        b.category ?? "",
      );
      if (categoryCompare !== 0) return categoryCompare;
      return a.name.localeCompare(b.name);
    });

  const handleAdd = async (values: {
    name: string;
    description: string;
    category?: RemedyCategory;
    providesImmediateRelief: boolean;
  }) => {
    const created = await createRemedy({
      injuryId,
      name: values.name,
      description: values.description || undefined,
      category: values.category,
      providesImmediateRelief: values.providesImmediateRelief,
    });
    onToggle(created.id);
  };

  return (
    <div className="space-y-3">
      <RemedySection
        title="Strengthening"
        remedies={strengthening}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        defaults={{ category: "Strengthening" }}
        onAdd={handleAdd}
      />
      <RemedySection
        title="Mobility"
        remedies={mobility}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        defaults={{ category: "Mobility" }}
        onAdd={handleAdd}
      />
      <RemedySection
        title="Prevention"
        remedies={prevention}
        selectedRemedyIds={selectedRemedyIds}
        onToggle={onToggle}
        defaults={{}}
        onAdd={handleAdd}
      />
    </div>
  );
}
