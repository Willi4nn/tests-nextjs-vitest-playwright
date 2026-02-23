import { Todo, TodoPresenter } from '../schemas/todo.contract';

export interface FindAllTodoRepository {
  findAll: () => Promise<Todo[]>;
}

export interface CreateTodoRepository {
  create: (todo: Todo) => Promise<TodoPresenter>;
}

export interface DeleteTodoRepository {
  delete: (id: string) => Promise<TodoPresenter>;
}

export interface TodoRepository
  extends FindAllTodoRepository, CreateTodoRepository, DeleteTodoRepository {}
