'use client';

import { AlertCircle, ArrowUp, Minus, ArrowDown, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export default function TaskCard({ task, onDragStart, onDragEnd }: TaskCardProps) {
  const priorityConfig = {
    urgent: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    high: { icon: ArrowUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    medium: { icon: Minus, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    low: { icon: ArrowDown, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  };

  const config = priorityConfig[task.priority];
  const PriorityIcon = config.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group bg-zinc-900 border border-slate-800 rounded p-4 hover:border-slate-700 transition-all cursor-move hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${config.bg}`}>
          <PriorityIcon size={12} className={config.color} />
          <span className={`text-xs font-medium ${config.color}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded transition-all">
          <MoreHorizontal size={16} className="text-slate-400" />
        </button>
      </div>

      <h3 className="text-white font-medium text-sm mb-2">{task.title}</h3>
      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between text-xs">
        {task.assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
              {task.assignee[0]}
            </div>
            <span className="text-slate-400">{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <span className="text-slate-500">{task.dueDate}</span>
        )}
      </div>
    </div>
  );
}
