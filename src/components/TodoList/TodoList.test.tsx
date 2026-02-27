import { mockTodos } from '@/core/__tests__/mocks/todos';
import { Todo } from '@/core/todo/schemas/todo.contract';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoList } from '.';

describe('<TodoList /> (integration)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render heading, list, and TODO list items', async () => {
    const { todos } = renderList();

    const heading = screen.getByRole('heading', {
      name: /lista de tarefas/i,
      level: 1,
    });
    const list = screen.getByRole('list', { name: /lista de tarefas/i });
    const items = screen.getAllByRole('listitem');

    expect(heading).toBeInTheDocument();
    expect(list).toHaveAttribute('aria-labelledby', heading.id);
    expect(items).toHaveLength(todos.length);

    items.forEach((item, index) => {
      expect(item).toHaveTextContent(todos[index].description);
    });
  });

  it('should not render the list of items when there are no TODOs', async () => {
    renderList({ todos: [] });
    const list = screen.queryByRole('list', { name: /lista de tarefas/i });
    expect(list).not.toBeInTheDocument();
  });

  it('should call the correct action for each list item', async () => {
    const { user, action, todos } = renderList();
    const items = screen.getAllByRole('listitem');

    for (let i = 0; i < 3; i++) {
      const btn = within(items[i]).getByRole('button');
      await user.click(btn);
    }

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(action).toHaveBeenCalledTimes(3);
    expect(action).toHaveBeenNthCalledWith(1, todos[0].id);
    expect(action).toHaveBeenNthCalledWith(2, todos[1].id);
    expect(action).toHaveBeenNthCalledWith(3, todos[2].id);
  });

  it('should disable list items while sending action', async () => {
    const { user } = renderList({ delay: 1000 });
    const btns = screen.getAllByRole('button');
    await user.click(btns[1]);

    const items = screen.getAllByRole('listitem');

    expect(items[0]).toHaveClass('bg-gray-200');
    expect(items[0]).not.toHaveClass('bg-amber-200');

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => expect(items[0]).toHaveClass('bg-amber-200'));
  });

  it('should disable list buttons while sending action', async () => {
    const { user } = renderList({ delay: 1000 });
    const btns = screen.getAllByRole('button');
    await user.click(btns[1]);

    btns.forEach((btn) => expect(btn).toBeDisabled());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => {
      btns.forEach((btn) => expect(btn).toBeEnabled());
    });
  });

  it('should alert the user if there is an error deleting the TODO', async () => {
    const { user } = renderList({ success: false });
    const alertFn = vi.fn();
    vi.stubGlobal('alert', alertFn);

    const btn = screen.getAllByRole('button')[0];
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(alertFn).toHaveBeenCalledWith('falha ao apagar todo');
  });

  it('should not call the action if the ID is invalid, empty, or only spaces', async () => {
    const { user, action } = renderList({
      todos: [{ id: '     ', description: 'Tarefa Inválida', createdAt: '' }],
    });

    const btn = screen.getByRole('button');
    await user.click(btn);

    expect(action).not.toHaveBeenCalled();
  });
});

type RenderListProps = {
  delay?: number;
  success?: boolean;
  todos?: Todo[];
};

function renderList({
  delay = 0,
  success = true,
  todos = mockTodos,
}: RenderListProps = {}) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  const actionResult = success
    ? {
        success: true,
        todo: { id: 'id', description: 'desc', createdAt: 'now' },
      }
    : { success: false, errors: ['falha ao apagar todo'] };

  const action = vi.fn().mockImplementation(async () => {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    return actionResult;
  });

  render(<TodoList action={action} todos={todos} />);

  return { user, action, todos };
}
