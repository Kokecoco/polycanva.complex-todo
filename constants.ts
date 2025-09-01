
import { Priority, FilterStatus, SortOption } from './types';

export const PRIORITY_OPTIONS: Priority[] = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];
export const FILTER_STATUS_OPTIONS: FilterStatus[] = [FilterStatus.ALL, FilterStatus.INCOMPLETE, FilterStatus.COMPLETED];
export const SORT_OPTIONS: SortOption[] = [SortOption.CREATED_DESC, SortOption.CREATED_ASC, SortOption.DUE_DATE_ASC, SortOption.PRIORITY_DESC];

export const PRIORITY_COLORS: { [key in Priority]: { bg: string; text: string; border: string } } = {
  [Priority.HIGH]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', border: 'border-red-500' },
  [Priority.MEDIUM]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-500' },
  [Priority.LOW]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', border: 'border-green-500' },
};
