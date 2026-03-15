// 项目管理核心类型定义
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type IssueType = 'issue' | 'bug';
export type ProjectRole = 'owner' | 'member';

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  projectId: string;
  title: string;
  descriptionMarkdown: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  assigneeId?: string;
  watcherIds: string[];
  cycleId?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: ProjectRole;
}

export interface Session {
  userId: string;
}
