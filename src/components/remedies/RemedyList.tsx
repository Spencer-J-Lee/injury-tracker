import { useState } from "react";
import { faPen, faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import type { RemedyType } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { EntityForm } from "@/components/ui/EntityForm";
import { useRemedies } from "@/hooks/useRemedies";
import {
  createRemedy,
  archiveRemedy,
  updateRemedy,
} from "@/db/queries/remedies";

function RemedyGroup({
  title,
  type,
  injuryId,
}: {
  title: string;
  type: RemedyType;
  injuryId: string;
}) {
  const remedies = useRemedies(injuryId);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const filtered = (remedies ?? []).filter((r) => r.type === type);

  return (
    <div>
      <h4 className="text-ink-faint mb-2.5 text-[11px] font-semibold tracking-wide uppercase">
        {title}
      </h4>

      {filtered.length > 0 && (
        <ul className="mb-2 space-y-2">
          {filtered.map((remedy) =>
            editingId === remedy.id ? (
              <li key={remedy.id}>
                <EntityForm
                  nameLabel="Remedy Name"
                  initial={{
                    name: remedy.name,
                    description: remedy.description ?? "",
                    category: remedy.category,
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
                  <p className="text-ink text-[13px]">{remedy.name}</p>
                  <div className="flex shrink-0 gap-1.5">
                    {remedy.category && <Badge>{remedy.category}</Badge>}
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
          <EntityForm
            nameLabel="Remedy Name"
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createRemedy({ injuryId, type, ...values });
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant="dashed"
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
  return (
    <Card className="space-y-5">
      <h3 className="font-heading text-ink-emphasis text-sm font-semibold">
        Remedies
      </h3>
      <RemedyGroup title="Relief" type="relief" injuryId={injuryId} />
      <RemedyGroup title="Long-term" type="longterm" injuryId={injuryId} />
    </Card>
  );
}
