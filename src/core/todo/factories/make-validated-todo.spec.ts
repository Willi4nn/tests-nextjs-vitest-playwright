import { sanitizeStr } from '@/utils/sanitize-str';
import { validateTodoDescription } from '../schemas/validate-todo-description';
import { makeNewTodo } from './make-new-todo';
import { makeValidatedTodo } from './make-validated-todo';

vi.mock('@/utils/sanitize-str');
vi.mock('../schemas/validate-todo-description');
vi.mock('./make-new-todo');

describe('makeValidatedTodo', () => {
  const mockRawInput = '  valid description  ';
  const mockCleanInput = 'valid description';
  const mockTodo = {
    id: '123',
    description: mockCleanInput,
    createdAt: 'now',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(sanitizeStr).mockReturnValue(mockCleanInput);
    vi.mocked(validateTodoDescription).mockReturnValue({
      success: true,
      errors: undefined,
    });
    vi.mocked(makeNewTodo).mockReturnValue(mockTodo);
  });

  it('should call sanitizeStr with the raw description', () => {
    makeValidatedTodo(mockRawInput);

    expect(sanitizeStr).toHaveBeenCalledWith(mockRawInput);
  });

  it('should call validateTodoDescription with the sanitized description', () => {
    makeValidatedTodo(mockRawInput);

    expect(validateTodoDescription).toHaveBeenCalledWith(mockCleanInput);
  });

  it('should return a new todo when description is valid', () => {
    const result = makeValidatedTodo(mockRawInput);

    expect(makeNewTodo).toHaveBeenCalledWith(mockCleanInput);
    expect(result).toEqual({ success: true, todo: mockTodo });
  });

  it('should return errors when description is invalid', () => {
    const fakeErrors = ['Invalid length'];
    vi.mocked(validateTodoDescription).mockReturnValue({
      success: false,
      errors: fakeErrors,
    });

    const result = makeValidatedTodo(mockRawInput);

    expect(result).toEqual({ success: false, errors: fakeErrors });
    expect(makeNewTodo).not.toHaveBeenCalled();
  });
});
