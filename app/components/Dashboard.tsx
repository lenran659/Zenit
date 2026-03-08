'use client';

import { Plus, Filter, Calendar } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import { useProjectStore } from '../hooks/useProjectStore';
import { useState } from 'react';
import IssueTable from './IssueTable';
import IssueTimeline from './IssueTimeline';

export default function Dashboard() {
  const { currentProject, issues, users } = useProjectStore();
  const [view, setView] = useState<'list' | 'kanban' | 'timeline'>('kanban');

  const stats = [
    { label: '总任务', value: issues.length, color: 'text-slate-400' },
    { label: '进行中', value: issues.filter(i => i.status === 'in_progress').length, color: 'text-cyan-500' },
    { label: '已完成', value: issues.filter(i => i.status === 'done').length, color: 'text-green-500' },
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
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                view === 'list' ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              表格
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                view === 'kanban' ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              看板
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                view === 'timeline' ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              甘特图
            </button>
          </div>

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

      {/* Views */}
      <main className="flex-1 overflow-auto px-8 py-6">
        {view === 'kanban' && <KanbanBoard />}
        {view === 'list' && <IssueTable issues={issues} users={users} />}
        {view === 'timeline' && <IssueTimeline issues={issues} users={users} />}
      </main>
    </div>
  );
}
