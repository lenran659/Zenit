'use client';

import { useMemo, useState } from 'react';

type NodeStatus = {
  nodeId: string;
  status: 'running' | 'stopped';
};

function getNodeStatus(): NodeStatus {
  const nodeId = (() => {
    if (typeof window === 'undefined') return 'node_unknown';
    const key = 'zenit:node_id:v1';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = `node_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
    window.localStorage.setItem(key, created);
    return created;
  })();

  return {
    nodeId,
    status: 'running',
  };
}

type LoginPageProps = {
  onLoginSuccess: (userId: string) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const node = useMemo(() => getNodeStatus(), []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    if (!u) {
      setError('请输入用户名');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    // MVP: 单机版本地认证（示例密码）
    if (password !== 'zenit') {
      setError('密码错误');
      return;
    }

    // MVP: 先固定登录为 Alice（后续会接入 People/Users 管理）
    onLoginSuccess('user_alice');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,211,238,0.18),transparent_50%),radial-gradient(900px_circle_at_80%_70%,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="relative w-full max-w-sm">
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-slate-800 rounded-lg shadow-2xl">
          <div className="px-6 pt-6 pb-4">
            <div className="text-white text-xl font-semibold">Zenit</div>
            <div className="text-slate-400 text-sm mt-1">登录到你的私有节点</div>
          </div>

          <form onSubmit={submit} className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">用户名</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                placeholder="例如: Alice"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/70 border border-slate-800 rounded text-white text-sm outline-none focus:border-cyan-500"
                placeholder="MVP 默认密码: zenit"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-medium text-sm transition-colors"
            >
              登录
            </button>
          </form>

          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="text-slate-500">
              节点: <span className="text-slate-300">{node.nodeId}</span>
            </div>
            <div className={node.status === 'running' ? 'text-green-400' : 'text-red-400'}>
              {node.status === 'running' ? '运行中' : '已停止'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
