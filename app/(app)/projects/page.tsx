'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { useProjectStore } from '../../hooks/useProjectStore';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
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
      <header className="flex-shrink-0 border-b border-slate-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Project Hub</h1>
            <p className="text-slate-400 text-sm">项目登记与配置</p>
          </div>

          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-medium text-sm transition-colors"
          >
            <Plus size={18} />
            新建项目
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {projects.map((p) => {
              const active = p.id === currentProjectId;
              return (
                <div
                  key={p.id}
                  className={`border rounded-lg p-5 bg-zinc-900 ${
                    active ? 'border-cyan-500/60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white font-semibold">
                          {p.key.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">{p.name}</div>
                          <div className="text-xs text-slate-500">Key: {p.key}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-400">
                        {p.description || '暂无描述'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!active ? (
                        <button
                          onClick={() => {
                            setCurrentProjectId(p.id);
                            router.push(`/projects/${p.id}/issues`);
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm"
                        >
                          进入
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle2 size={16} />
                          当前
                        </div>
                      )}

                      <button
                        onClick={() => startEdit(p.id)}
                        className="p-2 hover:bg-slate-800 rounded"
                        aria-label="edit"
                      >
                        <Pencil size={16} className="text-slate-400" />
                      </button>
                      <button
                        onClick={() => startDelete(p.id)}
                        className="p-2 hover:bg-slate-800 rounded"
                        aria-label="delete"
                      >
                        <Trash2 size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {editingId === p.id && (
                    <div className="mt-4 border-t border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">名称</div>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">描述</div>
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {deletingId === p.id && (
                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <div className="text-sm text-slate-300 mb-2">
                        删除项目需要输入项目 Key 确认：
                        <span className="text-white font-medium ml-1">{p.key}</span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <input
                          value={deleteConfirmKey}
                          onChange={(e) => setDeleteConfirmKey(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-red-500"
                          placeholder="输入项目 Key"
                        />
                        <button
                          onClick={confirmDelete}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 rounded text-sm"
                        >
                          确认删除
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm"
                        >
                          取消
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">会同时删除该项目下的 Issues/Cycles。</div>
                    </div>
                  )}
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="border border-slate-800 bg-zinc-900 rounded-lg p-8 text-center text-slate-400">
                暂无项目
              </div>
            )}
          </div>

          <div className="space-y-4">
            {creating && (
              <div className="border border-slate-800 bg-zinc-900 rounded-lg p-5">
                <div className="text-white font-medium mb-4">新建项目</div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Key（唯一）</div>
                    <input
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                      placeholder="例如: ZEN"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">名称</div>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                      placeholder="例如: Zenit 项目管理"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">描述</div>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500 min-h-24"
                      placeholder="一句话描述这个项目"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        createProject({ key: newKey, name: newName, description: newDesc });
                        setCreating(false);
                        setNewKey('');
                        setNewName('');
                        setNewDesc('');
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                    >
                      创建
                    </button>
                    <button
                      onClick={() => setCreating(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="border border-slate-800 bg-zinc-900 rounded-lg p-5">
              <div className="text-white font-medium">当前项目</div>
              <div className="text-slate-400 text-sm mt-2">
                {currentProject ? (
                  <>
                    <div className="text-white">{currentProject.name}</div>
                    <div className="text-slate-500 text-xs mt-1">Key: {currentProject.key}</div>
                  </>
                ) : (
                  '未选择'
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
