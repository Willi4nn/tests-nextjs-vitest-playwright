import { sanitizeStr } from '../../../utils/sanitize-str';
import { todoRepository } from '../repositories/default.repository';

export async function deleteTodoUseCase(id: string) {
  const cleanId = sanitizeStr(id);

  if (!cleanId) {
    return {
      success: false,
      errors: ['Invalid ID'],
    };
  }
  const deleteResult = await todoRepository.delete(cleanId);

  return deleteResult;
}
