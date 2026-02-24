import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { ValidTodo } from '../schemas/todo.contract';
import { createTodoUseCase } from './create-todo.usecase';
import { deleteTodoUseCase } from './delete-todo.usecase';

describe('deleteTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  it('should return error when ID is empty or blank', async () => {
    const deleteResultEmpty = await deleteTodoUseCase('');
    expect(deleteResultEmpty).toStrictEqual({
      success: false,
      error: 'Invalid ID',
    });

    const deleteResultBlank = await deleteTodoUseCase('   ');
    expect(deleteResultBlank).toStrictEqual({
      success: false,
      error: 'Invalid ID',
    });
  });

  it('should return success when TODO exists and is deleted', async () => {
    const description = 'any description';
    const createResult = (await createTodoUseCase(description)) as ValidTodo;
    const deleteResult = await deleteTodoUseCase(createResult.todo.id);

    expect(deleteResult).toStrictEqual({
      success: true,
      todo: createResult.todo,
    });
  });

  it('should return error when TODO does not exist', async () => {
    const deleteResult = await deleteTodoUseCase('non-existent-id');
    expect(deleteResult).toStrictEqual({
      success: false,
      errors: ['Todo with the given ID does not exist.'],
    });
  });
});
