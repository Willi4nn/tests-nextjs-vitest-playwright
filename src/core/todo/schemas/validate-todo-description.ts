type ValidateTodoDescription = {
  success: boolean;
  errors?: string[];
};

export function validateTodoDescription(
  description: string
): ValidateTodoDescription {
  const errors: string[] = [];

  if (description.length <= 3) {
    errors.push('Description must be longer than 3 characters.');
  }
  if (description.length > 255) {
    errors.push('Description must be shorter than 255 characters.');
  }
  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
