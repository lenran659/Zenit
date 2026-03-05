'use client';

import { useState, useEffect } from 'react';
import { Task, Status, Priority, Project } from '../types';

// 模拟数据存储和业务逻辑
export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // 初始化示例数据
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: '设计系统架构',
        description: '完成整体系统架构设计文档',
        priority: 'urgent',
        status: 'in-progress',
        assignee: 'Alice',
        dueDate: '2026-03-10',
        createdAt: '2026-03-01',
        updatedAt: '2026-03-05',
      },
      {
        id: '2',
        title: '实现用户认证',
        description: '集成 OAuth 2.0 认证流程',
        priority: 'high',
        status: 'todo',
        assignee: 'Bob',
        dueDate: '2026-03-15',
        createdAt: '2026-03-02',
        updatedAt: '2026-03-05',
      },
      {
        id: '3',
        title: '优化数据库查询',
        description: '提升查询性能，减少响应时间',
        priority: 'medium',
        status: 'review',
        assignee: 'Charlie',
        dueDate: '2026-03-08',
        createdAt: '2026-02-28',
        updatedAt: '2026-03-04',
      },
      {
        id: '4',
        title: '编写 API 文档',
        description: '完善 REST API 接口文档',
        priority: 'low',
        status: 'done',
        assignee: 'Diana',
        dueDate: '2026-03-05',
        createdAt: '2026-02-25',
        updatedAt: '2026-03-05',
      },
      {
        id: '5',
        title: '修复登录页面 Bug',
        description: '解决移动端登录表单验证问题',
        priority: 'urgent',
        status: 'in-progress',
        assignee: 'Alice',
        dueDate: '2026-03-06',
        createdAt: '2026-03-03',
        updatedAt: '2026-03-05',
      },
    ];

    const sampleProject: Project = {
      id: 'proj-1',
      name: 'Zenit 项目管理系统',
      description: '构建下一代项目管理工具',
      tasks: sampleTasks,
      createdAt: '2026-02-20',
    };

    setProjects([sampleProject]);
    setCurrentProject(sampleProject);
    setTasks(sampleTasks);
  }, []);

  // 业务逻辑：添加任务
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  // 业务逻辑：更新任务状态
  const updateTaskStatus = (taskId: string, status: Status) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // 业务逻辑：更新任务
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // 业务逻辑：删除任务
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // 业务逻辑：按状态分组任务
  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  // 业务逻辑：按优先级排序
  const sortTasksByPriority = (taskList: Task[]) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...taskList].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };

  return {
    projects,
    currentProject,
    tasks,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTasksByStatus,
    sortTasksByPriority,
  };
}
