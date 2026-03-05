'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';
import { Task, Status } from '../types';
import { useProjectStore } from '../hooks/useProjectStore';

export default function KanbanBoard() {
  const { tasks, updateTaskStatus } = useProjectStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: { status: Status; label: string; count: number }[] = [
    { status: 'backlog', label: '待办', count: tasks.filter(t => t.status === 'backlog').length },
    { status: 'todo', label: '计划中', count: tasks.filter(t => t.status === 'todo').length },
    { status: 'in-progress', label: '进行中', count: tasks.filter(t => t.status === 'in-progress').length },
    { status: 'review', label: '审核中', count: tasks.filter(t => t.status === 'review').length },
    { status: 'done', label: '已完成', count: tasks.filter(t => t.status === 'done').length },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Status) => {
    if (draggedTask) {
      updateTaskStatus(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.status)}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-slate-400 text-sm font-medium">{column.label}</h3>
            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
              {column.count}
            </span>
          </div>
          
          <div className="space-y-3">
            {tasks
              .filter(task => task.status === column.status)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={() => handleDragStart(task)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
