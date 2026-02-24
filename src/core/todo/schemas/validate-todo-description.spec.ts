import { validateTodoDescription } from './validate-todo-description';

describe('description validation', () => {
  it('should validate a valid description', () => {
    const result = validateTodoDescription('test');

    expect(result.success).toBe(true);
  });

  it('should invalidate a description that is too short', () => {
    const result = validateTodoDescription('err');

    expect(result.success).toBe(false);
    expect(result.errors).toContain(
      'Description must be longer than 3 characters.',
    );
  });
});
