import { sanitizeStr } from '@/utils/sanitize-str';
import { validateTodoDescription } from '../schemas/validate-todo-description';
import { makeNewTodo } from './make-new-todo';
import { makeValidatedTodo } from './make-validated-todo';

vi.mock('@/utils/sanitize-str');
vi.mock('../schemas/validate-todo-description');
vi.mock('./make-new-todo');

describe('makeValidatedTodo', () => {
  const mock_raw_input = '  valid description  ';
  const mock_clean_input = 'valid description';
  const mock_todo = {
    id: '123',
    description: mock_clean_input,
    createdAt: 'now',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(sanitizeStr).mockReturnValue(mock_clean_input);
    vi.mocked(validateTodoDescription).mockReturnValue({
      success: true,
      errors: [],
    });
    vi.mocked(makeNewTodo).mockReturnValue(mock_todo);
  });

  it('should call sanitizeStr with the raw description', () => {
    makeValidatedTodo(mock_raw_input);

    expect(sanitizeStr).toHaveBeenCalledWith(mock_raw_input);
  });

  it('should call validateTodoDescription with the sanitized description', () => {
    makeValidatedTodo(mock_raw_input);

    expect(validateTodoDescription).toHaveBeenCalledWith(mock_clean_input);
  });

  it('should return a new todo when description is valid', () => {
    const result = makeValidatedTodo(mock_raw_input);

    expect(makeNewTodo).toHaveBeenCalledWith(mock_clean_input);
    expect(result).toEqual({ success: true, data: mock_todo });
  });

  it('should return errors when description is invalid', () => {
    const fakeErrors = ['Invalid length'];
    vi.mocked(validateTodoDescription).mockReturnValue({
      success: false,
      errors: fakeErrors,
    });

    const result = makeValidatedTodo(mock_raw_input);

    expect(result).toEqual({ success: false, errors: fakeErrors });
    expect(makeNewTodo).not.toHaveBeenCalled();
  });
});
