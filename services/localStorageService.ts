
import { Todo } from '../types';

const TODOS_KEY = 'ultimateTodos';

export const loadTodos = (): Todo[] => {
  try {
    const serializedState = localStorage.getItem(TODOS_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("ToDoの読み込みに失敗しました:", err);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    const serializedState = JSON.stringify(todos);
    localStorage.setItem(TODOS_KEY, serializedState);
  } catch (err) {
    console.error("ToDoの保存に失敗しました:", err);
  }
};
