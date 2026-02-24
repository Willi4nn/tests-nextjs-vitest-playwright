import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';
import { createTodoAction } from './create-todo.action';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createTodoAction (unit)', () => {
  test('should call createTodoUseCase with correct description', async () => {
    const { createTodoUseCaseSpy } = makeTestTodoMocks();
    const description = 'description that will pass validation';
    await createTodoAction(description);

    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(description);
  });

  test('should call revalidatePath with correct path', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    await createTodoAction('description that will pass validation');

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('should return the result of createTodoUseCase with correct success status', async () => {
    const { createTodoUseCaseSpy, successResult } = makeTestTodoMocks();
    const description = 'description that will pass validation';
    const result = await createTodoAction(description);

    expect(createTodoUseCaseSpy).toHaveBeenCalledWith(description);
    expect(result).toStrictEqual(successResult);
  });

  test('should return the result of createTodoUseCase with correct error message if failed', async () => {
    const { createTodoUseCaseSpy, errorResult } = makeTestTodoMocks();
    createTodoUseCaseSpy.mockResolvedValue(errorResult);
    const result = await createTodoAction(
      'description that will fail validation',
    );

    expect(result).toStrictEqual(errorResult);
  });
});
