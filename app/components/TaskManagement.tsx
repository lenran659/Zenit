'use client';

import { Plus, Filter, Calendar } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import { useProjectStore } from '../hooks/useProjectStore';
import { useEffect, useState } from 'react';
import IssueTable from './IssueTable';
import IssueTimeline from './IssueTimeline';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function TaskManagement() {
  const { currentProject, issues, users, addIssue } = useProjectStore();
  const [view, setView] = useState<'list' | 'kanban' | 'timeline'>('kanban');
  const reduceMotion = useReducedMotion();

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        const isTyping =
          t?.tagName === 'INPUT' ||
          t?.tagName === 'TEXTAREA' ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (t as any)?.isContentEditable;
        if (isTyping) return;
        e.preventDefault();
        setCreateOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const stats = [
    { label: '总任务', value: issues.length, color: 'text-slate-400' },
    { label: '进行中', value: issues.filter(i => i.status === 'in_progress').length, color: 'text-violet-500' },
    { label: '已完成', value: issues.filter(i => i.status === 'done').length, color: 'text-green-500' },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">{currentProject?.name || '任务管理'}</h1>
              <p className="text-muted-foreground text-sm">{currentProject?.description || '管理你的任务和项目'}</p>
            </div>

            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={18} />
              新建任务
            </Button>
          </div>

          <div className="flex items-center gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-3 flex items-center gap-3 border-t border-border">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="list">表格</TabsTrigger>
              <TabsTrigger value="kanban">看板</TabsTrigger>
              <TabsTrigger value="timeline">甘特图</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="secondary" size="sm">
            <Filter size={14} />
            筛选
          </Button>
          <Button variant="secondary" size="sm">
            <Calendar size={14} />
            日期
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
          >
            {view === 'kanban' && <KanbanBoard />}
            {view === 'list' && <IssueTable issues={issues} users={users} />}
            {view === 'timeline' && <IssueTimeline issues={issues} users={users} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建 Issue</DialogTitle>
            <DialogDescription>快捷键 C 打开</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">标题</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：实现登录" />
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">描述（Markdown）</div>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="支持 Markdown..." />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!title.trim()) return;
                addIssue({
                  title: title.trim(),
                  descriptionMarkdown: desc,
                  priority: 'medium',
                  status: 'todo',
                  type: 'issue',
                });
                setTitle('');
                setDesc('');
                setCreateOpen(false);
              }}
            >
              创建
            </Button>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
