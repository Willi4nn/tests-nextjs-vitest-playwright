export type Todo = {
  id: string;
  description: string;
  createdAt: string;
};

type ValidTodo = {
  success: true;
  todo: Todo;
};

type InvalidTodo = {
  success: false;
  errors: string[];
};

export type TodoPresenter = ValidTodo | InvalidTodo;
