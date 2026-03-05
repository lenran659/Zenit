'use client';

import { TrendingUp, Clock, Target, Activity } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';

export default function AnalyticsPage() {
  const { tasks } = useProjectStore();

  // 业务逻辑：按状态统计
  const statusStats = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  // 业务逻辑：按优先级统计
  const priorityStats = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  // 业务逻辑：团队成员统计
  const memberStats = tasks.reduce((acc, task) => {
    if (task.assignee) {
      acc[task.assignee] = (acc[task.assignee] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // 业务逻辑：计算平均完成时间（模拟）
  const avgCompletionTime = '3.5';

  // 业务逻辑：本周完成任务数（模拟）
  const weeklyCompleted = tasks.filter(t => t.status === 'done').length;

  const metrics = [
    { 
      icon: Target, 
      label: '完成任务', 
      value: statusStats.done, 
      change: '+12%',
      positive: true,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      icon: Clock, 
      label: '平均完成时间', 
      value: `${avgCompletionTime}天`, 
      change: '-8%',
      positive: true,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    { 
      icon: Activity, 
      label: '进行中', 
      value: statusStats.inProgress, 
      change: '+5%',
      positive: true,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      icon: TrendingUp, 
      label: '本周完成', 
      value: weeklyCompleted, 
      change: '+23%',
      positive: true,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-800 bg-zinc-900/50 backdrop-blur-sm px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-1">数据分析</h1>
        <p className="text-slate-400 text-sm">项目进度和团队效率分析</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-8 py-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${metric.bg} flex items-center justify-center`}>
                  <metric.icon size={24} className={metric.color} />
                </div>
                <span className={`text-xs font-medium ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">任务状态分布</h2>
            <div className="space-y-4">
              {Object.entries(statusStats).map(([status, count]) => {
                const total = tasks.length;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const labels: Record<string, string> = {
                  backlog: '待办',
                  todo: '计划中',
                  inProgress: '进行中',
                  review: '审核中',
                  done: '已完成'
                };
                const colors: Record<string, string> = {
                  backlog: 'bg-slate-500',
                  todo: 'bg-blue-500',
                  inProgress: 'bg-cyan-500',
                  review: 'bg-orange-500',
                  done: 'bg-green-500'
                };
                
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{labels[status]}</span>
                      <span className="text-white font-medium">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[status]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">优先级分布</h2>
            <div className="space-y-4">
              {Object.entries(priorityStats).map(([priority, count]) => {
                const total = tasks.length;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const labels: Record<string, string> = {
                  urgent: '紧急',
                  high: '高',
                  medium: '中',
                  low: '低'
                };
                const colors: Record<string, string> = {
                  urgent: 'bg-red-500',
                  high: 'bg-orange-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-slate-500'
                };
                
                return (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{labels[priority]}</span>
                      <span className="text-white font-medium">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[priority]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-6">团队成员任务分配</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(memberStats).map(([member, count]) => (
                <div key={member} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                    {member[0]}
                  </div>
                  <div className="text-white font-medium mb-1">{member}</div>
                  <div className="text-2xl font-semibold text-cyan-500">{count}</div>
                  <div className="text-xs text-slate-400">任务</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
