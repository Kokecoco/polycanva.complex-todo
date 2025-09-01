
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterSortPanel } from './components/FilterSortPanel';
import { TodoList } from './components/TodoList';
import { AddTodoModal } from './components/AddTodoModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Todo, FilterStatus, SortOption, Priority } from './types';
import { saveTodos, loadTodos } from './services/localStorageService';
import { getMotivationalQuote } from './services/geminiService';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(FilterStatus.ALL);
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.CREATED_DESC);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [motivation, setMotivation] = useState<string>('');

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleAddTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
    setEditingTodo(null);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed } : t)));
    if (completed) {
      setMotivation('AIが応援メッセージを生成中...');
      const quote = await getMotivationalQuote();
      setMotivation(quote);
      setTimeout(() => setMotivation(''), 5000);
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    setDeletingTodo(null);
  };

  const openAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (todo: Todo) => {
    setDeletingTodo(todo);
  };

  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter(todo => {
        const statusMatch =
          filterStatus === FilterStatus.ALL ||
          (filterStatus === FilterStatus.COMPLETED && todo.completed) ||
          (filterStatus === FilterStatus.INCOMPLETE && !todo.completed);
        const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;
        const searchTermMatch =
          searchTerm === '' ||
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && priorityMatch && searchTermMatch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case SortOption.DUE_DATE_ASC:
            return (a.dueDate || 'Z').localeCompare(b.dueDate || 'Z');
          case SortOption.PRIORITY_DESC:
            const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          case SortOption.CREATED_ASC:
            return a.createdAt.localeCompare(b.createdAt);
          case SortOption.CREATED_DESC:
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [todos, filterStatus, filterPriority, sortOption, searchTerm]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header onAddTodoClick={openAddModal} />
      
      {motivation && (
        <div className="fixed top-20 right-5 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 animate-fade-in-out">
          <p className="font-bold">素晴らしい！</p>
          <p>{motivation}</p>
        </div>
      )}

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
        <FilterSortPanel
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          sortOption={sortOption}
          setSortOption={setSortOption}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex-1">
          <TodoList
            todos={filteredAndSortedTodos}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
          />
        </div>
      </main>

      {isModalOpen && (
        <AddTodoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={editingTodo ? handleUpdateTodo : handleAddTodo}
          existingTodo={editingTodo}
        />
      )}

      {deletingTodo && (
        <ConfirmationModal
          isOpen={!!deletingTodo}
          onClose={() => setDeletingTodo(null)}
          onConfirm={() => handleDeleteTodo(deletingTodo.id)}
          title="ToDoの削除"
          message={`「${deletingTodo.title}」を本当に削除しますか？この操作は取り消せません。`}
        />
      )}
    </div>
  );
};

export default App;
