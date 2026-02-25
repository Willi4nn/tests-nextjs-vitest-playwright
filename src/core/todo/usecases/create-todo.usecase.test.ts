import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contract';
import { createTodoUseCase } from './create-todo.usecase';

describe('createTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  it('should return error when TODO is invalid', async () => {
    const result = (await createTodoUseCase('')) as InvalidTodo;

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it('should return a valid TODO when data is valid', async () => {
    const description = 'any description';
    const result = (await createTodoUseCase(description)) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual({
      createdAt: expect.any(String),
      description,
      id: expect.any(String),
    });
  });

  it('should return error when TODO already exists', async () => {
    // Cria um TODO para garantir que já existe um com a mesma descrição
    const description = 'any description';
    (await createTodoUseCase(description)) as ValidTodo;
    const result = (await createTodoUseCase(description)) as InvalidTodo;

    // A segunda criação deve falhar por já existir um TODO com a mesma descrição
    expect(result.success).toBe(false);
    expect(result.errors).toStrictEqual([
      'Todo with the same ID or description already exists.',
    ]);
  });
});
