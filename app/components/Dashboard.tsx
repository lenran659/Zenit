'use client';

import { Plus, Filter, Calendar } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import { useProjectStore } from '../hooks/useProjectStore';

export default function Dashboard() {
  const { currentProject, tasks } = useProjectStore();

  const stats = [
    { label: '总任务', value: tasks.length, color: 'text-slate-400' },
    { label: '进行中', value: tasks.filter(t => t.status === 'in-progress').length, color: 'text-cyan-500' },
    { label: '已完成', value: tasks.filter(t => t.status === 'done').length, color: 'text-green-500' },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                {currentProject?.name || '项目看板'}
              </h1>
              <p className="text-slate-400 text-sm">
                {currentProject?.description || '管理你的任务和项目'}
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-medium text-sm transition-colors">
              <Plus size={18} />
              新建任务
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">{stat.label}</span>
                <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 py-3 flex items-center gap-3 border-t border-slate-800">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors">
            <Filter size={14} />
            筛选
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors">
            <Calendar size={14} />
            日期
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-auto px-8 py-6">
        <KanbanBoard />
      </main>
    </div>
  );
}
