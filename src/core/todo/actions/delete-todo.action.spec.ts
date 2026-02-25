import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';
import { deleteTodoAction } from './delete-todo.action';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('deleteTodoAction (unit)', () => {
  it('should call deleteTodoUseCase with the correct values', async () => {
    const { deleteTodoUseCaseSpy } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);

    expect(deleteTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(fakeId);
  });

  it('should call revalidatePath if the usecase returns success', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  it('should return the same value from the usecase on success', async () => {
    const { successResult } = makeTestTodoMocks();
    const fakeId = 'any-id';
    const result = await deleteTodoAction(fakeId);

    expect(result).toStrictEqual(successResult);
  });

  it('should return the same value from the usecase on error', async () => {
    const { deleteTodoUseCaseSpy, errorResult } = makeTestTodoMocks();
    const fakeId = 'any-id';

    deleteTodoUseCaseSpy.mockResolvedValue(errorResult);

    const result = await deleteTodoAction(fakeId);

    expect(result).toStrictEqual(errorResult);
  });
});
