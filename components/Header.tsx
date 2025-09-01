
import React from 'react';
import { PlusCircle } from 'lucide-react';

interface HeaderProps {
  onAddTodoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTodoClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
          究極のToDoアプリ
        </h1>
        <button
          onClick={onAddTodoClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">新規追加</span>
        </button>
      </div>
    </header>
  );
};
