
import React from 'react';
import { Search, ListFilter, ArrowDownUp } from 'lucide-react';
import { FilterStatus, Priority, SortOption } from '../types';
import { FILTER_STATUS_OPTIONS, PRIORITY_OPTIONS, SORT_OPTIONS } from '../constants';

interface FilterSortPanelProps {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (priority: Priority | 'all') => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  sortOption, setSortOption,
  searchTerm, setSearchTerm,
}) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 space-y-6">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Search size={20} />検索</h3>
        <input
          type="text"
          placeholder="タスクを検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ListFilter size={20} />フィルター</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ステータス</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILTER_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">優先度</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ArrowDownUp size={20} />並び替え</h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </aside>
  );
};
