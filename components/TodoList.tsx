
import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { Inbox } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onEdit, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Inbox size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">タスクがありません</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">新しいタスクを追加して始めましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
