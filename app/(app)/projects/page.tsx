'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, CheckCircle2, LayoutGrid, Table2, ChevronDown } from 'lucide-react';
import { useProjectStore } from '../../hooks/useProjectStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion, useReducedMotion } from 'framer-motion';

export default function ProjectsPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const {
    projects,
    currentProjectId,
    setCurrentProjectId,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectStore();

  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState('');

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    let id: number | null = null;
    try {
      const raw = window.localStorage.getItem('zenit:projects:view:v1');
      if (raw === 'table' || raw === 'card') {
        id = window.setTimeout(() => setViewMode(raw), 0);
      }
    } catch {
      // ignore
    }
    return () => {
      if (id !== null) window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('zenit:projects:view:v1', viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  const startEdit = (projectId: string) => {
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    setEditingId(projectId);
    setEditName(p.name);
    setEditDesc(p.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateProject(editingId, { name: editName.trim(), description: editDesc.trim() });
    setEditingId(null);
  };

  const startDelete = (projectId: string) => {
    setDeletingId(projectId);
    setDeleteConfirmKey('');
  };

  const confirmDelete = () => {
    const p = projects.find(x => x.id === deletingId);
    if (!p) return;
    if (deleteConfirmKey.trim().toUpperCase() !== p.key.toUpperCase()) return;
    deleteProject(p.id);
    setDeletingId(null);
  };

  const submitCreate = () => {
    const key = newKey.trim();
    const name = newName.trim();
    const description = newDesc.trim();
    if (!key || !name) return;

    createProject({ key, name, description });
    setCreating(false);
    setNewKey('');
    setNewName('');
    setNewDesc('');
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDesc('');
  };

  const closeDelete = () => {
    setDeletingId(null);
    setDeleteConfirmKey('');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Project Hub</h1>
            <p className="text-muted-foreground text-sm">项目登记与配置</p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" type="button">
                  {viewMode === 'card' ? <LayoutGrid size={16} /> : <Table2 size={16} />}
                  视图
                  <ChevronDown size={16} className="opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>项目列表视图</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setViewMode('card');
                  }}
                >
                  <LayoutGrid size={16} />
                  卡片
                  {viewMode === 'card' ? <CheckCircle2 size={16} className="ml-auto" /> : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setViewMode('table');
                  }}
                >
                  <Table2 size={16} />
                  表格
                  {viewMode === 'table' ? <CheckCircle2 size={16} className="ml-auto" /> : null}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setCreating(true)}>
              <Plus size={18} />
              新建项目
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {viewMode === 'card' ? (
              <>
                {projects.map((p) => {
                  const active = p.id === currentProjectId;
                  const MotionCard = motion.create(Card);
                  return (
                    <MotionCard
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setCurrentProjectId(p.id);
                        router.push(`/projects/${p.id}/issues`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setCurrentProjectId(p.id);
                          router.push(`/projects/${p.id}/issues`);
                        }
                      }}
                      className={`cursor-pointer outline-none ${
                        active
                          ? 'border-primary/60 ring-1 ring-primary/20'
                          : 'hover:border-muted-foreground/30'
                      }`}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.18,
                              delay: Math.min(0.25, projects.indexOf(p) * 0.03),
                            }
                      }
                      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    >
                      <CardHeader className="p-5">
                        <CardTitle className="text-base flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center font-semibold">
                                {p.key.slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{p.name}</div>
                                <div className="text-xs text-muted-foreground">Key: {p.key}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!active ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentProjectId(p.id);
                                  router.push(`/projects/${p.id}/issues`);
                                }}
                              >
                                进入
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 text-green-500 text-sm">
                                <CheckCircle2 size={16} />
                                当前
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(p.id);
                              }}
                              aria-label="edit"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                startDelete(p.id);
                              }}
                              aria-label="delete"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-5 pb-5 pt-0">
                        <div className="text-sm text-muted-foreground">{p.description || '暂无描述'}</div>
                      </CardContent>
                    </MotionCard>
                  );
                })}
              </>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="text-left font-medium px-4 py-3">Key</th>
                        <th className="text-left font-medium px-4 py-3">名称</th>
                        <th className="text-left font-medium px-4 py-3">描述</th>
                        <th className="text-right font-medium px-4 py-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => {
                        const active = p.id === currentProjectId;
                        return (
                          <tr
                            key={p.id}
                            className={`border-b border-border hover:bg-muted/30 ${active ? 'bg-muted/20' : ''}`}
                            onClick={() => {
                              setCurrentProjectId(p.id);
                              router.push(`/projects/${p.id}/issues`);
                            }}
                          >
                            <td className="px-4 py-3 font-medium whitespace-nowrap">{p.key}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{p.name}</span>
                                {active ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-500">
                                    <CheckCircle2 size={14} />
                                    当前
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground max-w-[420px]">
                              <div className="truncate">{p.description || '暂无描述'}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="进入"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentProjectId(p.id);
                                    router.push(`/projects/${p.id}/issues`);
                                  }}
                                >
                                  <CheckCircle2 size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="编辑"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(p.id);
                                  }}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="删除"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startDelete(p.id);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {projects.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">暂无项目</div>
                ) : null}
              </div>
            )}

            {viewMode === 'card' && projects.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">暂无项目</Card>
            )}
          </div>
        </div>
      </main>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>创建一个新的项目空间（Key 必须唯一）</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Key（唯一）</div>
              <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="例如: ZEN" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">名称</div>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例如: Zenit 项目管理"
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">描述</div>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="min-h-24"
                placeholder="一句话描述这个项目"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submitCreate} disabled={!newKey.trim() || !newName.trim()}>
              创建
            </Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
            <DialogDescription>更新项目名称与描述</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">名称</div>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">描述</div>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                saveEdit();
                closeEdit();
              }}
              disabled={!editName.trim()}
            >
              保存
            </Button>
            <Button variant="secondary" onClick={closeEdit}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) closeDelete();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除项目</DialogTitle>
            <DialogDescription>输入项目 Key 确认删除（不可恢复）</DialogDescription>
          </DialogHeader>

          {deletingId ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                删除项目需要输入项目 Key 确认：
                <span className="text-foreground font-medium ml-1">
                  {projects.find(x => x.id === deletingId)?.key ?? ''}
                </span>
              </div>
              <Input
                value={deleteConfirmKey}
                onChange={(e) => setDeleteConfirmKey(e.target.value)}
                placeholder="输入项目 Key"
              />
              <div className="text-xs text-muted-foreground">会同时删除该项目下的 Issues/Cycles。</div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                confirmDelete();
                closeDelete();
              }}
              disabled={(() => {
                const p = projects.find(x => x.id === deletingId);
                if (!p) return true;
                return deleteConfirmKey.trim().toUpperCase() !== p.key.toUpperCase();
              })()}
            >
              确认删除
            </Button>
            <Button variant="secondary" onClick={closeDelete}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
