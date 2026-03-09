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

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {
          initial: false as const,
          animate: { opacity: 1 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay },
        };

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

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <motion.header {...fadeUp(0)} className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-lg font-semibold tracking-tight hover:opacity-90"
          >
            Zenit
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="secondary" onClick={() => router.push('/login?next=/projects')}>
              登录
            </Button>
          </div>
        </motion.header>

        <main>
          <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp(0.05)}>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                轻量协作 · Linear 风格交互 · 黑白主题
              </div>

              <h1 className="mt-5 text-4xl lg:text-5xl font-semibold tracking-tight">
                把项目管理变成一种
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  顺滑的体验
                </span>
              </h1>
              <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                Zenit 是一套极简的 SaaS 项目协作面板：Issues、看板、时间线一体化。团队从「开会」回到「交付」。
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button onClick={() => router.push('/login?next=/projects')}>免费开始</Button>
                <Button variant="outline" onClick={() => router.push('/projects')}>
                  直接体验
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-xl border bg-background/40 px-4 py-3">
                  <div className="text-lg font-semibold">10x</div>
                  <div className="text-muted-foreground text-xs mt-1">更清晰的进度感</div>
                </div>
                <div className="rounded-xl border bg-background/40 px-4 py-3">
                  <div className="text-lg font-semibold">2min</div>
                  <div className="text-muted-foreground text-xs mt-1">上手时间</div>
                </div>
                <div className="rounded-xl border bg-background/40 px-4 py-3">
                  <div className="text-lg font-semibold">0</div>
                  <div className="text-muted-foreground text-xs mt-1">多余噪音</div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.12)}>
              <Card className="bg-card/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>项目控制台预览</CardTitle>
                  <CardDescription>登录后会自动跳转到 Project Hub</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">待处理</div>
                      <div className="mt-2 text-2xl font-semibold">12</div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[55%] rounded-full bg-cyan-500" />
                      </div>
                    </div>
                    <div className="rounded-xl border bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">本周交付</div>
                      <div className="mt-2 text-2xl font-semibold">8</div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[70%] rounded-full bg-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-background/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">现在你该做什么？</div>
                      <div className="text-xs text-muted-foreground">智能排序</div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2">
                        <div className="text-sm">修复登录重定向</div>
                        <div className="text-xs text-muted-foreground">P0</div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2">
                        <div className="text-sm">完善定价页文案</div>
                        <div className="text-xs text-muted-foreground">P1</div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2">
                        <div className="text-sm">新增时间线视图</div>
                        <div className="text-xs text-muted-foreground">P2</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1" onClick={() => router.push('/login?next=/projects')}>
                      立即登录
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => router.push('/projects')}
                    >
                      浏览项目
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          <section className="mt-16">
            <motion.div {...fadeUp(0.05)} className="text-center">
              <div className="text-xs text-muted-foreground">被这些团队的习惯所启发</div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Product', 'Design', 'Growth', 'Engineering'].map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border bg-background/40 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          <section className="mt-16">
            <motion.div {...fadeUp(0.06)} className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">为速度而设计的核心功能</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                你需要的不是更多「功能」，而是更少阻力。Zenit 只做对交付最关键的部分。
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Issue 到交付，一条线走到底',
                  desc: '从收集、拆分、排期到验收，全程可追踪，减少跨工具切换。',
                },
                {
                  title: '看板与时间线同步',
                  desc: '拖拽调整节奏，时间线自动对齐，让计划成为可执行的节奏表。',
                },
                {
                  title: '极简权限与空间',
                  desc: '项目空间天然隔离，避免“一个工作区装下全公司”的混乱。',
                },
              ].map((f) => (
                <motion.div key={f.title} {...fadeUp(0.08)}>
                  <Card className="h-full bg-card/70 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">{f.title}</CardTitle>
                      <CardDescription className="leading-relaxed">{f.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 w-10 rounded-xl border bg-background/40 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-foreground"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <motion.div {...fadeUp(0.06)}>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">把流程固化成默认动作</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  你不需要每天重新设计流程。Zenit 用「默认」帮你保持团队节奏：每个人都知道下一步要做什么。
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { k: '收集', v: '统一入口收敛需求，减少信息丢失。' },
                    { k: '计划', v: '把“想做”变成“什么时候做”。' },
                    { k: '执行', v: '关注当前要交付的事，而不是所有事。' },
                    { k: '复盘', v: '用数据回看节奏，持续优化迭代。' },
                  ].map((x) => (
                    <div key={x.k} className="rounded-xl border bg-background/40 px-4 py-3">
                      <div className="text-sm font-medium">{x.k}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{x.v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.12)}>
                <Card className="bg-card/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-base">一个 Sprint 的节奏</CardTitle>
                    <CardDescription>用最少步骤完成一次完整交付</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { step: '01', title: '创建 Issue', meta: '一句话描述 + 验收标准' },
                        { step: '02', title: '排入时间线', meta: '估时 + 负责人' },
                        { step: '03', title: '移动看板', meta: '进行中 → 待验收' },
                        { step: '04', title: '关闭并记录', meta: '产出可复用的知识片段' },
                      ].map((s) => (
                        <div key={s.step} className="flex gap-3 rounded-xl border bg-background/40 px-4 py-3">
                          <div className="w-10 shrink-0 text-sm font-semibold text-muted-foreground">
                            {s.step}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{s.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{s.meta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="mt-16">
            <motion.div {...fadeUp(0.06)} className="text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">清晰的定价，按团队成长</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                先把流程跑起来，再决定是否升级。你也可以直接进入项目试用。
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Free',
                  price: '¥0',
                  desc: '个人体验与小型项目',
                  features: ['基础看板', '时间线视图', '深色/浅色主题'],
                  cta: { label: '开始使用', variant: 'secondary' as const },
                },
                {
                  name: 'Pro',
                  price: '¥39',
                  desc: '适合小团队持续交付',
                  features: ['团队空间', '更细的权限', '更快的筛选与搜索'],
                  highlight: true,
                  cta: { label: '免费试用', variant: 'default' as const },
                },
                {
                  name: 'Business',
                  price: '¥99',
                  desc: '复杂协作与多项目管理',
                  features: ['多项目报表', '自定义流程', '优先支持'],
                  cta: { label: '联系销售', variant: 'outline' as const },
                },
              ].map((p, idx) => (
                <motion.div key={p.name} {...fadeUp(0.06 + idx * 0.04)}>
                  <Card
                    className={
                      p.highlight
                        ? 'h-full bg-card/80 backdrop-blur border-foreground/20'
                        : 'h-full bg-card/70 backdrop-blur'
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{p.name}</span>
                        {p.highlight ? (
                          <span className="rounded-full bg-foreground text-background px-2 py-0.5 text-xs">
                            推荐
                          </span>
                        ) : null}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">{p.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-3xl font-semibold">
                          {p.price}
                          <span className="text-sm font-normal text-muted-foreground">/人/月</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {p.features.map((f) => (
                          <div key={f} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                            <span className="text-muted-foreground">{f}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        variant={p.cta.variant}
                        onClick={() =>
                          router.push(
                            p.name === 'Business' ? '/login?next=/projects' : '/login?next=/projects'
                          )
                        }
                      >
                        {p.cta.label}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              以上价格为示例文案，可按你的实际商业模式调整。
            </div>
          </section>

          <section className="mt-16">
            <motion.div {...fadeUp(0.06)} className="text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">用户怎么说</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                “少即是多”在协作里不是口号，而是每天更少的打断。
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  quote: '终于不用在十几个工具里来回找信息，讨论和交付变得连贯了。',
                  name: 'Wendy',
                  title: 'PM',
                },
                {
                  quote: '看板 + 时间线一起用，排期不用再靠脑补，团队节奏更稳。',
                  name: 'Leo',
                  title: 'Tech Lead',
                },
                {
                  quote: '界面干净，动作很少，但恰好覆盖了我们日常 80% 的协作。',
                  name: 'Mina',
                  title: 'Designer',
                },
              ].map((t, idx) => (
                <motion.div key={t.name} {...fadeUp(0.08 + idx * 0.04)}>
                  <Card className="h-full bg-card/70 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">“{t.quote}”</CardTitle>
                      <CardDescription>
                        {t.name} · {t.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-1 text-muted-foreground">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <motion.div {...fadeUp(0.06)}>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">常见问题</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  如果你想把它真正做成一个商业化 SaaS，我也可以帮你补齐注册、计费、订阅与控制台信息架构。
                </p>
              </motion.div>

              <motion.div {...fadeUp(0.12)} className="space-y-3">
                {[
                  {
                    q: 'Zenit 适合什么团队？',
                    a: '适合希望用最少工具把需求 → 排期 → 交付跑通的小团队，尤其是产品与研发协作紧密的场景。',
                  },
                  {
                    q: '可以自定义流程吗？',
                    a: '可以。建议先用默认流程跑顺，再逐步加自定义字段、状态与自动化规则。',
                  },
                  {
                    q: '现在就能直接用吗？',
                    a: '可以。你可以点击“直接体验”进入项目页面；如果已有会话会自动跳转。',
                  },
                ].map((x) => (
                  <details key={x.q} className="group rounded-xl border bg-background/40 px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-medium flex items-center justify-between">
                      <span>{x.q}</span>
                      <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.a}</div>
                  </details>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="mt-16">
            <motion.div {...fadeUp(0.06)}>
              <Card className="bg-card/70 backdrop-blur">
                <CardContent className="py-10 sm:py-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="text-xs text-muted-foreground">准备开始了吗？</div>
                      <div className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                        让团队回到交付本身
                      </div>
                      <div className="mt-3 text-muted-foreground leading-relaxed">
                        现在就进入项目页，或登录后开始你的第一个项目空间。
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                      <Button onClick={() => router.push('/login?next=/projects')}>创建/登录</Button>
                      <Button variant="secondary" onClick={() => router.push('/projects')}>
                        直接进入项目
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          <footer className="mt-14 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
              <div className="text-muted-foreground">© {new Date().getFullYear()} Zenit</div>
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                  onClick={() => router.push('/projects')}
                >
                  产品
                </button>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                  onClick={() => router.push('/login?next=/projects')}
                >
                  登录
                </button>
                <a
                  className="hover:text-foreground transition-colors"
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">Zenit MVP</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
