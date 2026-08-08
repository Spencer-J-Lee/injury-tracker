import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SortableTodoItem } from '@/components/todos/SortableTodoItem';
import { CompletedTodoRow } from '@/components/todos/CompletedTodoRow';
import { TodoForm } from '@/components/todos/TodoForm';
import { useTodos } from '@/hooks/useTodos';
import {
  createTodo,
  toggleTodo,
  updateTodo,
  reorderTodos,
  deleteCompletedTodos,
} from '@/db/queries/todos';

export function TodoList() {
  const todos = useTodos() ?? [];
  const incomplete = todos.filter((todo) => !todo.completed);
  const completed = todos.filter((todo) => todo.completed);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = incomplete.findIndex((todo) => todo.id === active.id);
    const newIndex = incomplete.findIndex((todo) => todo.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(incomplete, oldIndex, newIndex);
    try {
      await reorderTodos(reordered.map((todo) => todo.id));
    } catch (error) {
      console.error('Failed to reorder todos', error);
    }
  };

  return (
    <div className="space-y-4">
      {incomplete.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={incomplete.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <Card
              as="ul"
              size="sm"
              variant="muted"
              padding={false}
              className="divide-subtle divide-y overflow-hidden"
            >
              {incomplete.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  editing={editingId === todo.id}
                  onToggle={(completedValue) =>
                    toggleTodo(todo.id, completedValue)
                  }
                  onEdit={() => setEditingId(todo.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onSubmitEdit={async (values) => {
                    await updateTodo(todo.id, values);
                    setEditingId(null);
                  }}
                />
              ))}
            </Card>
          </SortableContext>
        </DndContext>
      )}

      <div className={incomplete.length > 0 ? '-mt-1.5' : undefined}>
        {adding ? (
          <TodoForm
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createTodo(values);
              setAdding(false);
            }}
          />
        ) : (
          <Button
            variant={todos.length > 0 ? 'ghost' : 'dashed'}
            size={todos.length > 0 ? 'sm' : 'md'}
            onClick={() => setAdding(true)}
            className="w-full"
          >
            + Add
          </Button>
        )}
      </div>

      {completed.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-ink-muted text-sm font-medium">Completed</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteCompletedTodos()}
            >
              Clear completed
            </Button>
          </div>
          <Card
            as="ul"
            size="sm"
            variant="muted"
            padding={false}
            className="divide-subtle divide-y overflow-hidden"
          >
            {completed.map((todo) => (
              <CompletedTodoRow
                key={todo.id}
                todo={todo}
                editing={editingId === todo.id}
                onToggle={(completedValue) =>
                  toggleTodo(todo.id, completedValue)
                }
                onEdit={() => setEditingId(todo.id)}
                onCancelEdit={() => setEditingId(null)}
                onSubmitEdit={async (values) => {
                  await updateTodo(todo.id, values);
                  setEditingId(null);
                }}
              />
            ))}
          </Card>
        </div>
      )}

      {todos.length === 0 && (
        <p className="text-ink-muted py-4 text-center text-sm">No todos yet.</p>
      )}
    </div>
  );
}
