import { Modal } from '@/components/ui/Modal';
import { TodoList } from '@/components/todos/TodoList';
import { useTodosModal } from '@/context/useTodosModal';

export function TodosModal() {
  const { open, closeTodosModal } = useTodosModal();

  return (
    <Modal open={open} onClose={closeTodosModal} title="Todos">
      <TodoList />
    </Modal>
  );
}
