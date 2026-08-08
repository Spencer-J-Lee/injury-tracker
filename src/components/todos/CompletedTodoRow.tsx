import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { TodoForm } from '@/components/todos/TodoForm';
import type { Todo } from '@/types/models';

interface CompletedTodoRowProps {
  todo: Todo;
  editing: boolean;
  onToggle: (completed: boolean) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (values: {
    text: string;
    description?: string;
  }) => Promise<void>;
}

export function CompletedTodoRow({
  todo,
  editing,
  onToggle,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
}: CompletedTodoRowProps) {
  if (editing) {
    return (
      <li className="p-2.5">
        <TodoForm
          initial={{ text: todo.text, description: todo.description ?? '' }}
          submitLabel="Save"
          onCancel={onCancelEdit}
          onSubmit={onSubmitEdit}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start">
      <div className="min-w-0 flex-1">
        <Checkbox
          label={todo.text}
          checked={todo.completed}
          onChange={(e) => onToggle(e.target.checked)}
          padding={false}
          className="text-ink-muted px-4 py-2 line-through"
        />
        {todo.description && (
          <p className="text-ink-faint -mt-1 pb-2 pl-13 text-sm whitespace-pre-line line-through">
            {todo.description}
          </p>
        )}
      </div>
      <IconButton
        icon={faPen}
        label="Edit todo"
        onClick={onEdit}
        className="mt-1.5 mr-2.5 shrink-0"
      />
    </li>
  );
}
