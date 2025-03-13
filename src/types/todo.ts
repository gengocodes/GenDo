export type TodoStatus = 'pending' | 'active' | 'completed' | 'archived';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  userId: string;
} 