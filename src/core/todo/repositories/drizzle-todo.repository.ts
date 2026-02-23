import { DrizzleDatabase } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { todoTable } from '../schemas/drizzle-todo-table.schema';
import { Todo, TodoPresenter } from '../schemas/todo.contract';
import { TodoRepository } from './todo.contract.repository';

export class DrizzleTodoRepository implements TodoRepository {
  private readonly db: DrizzleDatabase;

  constructor(db: DrizzleDatabase) {
    this.db = db;
  }

  findAll(): Promise<Todo[]> {
    return this.db.query.todo.findMany({
      orderBy: (todo, { desc }) => [
        desc(todo.createdAt),
        desc(todo.description),
      ],
    });
  }

  async create(todoData: Todo): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) =>
        or(
          eq(todoTable.id, todoData.id),
          eq(todoTable.description, todoData.description)
        ),
    });

    if (!!existingTodo) {
      return {
        success: false,
        errors: ['Todo with the same ID or description already exists.'],
      };
    }

    await this.db.insert(todoTable).values(todoData);

    return {
      success: true,
      todo: todoData,
    };
  }

  async delete(id: string): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq }) => eq(todoTable.id, id),
    });

    if (!existingTodo) {
      return {
        success: false,
        errors: ['Todo with the given ID does not exist.'],
      };
    }

    await this.db.delete(todoTable).where(eq(todoTable.id, id));

    return {
      success: true,
      todo: existingTodo as Todo,
    };
  }
}
