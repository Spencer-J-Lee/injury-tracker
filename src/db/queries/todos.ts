import { db } from '@/db/schema';
import type { Todo } from '@/types/models';

export async function listTodos(): Promise<Todo[]> {
  const todos = await db.todos.toArray();
  const incomplete = todos
    .filter((todo) => !todo.completed)
    .sort((a, b) => a.position - b.position);
  const completed = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''));
  return [...incomplete, ...completed];
}

export async function createTodo(input: {
  text: string;
  description?: string;
}): Promise<Todo> {
  return db.transaction('rw', db.todos, async () => {
    const existing = await db.todos.toArray();
    const nextPosition =
      existing.length > 0
        ? Math.max(...existing.map((todo) => todo.position)) + 1
        : 0;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: input.text,
      description: input.description || undefined,
      completed: false,
      position: nextPosition,
      createdAt: new Date().toISOString(),
    };
    await db.todos.add(todo);
    return todo;
  });
}

export async function updateTodo(
  id: string,
  changes: Partial<Pick<Todo, 'text' | 'description'>>,
) {
  await db.todos.update(id, changes);
}

export async function toggleTodo(id: string, completed: boolean) {
  await db.todos.update(id, {
    completed,
    completedAt: completed ? new Date().toISOString() : undefined,
  });
}

export async function reorderTodos(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.todos, async () => {
    await Promise.all(
      orderedIds.map((id, index) => db.todos.update(id, { position: index })),
    );
  });
}

export async function deleteTodo(id: string): Promise<void> {
  await db.todos.delete(id);
}

export async function deleteCompletedTodos(): Promise<void> {
  await db.transaction('rw', db.todos, async () => {
    const completed = (await db.todos.toArray()).filter(
      (todo) => todo.completed,
    );
    await db.todos.bulkDelete(completed.map((todo) => todo.id));
  });
}
