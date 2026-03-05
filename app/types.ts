// 项目管理核心类型定义
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
}
