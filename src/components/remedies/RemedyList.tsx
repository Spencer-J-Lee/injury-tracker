import { useState } from "react";
import {
  faPen,
  faBoxArchive,
  faAsterisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Category, Remedy } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { RemedyForm } from "@/components/remedies/RemedyForm";
import { useRemedies } from "@/hooks/useRemedies";
import {
  createRemedy,
  archiveRemedy,
  updateRemedy,
} from "@/db/queries/remedies";

interface RemedySectionDefaults {
  category?: Category;
}

function RemedySection({
  title,
  remedies,
  injuryId,
  defaults,
  showCategoryBadge = true,
}: {
  title: string;
  remedies: Remedy[];
  injuryId: string;
  defaults: RemedySectionDefaults;
  showCategoryBadge?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <h4 className="text-ink-faint mb-2.5 text-[11px] font-semibold tracking-wide uppercase">
        {title}
      </h4>

      {remedies.length > 0 && (
        <ul className="mb-2 space-y-2">
          {remedies.map((remedy) =>
            editingId === remedy.id ? (
              <li key={remedy.id}>
                <RemedyForm
                  initial={{
                    name: remedy.name,
                    description: remedy.description ?? "",
                    category: remedy.category,
                    providesImmediateRelief: remedy.providesImmediateRelief,
                  }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateRemedy(remedy.id, values);
                    setEditingId(null);
                  }}
                />
              </li>
            ) : (
              <li
                key={remedy.id}
                className="border-subtle rounded-[10px] border px-3 py-[9px]"
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <p className="text-ink flex items-center gap-1.5 text-[13px]">
                    {remedy.providesImmediateRelief && (
                      <FontAwesomeIcon
                        icon={faAsterisk}
                        className="text-pain-green shrink-0 text-[10px]"
                        title="Provides immediate relief"
                      />
                    )}
                    {remedy.name}
                  </p>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                    {showCategoryBadge && remedy.category && (
                      <Badge>{remedy.category}</Badge>
                    )}
                    <IconButton
                      icon={faPen}
                      label="Edit remedy"
                      onClick={() => setEditingId(remedy.id)}
                    />
                    <IconButton
                      icon={faBoxArchive}
                      tone="danger"
                      label="Archive remedy"
                      onClick={() => archiveRemedy(remedy.id)}
                    />
                  </div>
                </div>
                {remedy.description && (
                  <p className="text-ink-muted mt-1 text-xs text-pretty">
                    {remedy.description}
                  </p>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <RemedyForm
            initial={defaults}
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createRemedy({ injuryId, ...values });
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant={remedies.length > 0 ? "ghost" : "dashed"}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </div>
  );
}

export function RemedyList({ injuryId }: { injuryId: string }) {
  const remedies = useRemedies(injuryId) ?? [];
  const strengthening = remedies.filter(
    (r) => r.category === "Strengthening",
  );
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

  return (
    <Card className="space-y-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-heading text-ink-emphasis text-sm font-semibold">
          Remedies
        </h3>
        <span className="text-ink-faint flex items-center gap-1 text-[11px]">
          <FontAwesomeIcon icon={faAsterisk} className="text-pain-green text-[10px]" />
          Immediate relief
        </span>
      </div>
      <RemedySection
        title="Strengthening"
        remedies={strengthening}
        injuryId={injuryId}
        defaults={{ category: "Strengthening" }}
        showCategoryBadge={false}
      />
      <RemedySection
        title="Mobility"
        remedies={mobility}
        injuryId={injuryId}
        defaults={{ category: "Mobility" }}
        showCategoryBadge={false}
      />
      <RemedySection
        title="Prevention"
        remedies={prevention}
        injuryId={injuryId}
        defaults={{}}
      />
    </Card>
  );
}
