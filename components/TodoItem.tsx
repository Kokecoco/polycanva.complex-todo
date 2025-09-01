
import React, { useState } from 'react';
import { Todo, Subtask } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { Calendar, Tag, Edit, Trash2, ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityStyle = PRIORITY_COLORS[todo.priority];

  const handleSubtaskToggle = (subtaskId: string) => {
    // This functionality would ideally update the state in the parent component.
    // For simplicity, we'll just log it here. A full implementation would require lifting state up.
    console.log(`Subtask ${subtaskId} of todo ${todo.id} toggled.`);
  };

  return (
    <div className={`transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border-l-4 ${priorityStyle.border}`}>
      <div className="p-4 flex items-start gap-4">
        <button onClick={() => onToggleComplete(todo.id, !todo.completed)} className="mt-1 flex-shrink-0">
          {todo.completed ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <Circle size={24} className="text-gray-400 dark:text-gray-500" />
          )}
        </button>
        <div className="flex-grow">
          <p className={`font-bold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
            {todo.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}>
              {todo.priority}
            </span>
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(todo.dueDate).toLocaleDateString('ja-JP')}</span>
              </div>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span>{todo.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEdit(todo)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(todo)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
          {(todo.description || (todo.subtasks && todo.subtasks.length > 0)) && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
            {todo.description && <p className="mt-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{todo.description}</p>}
            {todo.subtasks && todo.subtasks.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">サブタスク</h4>
                    <ul className="space-y-2">
                        {todo.subtasks.map(subtask => (
                            <li key={subtask.id} className="flex items-center gap-3">
                                <button onClick={() => handleSubtaskToggle(subtask.id)}>
                                    {subtask.completed ? <CheckCircle size={18} className="text-green-500"/> : <Circle size={18} className="text-gray-400"/>}
                                </button>
                                <span className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>{subtask.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
