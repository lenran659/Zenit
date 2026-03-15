'use client';

import { AlertCircle, ArrowUp, Minus, ArrowDown, MoreHorizontal } from 'lucide-react';
import type { Issue, User } from '../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface TaskCardProps {
  issue: Issue;
  users: User[];
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export default function TaskCard({ issue, users, onDragStart, onDragEnd }: TaskCardProps) {
  const priorityConfig = {
    urgent: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    high: { icon: ArrowUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    medium: { icon: Minus, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    low: { icon: ArrowDown, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  };

  const config = priorityConfig[issue.priority];
  const PriorityIcon = config.icon;
  const assignee = issue.assigneeId ? users.find(u => u.id === issue.assigneeId) : undefined;

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group p-4 transition-all cursor-move hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${config.bg}`}>
          <PriorityIcon size={12} className={config.color} />
          <span className={`text-xs font-medium ${config.color}`}>
            {issue.priority.toUpperCase()}
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-8 w-8"
              type="button"
              aria-label="更多"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{issue.title}</SheetTitle>
              <SheetDescription>任务详情</SheetDescription>
            </SheetHeader>

            <div className="px-4 pb-4 space-y-5">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">描述</div>
                <div className="rounded-lg border border-border bg-background/40 px-3 py-2 text-sm leading-relaxed">
                  {issue.descriptionMarkdown || '暂无描述'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div className="text-xs text-muted-foreground">优先级</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <PriorityIcon size={14} className={config.color} />
                    <span>{issue.priority.toUpperCase()}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div className="text-xs text-muted-foreground">类型</div>
                  <div className="mt-1 text-sm font-medium">
                    {issue.type === 'bug' ? 'BUG' : 'ISSUE'}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">负责人</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  {assignee ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
                        {assignee.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{assignee.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{assignee.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">未分配</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="secondary">
                  编辑
                </Button>
                <Button type="button">
                  打开任务管理
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <h3 className="text-foreground font-medium text-sm mb-2">{issue.title}</h3>
      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{issue.descriptionMarkdown}</p>

      <div className="flex items-center justify-between text-xs">
        {assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
              {assignee.name[0]}
            </div>
            <span className="text-muted-foreground">{assignee.name}</span>
          </div>
        )}
        <span className={issue.type === 'bug' ? 'text-red-500' : 'text-slate-500'}>
          {issue.type === 'bug' ? 'BUG' : 'ISSUE'}
        </span>
      </div>
    </Card>
  );
}
