import { useState } from "react";
import { faPen, faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { HabitForm } from "@/components/habits/HabitForm";
import { useHabits } from "@/hooks/useHabits";
import { createHabit, archiveHabit, updateHabit } from "@/db/queries/habits";

export function HabitList() {
  const habits = useHabits() ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card>
      <h3 className="font-heading text-ink-emphasis mb-6 text-lg font-semibold">
        Manage Habits
      </h3>

      {habits.length > 0 && (
        <ul className="mb-2.5 space-y-2.5">
          {habits.map((habit) =>
            editingId === habit.id ? (
              <li key={habit.id}>
                <HabitForm
                  initial={{
                    name: habit.name,
                    description: habit.description ?? "",
                  }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateHabit(habit.id, values);
                    setEditingId(null);
                  }}
                />
              </li>
            ) : (
              <Card as="li" size="md" variant="muted" key={habit.id}>
                <div className="flex min-w-0 items-start justify-between gap-2.5">
                  <p className="text-ink">{habit.name}</p>
                  <div className="flex shrink-0 gap-2">
                    <IconButton
                      icon={faPen}
                      label="Edit habit"
                      onClick={() => setEditingId(habit.id)}
                    />
                    <IconButton
                      icon={faBoxArchive}
                      tone="danger"
                      label="Archive habit"
                      onClick={() => archiveHabit(habit.id)}
                    />
                  </div>
                </div>
                {habit.description && (
                  <p className="text-ink-muted mt-1.5 text-sm">
                    {habit.description}
                  </p>
                )}
              </Card>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <HabitForm
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createHabit(values);
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant={habits.length > 0 ? "ghost" : "dashed"}
          size={habits.length > 0 ? "sm" : "md"}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </Card>
  );
}
