
export enum Priority {
  HIGH = '高',
  MEDIUM = '中',
  LOW = '低',
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  tags?: string[];
  subtasks?: Subtask[];
}

export enum FilterStatus {
  ALL = 'すべて',
  COMPLETED = '完了済み',
  INCOMPLETE = '未完了',
}

export enum SortOption {
  CREATED_DESC = '作成日（新しい順）',
  CREATED_ASC = '作成日（古い順）',
  DUE_DATE_ASC = '期日（早い順）',
  PRIORITY_DESC = '優先度（高い順）',
}
