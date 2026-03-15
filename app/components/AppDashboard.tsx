'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ClipboardList, FolderKanban, ListChecks, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';

import { useProjectStore } from '../hooks/useProjectStore';
import type { Issue } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AppDashboard() {
  const router = useRouter();
  const { projects, currentProjectId, setCurrentProjectId, currentProject, allIssues } = useProjectStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

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

  const issueStatusData = useMemo(() => {
    return [
      { status: 'todo', count: stats.todo },
      { status: 'in_progress', count: stats.inProgress },
      { status: 'done', count: stats.done },
    ];
  }, [stats.done, stats.inProgress, stats.todo]);

  const statusChartConfig = useMemo(() => {
    return {
      count: {
        label: '任务数',
        color: 'hsl(var(--primary))',
      },
    } satisfies ChartConfig;
  }, []);

  const areaChartConfig = useMemo(() => {
    return {
      todo: {
        label: 'todo',
        color: 'hsl(var(--primary))',
      },
      in_progress: {
        label: 'in_progress',
        color: 'hsl(271 91% 65%)',
      },
      done: {
        label: 'done',
        color: 'hsl(142 71% 45%)',
      },
    } satisfies ChartConfig;
  }, []);

  const radarChartConfig = useMemo(() => {
    return {
      value: {
        label: '数量',
        color: 'hsl(var(--primary))',
      },
    } satisfies ChartConfig;
  }, []);

  const issueTrendData = useMemo(() => {
    const toDayKey = (d: Date) => {
      const y = d.getFullYear();
      const m = `${d.getMonth() + 1}`.padStart(2, '0');
      const day = `${d.getDate()}`.padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const today = new Date();
    const referenceDate = new Date(today);
    referenceDate.setHours(0, 0, 0, 0);

    let daysToSubtract = 7;
    if (timeRange === '30d') daysToSubtract = 30;
    if (timeRange === '90d') daysToSubtract = 90;

    const start = new Date(referenceDate);
    start.setDate(referenceDate.getDate() - (daysToSubtract - 1));

    const buckets = new Map<
      string,
      {
        date: string;
        todo: number;
        in_progress: number;
        done: number;
      }
    >();

    for (let i = 0; i < daysToSubtract; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = toDayKey(d);
      buckets.set(key, { date: key, todo: 0, in_progress: 0, done: 0 });
    }

    for (const issue of allIssues) {
      const dt = new Date(issue.updatedAt || issue.createdAt);
      if (Number.isNaN(dt.getTime())) continue;

      const day = new Date(dt);
      day.setHours(0, 0, 0, 0);
      if (day < start || day > referenceDate) continue;

      const key = toDayKey(day);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      if (issue.status === 'todo' || issue.status === 'in_progress' || issue.status === 'done') {
        bucket[issue.status] += 1;
      }
    }

    return Array.from(buckets.values());
  }, [allIssues, timeRange]);

  const priorityRadarData = useMemo(() => {
    const counts: Record<string, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const issue of allIssues) {
      counts[issue.priority] = (counts[issue.priority] ?? 0) + 1;
    }

    return [
      { priority: 'urgent', value: counts.urgent },
      { priority: 'high', value: counts.high },
      { priority: 'medium', value: counts.medium },
      { priority: 'low', value: counts.low },
    ];
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

        <div className="mt-6">
          <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-base">任务趋势（交互）</CardTitle>
                <CardDescription>按 issue 的 updatedAt 聚合</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as '7d' | '30d' | '90d')}>
                <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="选择时间范围">
                  <SelectValue placeholder="选择范围" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    最近 90 天
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    最近 30 天
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    最近 7 天
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer config={areaChartConfig} className="aspect-auto h-[280px] w-full">
                <AreaChart data={issueTrendData} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillTodo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-todo)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-todo)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-in_progress)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-in_progress)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-done)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-done)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => {
                      const date = new Date(String(value));
                      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const date = new Date(String(value));
                          return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                        }}
                        indicator="dot"
                      />
                    }
                  />

                  <Area
                    dataKey="todo"
                    type="natural"
                    fill="url(#fillTodo)"
                    stroke="var(--color-todo)"
                    stackId="a"
                  />
                  <Area
                    dataKey="in_progress"
                    type="natural"
                    fill="url(#fillInProgress)"
                    stroke="var(--color-in_progress)"
                    stackId="a"
                  />
                  <Area
                    dataKey="done"
                    type="natural"
                    fill="url(#fillDone)"
                    stroke="var(--color-done)"
                    stackId="a"
                  />

                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">任务状态分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig} className="h-64">
                <BarChart data={issueStatusData} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={6} />
                </BarChart>
              </ChartContainer>
              <div className="mt-2 text-xs text-muted-foreground">
                todo / in_progress / done
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center pb-4">
              <CardTitle className="text-base">优先级雷达</CardTitle>
              <CardDescription>urgent / high / medium / low</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer config={radarChartConfig} className="mx-auto aspect-square max-h-[250px]">
                <RadarChart data={priorityRadarData}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="priority" stroke="hsl(var(--muted-foreground))" />
                  <PolarGrid stroke="hsl(var(--border))" />
                  <Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.6} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                优先级分布概览 <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                统计范围：当前项目全部任务
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
