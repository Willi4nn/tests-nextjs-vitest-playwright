import { revalidatePath } from 'next/cache';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contract';
import { createTodoUseCase } from '../usecases/create-todo.usecase';
import { createTodoAction } from './create-todo.action';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('../usecases/create-todo.usecase', () => ({
  createTodoUseCase: vi.fn(),
}));

const mockRevalidatePath = vi.mocked(revalidatePath);
const mockCreateTodoUseCase = vi.mocked(createTodoUseCase);

const mockDescription = 'Buy groceries';

const mockSuccessResult = {
  success: true as const,
  todo: {
    id: 'any-id',
    description: mockDescription,
    createdAt: 'any-date',
  },
} as ValidTodo;

const mockFailureResult = {
  success: false as const,
  errors: ['Description is too short'],
} as InvalidTodo;

describe('createTodoAction (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateTodoUseCase.mockResolvedValue(mockSuccessResult);
  });

  test('should call createTodoUseCase with correct description', async () => {
    const expectedParamCall = 'description that will pass validation';
    await createTodoAction(expectedParamCall);

    expect(createTodoUseCase).toHaveBeenCalledExactlyOnceWith(
      expectedParamCall,
    );
  });

  test('should call revalidatePath with correct path', async () => {
    const description = 'description that will pass validation';
    await createTodoAction(description);

    expect(mockRevalidatePath).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('should return the result of createTodoUseCase with correct success status', async () => {
    const description = 'description that will pass validation';
    const result = await createTodoAction(description);

    expect(createTodoUseCase).toHaveBeenCalledWith(description);
    expect(result).toStrictEqual(mockSuccessResult);
  });

  test('should return the result of createTodoUseCase with correct error message if failed', async () => {
    mockCreateTodoUseCase.mockResolvedValue(mockFailureResult);
    const description = 'description that will fail validation';
    const result = await createTodoAction(description);

    expect(result).toStrictEqual(mockFailureResult);
  });
});

test('should return the result of createTodoUseCase with correct error message if failed', async () => {
  mockCreateTodoUseCase.mockResolvedValue(mockFailureResult);
  const description = 'description that will fail validation';
  const result = await createTodoAction(description);
  expect(result).toStrictEqual(mockFailureResult);
});
