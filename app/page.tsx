'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/theme-toggle';

const SESSION_KEY = 'zenit:session:v1';

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      const parsed = raw ? (JSON.parse(raw) as { userId?: string }) : null;
      if (parsed?.userId) {
        router.replace('/projects');
      }
    } catch {
      // ignore
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(34,211,238,0.16),transparent_55%),radial-gradient(900px_circle_at_80%_70%,rgba(59,130,246,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
          className="flex items-center justify-between"
        >
          <div className="text-lg font-semibold">Zenit</div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="secondary" onClick={() => router.push('/login?next=/projects')}>
              登录
            </Button>
          </div>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.28, delay: 0.05 }}
          >
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight">
              你的极简项目协作面板
            </h1>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              用 Linear 风格的交互管理 Issues、看板与时间线。支持本地节点与黑白主题。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => router.push('/login?next=/projects')}>开始使用</Button>
              <Button variant="outline" onClick={() => router.push('/projects')}>
                直接进入
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.28, delay: 0.12 }}
          >
            <Card className="bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>快速入口</CardTitle>
                <CardDescription>登录后会自动跳转到 Project Hub</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => router.push('/login?next=/projects')}>
                  前往登录
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/projects')}
                >
                  浏览项目
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-14 text-xs text-muted-foreground">
          Zenit MVP
        </div>
      </div>
    </div>
  );
}
