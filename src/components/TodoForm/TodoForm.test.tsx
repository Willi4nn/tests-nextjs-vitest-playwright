import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoForm } from '.';

describe('<TodoForm /> (integration)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render all form components', async () => {
    renderForm();
    expect(
      screen.getByRole('button', { name: /criar tarefa/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/tarefa/i)).toBeInTheDocument();
  });

  it('should call action with correct values', async () => {
    const { user, action, input, btn } = renderForm();
    await user.type(input, 'tarefa');
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(action).toHaveBeenCalledExactlyOnceWith('tarefa');
  });

  it('should trim spaces from description', async () => {
    const { user, action, input, btn } = renderForm();
    await user.type(input, '   tarefa    ');
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(action).toHaveBeenCalledExactlyOnceWith('tarefa');
  });

  it('should clear input if form returns success', async () => {
    const { user, input, btn } = renderForm();
    await user.type(input, 'nova tarefa');
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => expect(input).toHaveValue(''));
  });

  it('should disable button while sending action', async () => {
    const { user, btn, input } = renderForm({ delay: 1000 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    expect(btn).toBeDisabled();

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => expect(btn).toBeEnabled());
  });

  it('should disable input while sending action', async () => {
    const { user, input, btn } = renderForm({ delay: 1000 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    expect(input).toBeDisabled();

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => expect(input).toBeEnabled());
  });

  it('should change button text while sending action', async () => {
    const { user, btn, input } = renderForm({ delay: 1000 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    expect(btn).toHaveTextContent('Criando tarefa...');

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await waitFor(() => expect(btn).toHaveTextContent('Criar tarefa'));
  });

  it('should show error when action returns error', async () => {
    const { user, input, btn } = renderForm({ success: false });
    await user.type(input, 'tarefa');
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('falha ao criar todo');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('should keep input text if action returns error', async () => {
    const { user, input, btn } = renderForm({ success: false });
    await user.type(input, 'tarefa');
    await user.click(btn);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(input).toHaveValue('tarefa');
  });
});

type RenderFormOptions = {
  delay?: number;
  success?: boolean;
};

function renderForm({ delay = 0, success = true }: RenderFormOptions = {}) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  const actionResult = success
    ? {
        success: true,
        todo: { id: '1', description: 'desc', createdAt: 'now' },
      }
    : { success: false, errors: ['falha ao criar todo'] };

  const action = vi.fn().mockImplementation(async () => {
    if (delay > 0) {
      await new Promise((r) => setTimeout(r, delay));
    }
    return actionResult;
  });

  render(<TodoForm action={action} />);

  const input = screen.getByLabelText('Tarefa');
  const btn = screen.getByRole('button');

  return { user, action, input, btn };
}
