'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/theme-toggle';

type LoginPageProps = {
  onLoginSuccess: (userId: string) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
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
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_12%_18%,rgba(139,92,246,0.18),transparent_55%),radial-gradient(900px_circle_at_85%_70%,rgba(59,130,246,0.10),transparent_55%)]" />

      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-10">
          <div>
            <div className="text-sm text-muted-foreground">Zenit</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">把交付速度拉满</h1>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
              看板、表格、时间线一体化。为团队提供一致的工作流与清晰的进度感。
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 max-w-md">
              <div className="rounded-xl border border-border bg-background/40 backdrop-blur px-4 py-3">
                <div className="font-medium">更少噪音</div>
                <div className="text-sm text-muted-foreground mt-1">聚焦任务与交付，减少无效协作成本。</div>
              </div>
              <div className="rounded-xl border border-border bg-background/40 backdrop-blur px-4 py-3">
                <div className="font-medium">更强节奏</div>
                <div className="text-sm text-muted-foreground mt-1">状态清晰、优先级明确，推进更顺滑。</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Zenit</div>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground">欢迎回来</div>
                <div className="text-2xl font-semibold">登录</div>
              </div>
              <ThemeToggle />
            </div>

            <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl">
              <CardHeader>
                <CardTitle>进入工作区</CardTitle>
                <CardDescription>示例账号：任意用户名；密码为 zenit</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">用户名</label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="例如：Alice"
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">密码</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入密码"
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

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">或者</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="w-full">
                      GitHub
                    </Button>
                    <Button type="button" variant="outline" className="w-full">
                      Google
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-xs text-muted-foreground leading-relaxed">
              登录即表示你同意我们的服务条款与隐私政策。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
