'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Issue, IssueStatus, Priority, Project, User, Cycle } from '../types';

type ZenitState = {
  users: User[];
  projects: Project[];
  cycles: Cycle[];
  issues: Issue[];
  currentProjectId: string | null;
};

const STORAGE_KEY = 'zenit:mvp:v1';

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function readState(): ZenitState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ZenitState;
  } catch {
    return null;
  }
}

function writeState(state: ZenitState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedState(): ZenitState {
  const userAlice: User = { id: 'user_alice', name: 'Alice' };
  const userBob: User = { id: 'user_bob', name: 'Bob' };
  const userCharlie: User = { id: 'user_charlie', name: 'Charlie' };

  const projectId = 'proj_zenit';
  const t = nowIso();
  const project: Project = {
    id: projectId,
    key: 'ZEN',
    name: 'Zenit 项目管理系统',
    description: '构建下一代项目管理工具',
    ownerId: userAlice.id,
    memberIds: [userAlice.id, userBob.id, userCharlie.id],
    createdAt: t,
    updatedAt: t,
  };

  const issues: Issue[] = [
    {
      id: 'iss_1',
      projectId,
      title: '设计系统架构',
      descriptionMarkdown: '完成整体系统架构设计文档',
      type: 'issue',
      priority: 'urgent',
      status: 'in_progress',
      assigneeId: userAlice.id,
      watcherIds: [userBob.id],
      startDate: t,
      endDate: t,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'iss_2',
      projectId,
      title: '实现用户认证',
      descriptionMarkdown: '集成 OAuth 2.0 认证流程',
      type: 'issue',
      priority: 'high',
      status: 'todo',
      assigneeId: userBob.id,
      watcherIds: [],
      startDate: t,
      endDate: t,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'iss_3',
      projectId,
      title: '修复登录页面 Bug',
      descriptionMarkdown: '解决移动端登录表单验证问题',
      type: 'bug',
      priority: 'urgent',
      status: 'in_progress',
      assigneeId: userAlice.id,
      watcherIds: [userCharlie.id],
      startDate: t,
      endDate: t,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'iss_4',
      projectId,
      title: '编写 API 文档',
      descriptionMarkdown: '完善 REST API 接口文档',
      type: 'issue',
      priority: 'low',
      status: 'done',
      assigneeId: userCharlie.id,
      watcherIds: [],
      startDate: t,
      endDate: t,
      createdAt: t,
      updatedAt: t,
    },
  ];

  return {
    users: [userAlice, userBob, userCharlie],
    projects: [project],
    cycles: [],
    issues,
    currentProjectId: projectId,
  };
}

export function useProjectStore() {
  const [state, setState] = useState<ZenitState>(() => readState() ?? seedState());

  useEffect(() => {
    writeState(state);
  }, [state]);

  const currentProject = useMemo(() => {
    if (!state.currentProjectId) return null;
    return state.projects.find(p => p.id === state.currentProjectId) ?? null;
  }, [state.currentProjectId, state.projects]);

  const issues = useMemo(() => {
    if (!state.currentProjectId) return [];
    return state.issues.filter(i => i.projectId === state.currentProjectId);
  }, [state.currentProjectId, state.issues]);

  const addIssue = (issue: {
    title: string;
    descriptionMarkdown: string;
    priority: Priority;
    status: IssueStatus;
    type: 'issue' | 'bug';
    assigneeId?: string;
    watcherIds?: string[];
    cycleId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (!state.currentProjectId) return;
    const t = nowIso();
    const newIssue: Issue = {
      id: createId('iss'),
      projectId: state.currentProjectId,
      title: issue.title,
      descriptionMarkdown: issue.descriptionMarkdown,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assigneeId,
      watcherIds: issue.watcherIds ?? [],
      cycleId: issue.cycleId,
      startDate: issue.startDate,
      endDate: issue.endDate,
      createdAt: t,
      updatedAt: t,
    };
    setState(prev => ({ ...prev, issues: [...prev.issues, newIssue] }));
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus) => {
    setState(prev => ({
      ...prev,
      issues: prev.issues.map(i => (i.id === issueId ? { ...i, status, updatedAt: nowIso() } : i)),
    }));
  };

  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    setState(prev => ({
      ...prev,
      issues: prev.issues.map(i => (i.id === issueId ? { ...i, ...updates, updatedAt: nowIso() } : i)),
    }));
  };

  const deleteIssue = (issueId: string) => {
    setState(prev => ({ ...prev, issues: prev.issues.filter(i => i.id !== issueId) }));
  };

  const getIssuesByStatus = (status: IssueStatus) => {
    return issues.filter(i => i.status === status);
  };

  const sortIssuesByPriority = (issueList: Issue[]) => {
    const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...issueList].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const setCurrentProjectId = (projectId: string) => {
    setState(prev => ({ ...prev, currentProjectId: projectId }));
  };

  const createProject = (input: { key: string; name: string; description: string; ownerId?: string }) => {
    const t = nowIso();
    const ownerId = input.ownerId ?? state.users[0]?.id;
    if (!ownerId) return;

    const key = input.key.trim().toUpperCase();
    if (!key) return;

    const exists = state.projects.some(p => p.key.toUpperCase() === key);
    if (exists) return;

    const projectId = createId('proj');
    const project: Project = {
      id: projectId,
      key,
      name: input.name.trim() || key,
      description: input.description.trim(),
      ownerId,
      memberIds: [ownerId],
      createdAt: t,
      updatedAt: t,
    };

    setState(prev => ({
      ...prev,
      projects: [...prev.projects, project],
      currentProjectId: projectId,
    }));
  };

  const updateProject = (projectId: string, updates: Partial<Pick<Project, 'name' | 'description'>>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, ...updates, updatedAt: nowIso() } : p
      ),
    }));
  };

  const deleteProject = (projectId: string) => {
    setState(prev => {
      const remainingProjects = prev.projects.filter(p => p.id !== projectId);
      const remainingIssues = prev.issues.filter(i => i.projectId !== projectId);
      const remainingCycles = prev.cycles.filter(c => c.projectId !== projectId);

      const nextCurrentId =
        prev.currentProjectId === projectId
          ? (remainingProjects[0]?.id ?? null)
          : prev.currentProjectId;

      return {
        ...prev,
        projects: remainingProjects,
        issues: remainingIssues,
        cycles: remainingCycles,
        currentProjectId: nextCurrentId,
      };
    });
  };

  return {
    users: state.users,
    projects: state.projects,
    cycles: state.cycles,
    currentProject,
    currentProjectId: state.currentProjectId,
    issues,
    addIssue,
    updateIssueStatus,
    updateIssue,
    deleteIssue,
    getIssuesByStatus,
    sortIssuesByPriority,
    setCurrentProjectId,
    createProject,
    updateProject,
    deleteProject,
  };
}
