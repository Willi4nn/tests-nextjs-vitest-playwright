import { sanitizeStr } from '@/utils/sanitize-str';
import { TodoPresenter } from '../schemas/todo.contract';
import { validateTodoDescription } from '../schemas/validate-todo-description';
import { makeNewTodo } from './make-new-todo';

export function makeValidatedTodo(description: string): TodoPresenter {
  const cleanDescription = sanitizeStr(description);
  const validatedDescription = validateTodoDescription(cleanDescription);

  if (validatedDescription.success) {
    return {
      success: true,
      todo: makeNewTodo(cleanDescription),
    };
  }

  return {
    success: false,
    errors: validatedDescription.errors ?? [],
  };
}
