'use client';

import { useMemo, useState } from 'react';
import type { Issue, IssueStatus, Priority, User } from '../types';

type SortKey = 'title' | 'status' | 'priority' | 'assignee' | 'updatedAt';

type Props = {
  issues: Issue[];
  users: User[];
};

const statusLabel: Record<IssueStatus, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

const priorityOrder: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export default function IssueTable({ issues, users }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<IssueStatus | 'all'>('all');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [assigneeId, setAssigneeId] = useState<string | 'all'>('all');

  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const assigneeNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.id, u.name);
    return m;
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues.filter((i) => {
      if (status !== 'all' && i.status !== status) return false;
      if (priority !== 'all' && i.priority !== priority) return false;
      if (assigneeId !== 'all' && i.assigneeId !== assigneeId) return false;
      if (!q) return true;
      const assignee = i.assigneeId ? assigneeNameById.get(i.assigneeId) ?? '' : '';
      return (
        i.title.toLowerCase().includes(q) ||
        i.descriptionMarkdown.toLowerCase().includes(q) ||
        assignee.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q)
      );
    });
  }, [assigneeId, assigneeNameById, issues, priority, query, status]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      const aAssignee = a.assigneeId ? assigneeNameById.get(a.assigneeId) ?? '' : '';
      const bAssignee = b.assigneeId ? assigneeNameById.get(b.assigneeId) ?? '' : '';

      switch (sortKey) {
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'priority':
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * dir;
        case 'assignee':
          return aAssignee.localeCompare(bAssignee) * dir;
        case 'updatedAt':
        default:
          return a.updatedAt.localeCompare(b.updatedAt) * dir;
      }
    });

    return list;
  }, [assigneeNameById, filtered, sortDir, sortKey]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
          placeholder="搜索标题 / 描述 / 负责人 / 类型"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as IssueStatus | 'all')}
          className="px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
        >
          <option value="all">全部状态</option>
          <option value="backlog">Backlog</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority | 'all')}
          className="px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
        >
          <option value="all">全部优先级</option>
          <option value="urgent">urgent</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>

        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
        >
          <option value="all">全部负责人</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-zinc-900/60 border-b border-slate-800">
              <tr className="text-slate-400">
                <th className="text-left font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('title')}>
                  标题
                </th>
                <th className="text-left font-medium px-4 py-3">类型</th>
                <th className="text-left font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('priority')}>
                  优先级
                </th>
                <th className="text-left font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('status')}>
                  状态
                </th>
                <th className="text-left font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('assignee')}>
                  负责人
                </th>
                <th className="text-left font-medium px-4 py-3">周期</th>
                <th className="text-left font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('updatedAt')}>
                  更新时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((i) => {
                const assignee = i.assigneeId ? assigneeNameById.get(i.assigneeId) : undefined;
                return (
                  <tr key={i.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-white">
                      <div className="flex items-center gap-2">
                        <span className={i.type === 'bug' ? 'text-red-400' : 'text-slate-400'}>
                          {i.type === 'bug' ? 'BUG' : 'ISS'}
                        </span>
                        <span className="truncate">{i.title}</span>
                      </div>
                      {i.descriptionMarkdown && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{i.descriptionMarkdown}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{i.type}</td>
                    <td className="px-4 py-3 text-slate-300">{i.priority}</td>
                    <td className="px-4 py-3 text-slate-300">{statusLabel[i.status]}</td>
                    <td className="px-4 py-3 text-slate-300">{assignee ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{i.cycleId ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(i.updatedAt).toLocaleString()}</td>
                  </tr>
                );
              })}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    没有匹配的 Issues
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
