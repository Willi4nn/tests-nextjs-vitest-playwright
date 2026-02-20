import { makeNewTodo } from './make-new-todo';

describe('makeNewTodo', () => {
  it('should create a new todo with the given description', () => {
    // Arrange
    const description = 'Buy groceries';

    // Act
    const todo = makeNewTodo(description);

    // Assert
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('description', description);
    expect(todo).toHaveProperty('createdAt');
  });
});
