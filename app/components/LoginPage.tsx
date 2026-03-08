'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,211,238,0.18),transparent_50%),radial-gradient(900px_circle_at_80%_70%,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="relative w-full max-w-sm">
        <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl">
          <CardHeader>
            <CardTitle>Zenit</CardTitle>
            <CardDescription>登录到你的私有节点</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">用户名</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="例如: Alice"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">密码</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="MVP 默认密码: zenit"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                登录
              </Button>
            </form>
          </CardContent>

          <CardFooter className="border-t border-border flex items-center justify-between text-xs">
            <div className="text-muted-foreground">
              节点: <span className="text-foreground">{node.nodeId}</span>
            </div>
            <div className={node.status === 'running' ? 'text-green-400' : 'text-red-400'}>
              {node.status === 'running' ? '运行中' : '已停止'}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
