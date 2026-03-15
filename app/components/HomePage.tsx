'use client';

import { CheckSquare, Clock, TrendingUp, Users } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';
import TaskCard from './TaskCard';

export default function HomePage() {
  const { issues, currentProject, users } = useProjectStore();

  // 业务逻辑：获取紧急任务
  const urgentIssues = issues.filter(issue => issue.priority === 'urgent' && issue.status !== 'done');

  // 业务逻辑：获取我的任务（暂用 Alice）
  const currentUserId = users.find(u => u.name === 'Alice')?.id;
  const myIssues = currentUserId
    ? issues.filter(issue => issue.assigneeId === currentUserId && issue.status !== 'done')
    : [];

  // 业务逻辑：今日到期（MVP 暂无 dueDate，先显示 backlog 数量作为占位）
  const todayCount = issues.filter(i => i.status === 'todo').length;

  // 业务逻辑：计算完成率
  const completionRate = issues.length > 0 
    ? Math.round((issues.filter(i => i.status === 'done').length / issues.length) * 100)
    : 0;

  const stats = [
    { 
      icon: CheckSquare, 
      label: '我的任务', 
      value: myIssues.length, 
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    { 
      icon: Clock, 
      label: '今日到期', 
      value: todayCount, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      icon: TrendingUp, 
      label: '完成率', 
      value: `${completionRate}%`, 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      icon: Users, 
      label: '团队成员', 
      value: users.length, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-800 bg-zinc-900/50 backdrop-blur-sm px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-1">欢迎回来</h1>
        <p className="text-slate-400 text-sm">这是你今天的工作概览</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent Tasks */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">紧急任务</h2>
            <div className="space-y-3">
              {urgentIssues.length > 0 ? (
                urgentIssues.slice(0, 3).map(issue => (
                  <TaskCard key={issue.id} issue={issue} users={users} />
                ))
              ) : (
                <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm">暂无紧急任务</p>
                </div>
              )}
            </div>
          </div>

          {/* My Tasks */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">我的任务</h2>
            <div className="space-y-3">
              {myIssues.length > 0 ? (
                myIssues.slice(0, 3).map(issue => (
                  <TaskCard key={issue.id} issue={issue} users={users} />
                ))
              ) : (
                <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm">暂无待办任务</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">项目概览</h2>
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium mb-1">{currentProject?.name}</h3>
                <p className="text-slate-400 text-sm">{currentProject?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-white">{issues.length}</div>
                <div className="text-xs text-slate-400">总任务数</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>进度</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
