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
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(900px_circle_at_88%_75%,hsl(var(--ring)/0.10),transparent_55%)]" />

      <div className="relative min-h-screen">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-0">
          <div className="min-h-screen grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="hidden lg:block lg:col-span-7">
              <div className="max-w-xl">
                <div className="text-sm text-muted-foreground">Zenit</div>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">把交付速度拉满</h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  看板、表格、时间线一体化。为团队提供一致的工作流与清晰的进度感。
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur px-5 py-4">
                    <div className="font-medium">更少噪音</div>
                    <div className="text-sm text-muted-foreground mt-1">聚焦任务与交付，减少无效协作成本。</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur px-5 py-4">
                    <div className="font-medium">更强节奏</div>
                    <div className="text-sm text-muted-foreground mt-1">状态清晰、优先级明确，推进更顺滑。</div>
                  </div>
                </div>

                <div className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Zenit</div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto w-full max-w-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Zenit Workspace
                    </div>
                    <div className="mt-4 text-2xl font-semibold tracking-tight">欢迎回来</div>
                    <div className="mt-1 text-sm text-muted-foreground">示例账号：任意用户名；密码为 zenit</div>
                  </div>
                  <ThemeToggle />
                </div>

                <Card className="mt-6 border-border/60 bg-card/70 backdrop-blur-xl shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle>登录</CardTitle>
                    <CardDescription>进入你的工作区并继续推进交付。</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="login-username" className="text-sm font-medium">
                          用户名
                        </label>
                        <Input
                          id="login-username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="例如：Alice"
                          autoComplete="username"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="login-password" className="text-sm font-medium">
                          密码
                        </label>
                        <Input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="输入密码"
                          autoComplete="current-password"
                        />
                      </div>

                      {error && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                          {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full">
                        登录
                      </Button>

                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
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

                <div className="mt-6 grid gap-3 lg:hidden">
                  <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur px-4 py-3">
                    <div className="font-medium">更少噪音</div>
                    <div className="text-sm text-muted-foreground mt-1">聚焦任务与交付，减少无效协作成本。</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur px-4 py-3">
                    <div className="font-medium">更强节奏</div>
                    <div className="text-sm text-muted-foreground mt-1">状态清晰、优先级明确，推进更顺滑。</div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-muted-foreground leading-relaxed">
                  登录即表示你同意我们的服务条款与隐私政策。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
