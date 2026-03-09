'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ClipboardList, FolderKanban, ListChecks } from 'lucide-react';

import { useProjectStore } from '../hooks/useProjectStore';
import type { Issue } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppDashboard() {
  const router = useRouter();
  const { projects, currentProjectId, setCurrentProjectId, currentProject, allIssues } = useProjectStore();

  const stats = useMemo(() => {
    const totalIssues = allIssues.length;
    const inProgress = allIssues.filter((i: Issue) => i.status === 'in_progress').length;
    const todo = allIssues.filter((i: Issue) => i.status === 'todo').length;
    const done = allIssues.filter((i: Issue) => i.status === 'done').length;

    return {
      projectCount: projects.length,
      totalIssues,
      todo,
      inProgress,
      done,
    };
  }, [allIssues, projects.length]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 5);
  }, [projects]);

  const recentIssues = useMemo(() => {
    return [...allIssues]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 8);
  }, [allIssues]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">仪表盘</h1>
            <p className="text-muted-foreground text-sm">全局概览与快捷入口</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                router.push('/projects');
              }}
            >
              <FolderKanban size={18} />
              项目
            </Button>
            <Button
              onClick={() => {
                if (!currentProjectId) {
                  router.push('/projects');
                  return;
                }
                router.push(`/projects/${currentProjectId}/issues`);
              }}
              disabled={!currentProjectId}
            >
              <ClipboardList size={18} />
              进入任务
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">项目数</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stats.projectCount}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">任务总数</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stats.totalIssues}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">进行中</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-violet-500">{stats.inProgress}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">已完成</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-green-500">{stats.done}</CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">最近项目</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
                查看全部
                <ArrowUpRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentProjects.length === 0 ? (
                <div className="text-sm text-muted-foreground">暂无项目</div>
              ) : (
                recentProjects.map((p) => (
                  <button
                    key={p.id}
                    className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-muted/30 text-left"
                    onClick={() => {
                      setCurrentProjectId(p.id);
                      router.push(`/projects/${p.id}/issues`);
                    }}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">Key: {p.key}</div>
                    </div>
                    {currentProject?.id === p.id ? (
                      <div className="text-xs text-muted-foreground">当前</div>
                    ) : null}
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">最近任务</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!currentProjectId) {
                    router.push('/projects');
                    return;
                  }
                  router.push(`/projects/${currentProjectId}/issues`);
                }}
              >
                打开任务管理
                <ArrowUpRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentIssues.length === 0 ? (
                <div className="text-sm text-muted-foreground">暂无任务</div>
              ) : (
                recentIssues.map((i) => (
                  <div
                    key={i.id}
                    className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{i.title}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ListChecks size={12} />
                          {i.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="打开所属项目"
                      onClick={() => {
                        setCurrentProjectId(i.projectId);
                        router.push(`/projects/${i.projectId}/issues`);
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
