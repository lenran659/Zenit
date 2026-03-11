'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';
import { useProjectStore } from '../hooks/useProjectStore';

export default function KanbanBoard() {
  const { issues, updateIssueStatus, users } = useProjectStore();
  const [draggedIssue, setDraggedIssue] = useState<(typeof issues)[number] | null>(null);

  const columns: { status: 'backlog' | 'todo' | 'in_progress' | 'done'; label: string; count: number }[] = [
    { status: 'backlog', label: 'Backlog', count: issues.filter(i => i.status === 'backlog').length },
    { status: 'todo', label: 'Todo', count: issues.filter(i => i.status === 'todo').length },
    { status: 'in_progress', label: 'In Progress', count: issues.filter(i => i.status === 'in_progress').length },
    { status: 'done', label: 'Done', count: issues.filter(i => i.status === 'done').length },
  ];

  const handleDragStart = (issue: (typeof issues)[number]) => {
    setDraggedIssue(issue);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: (typeof columns)[number]['status']) => {
    if (draggedIssue) {
      updateIssueStatus(draggedIssue.id, status);
      setDraggedIssue(null);
    }
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className="shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.status)}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-medium">{column.label}</h3>
            <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
              {column.count}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {issues
              .filter(issue => issue.status === column.status)
              .map(issue => (
                <div key={issue.id} className="shrink-0 w-72">
                  <TaskCard issue={issue} users={users} onDragStart={() => handleDragStart(issue)} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
