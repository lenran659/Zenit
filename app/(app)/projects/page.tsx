'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { useProjectStore } from '../../hooks/useProjectStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

  const currentProject = useMemo(
    () => projects.find(p => p.id === currentProjectId) ?? null,
    [projects, currentProjectId]
  );

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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Project Hub</h1>
            <p className="text-muted-foreground text-sm">项目登记与配置</p>
          </div>

          <Button onClick={() => setCreating(true)}>
            <Plus size={18} />
            新建项目
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {projects.map((p) => {
              const active = p.id === currentProjectId;
              const MotionCard = motion.create(Card);
              return (
                <MotionCard
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setCurrentProjectId(p.id)}
                  onDoubleClick={() => {
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
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.18, delay: Math.min(0.25, projects.indexOf(p) * 0.03) }}
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
                    <div className="text-sm text-muted-foreground">
                      {p.description || '暂无描述'}
                    </div>
                  </CardContent>

                  {editingId === p.id && (
                    <div className="mx-5 mb-5 border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">名称</div>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">描述</div>
                        <Input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <Button onClick={saveEdit}>
                          保存
                        </Button>
                        <Button variant="secondary" onClick={() => setEditingId(null)}>
                          取消
                        </Button>
                      </div>
                    </div>
                  )}

                  {deletingId === p.id && (
                    <div className="mx-5 mb-5 border-t border-border pt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        删除项目需要输入项目 Key 确认：
                        <span className="text-foreground font-medium ml-1">{p.key}</span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <Input
                          value={deleteConfirmKey}
                          onChange={(e) => setDeleteConfirmKey(e.target.value)}
                          placeholder="输入项目 Key"
                        />
                        <Button variant="destructive" onClick={confirmDelete}>
                          确认删除
                        </Button>
                        <Button variant="secondary" onClick={() => setDeletingId(null)}>
                          取消
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">会同时删除该项目下的 Issues/Cycles。</div>
                    </div>
                  )}
                </MotionCard>
              );
            })}

            {projects.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                暂无项目
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {creating && (
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">新建项目</CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Key（唯一）</div>
                    <Input
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="例如: ZEN"
                    />
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

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        createProject({ key: newKey, name: newName, description: newDesc });
                        setCreating(false);
                        setNewKey('');
                        setNewName('');
                        setNewDesc('');
                      }}
                    >
                      创建
                    </Button>
                    <Button variant="secondary" onClick={() => setCreating(false)}>
                      取消
                    </Button>
                  </div>
                </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">当前项目</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {currentProject ? (
                  <>
                    <div className="text-foreground">{currentProject.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">Key: {currentProject.key}</div>
                  </>
                ) : (
                  '未选择'
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
