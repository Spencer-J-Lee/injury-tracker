import clsx from 'clsx';
import { faGripVertical, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { TodoForm } from '@/components/todos/TodoForm';
import type { Todo } from '@/types/models';

interface SortableTodoItemProps {
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

export function SortableTodoItem({
  todo,
  editing,
  onToggle,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
}: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <li ref={setNodeRef} style={style} className="p-2.5">
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
    <li ref={setNodeRef} style={style} className="flex items-start">
      <button
        type="button"
        title="Drag to reorder"
        className={clsx(
          'text-ink-muted hover:text-ink flex shrink-0 cursor-grab touch-none justify-center self-stretch px-2 pt-3.75 active:cursor-grabbing',
        )}
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <div className="min-w-0 flex-1">
        <Checkbox
          label={todo.text}
          checked={todo.completed}
          onChange={(e) => onToggle(e.target.checked)}
          padding={false}
          className="py-3"
        />
        {todo.description && (
          <p className="text-ink-muted -mt-1.5 pb-3 pl-8.5 text-sm whitespace-pre-line">
            {todo.description}
          </p>
        )}
      </div>
      <IconButton
        icon={faPen}
        label="Edit todo"
        onClick={onEdit}
        className="mt-2.5 mr-2.5 shrink-0"
      />
    </li>
  );
}
