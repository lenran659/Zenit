'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';

type MotionProps = Record<string, unknown>;

type HeroSectionProps = {
  fadeUp: (delay?: number) => MotionProps;
  reduceMotion: boolean;
  cardBase: string;
  panelBase: string;
  panelStrong: string;
  onLogin: () => void;
  onProjects: () => void;
};

export default function HeroSection({
  fadeUp,
  reduceMotion,
  cardBase,
  panelBase,
  panelStrong,
  onLogin,
  onProjects,
}: HeroSectionProps) {
  const thumbnailSrc =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="hsl(238 84% 66% / .18)"/>
            <stop offset="1" stop-color="hsl(262 83% 58% / .10)"/>
          </linearGradient>
          <radialGradient id="r" cx="50%" cy="35%" r="60%">
            <stop offset="0" stop-color="hsl(238 84% 66% / .25)"/>
            <stop offset="1" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" rx="32" fill="hsl(0 0% 100% / 0)"/>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#g)"/>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#r)"/>
        <g opacity="0.18" fill="hsl(240 10% 3.9%)">
          <rect x="140" y="190" width="520" height="96" rx="18"/>
          <rect x="140" y="322" width="520" height="96" rx="18"/>
          <rect x="140" y="454" width="520" height="96" rx="18"/>
          <rect x="720" y="190" width="1060" height="560" rx="26"/>
        </g>
      </svg>`
    );

  return (
    <section id="hero" aria-labelledby="hero-title" className="mt-14">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          {...fadeUp(0.04)}
          className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          公告 · Zenit MVP 已上线
        </motion.div>

        <motion.h1
          id="hero-title"
          {...fadeUp(0.08)}
          className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight"
        >
          把项目管理变成一种
          <span className="bg-linear-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent">顺滑的体验</span>
        </motion.h1>

        <motion.p {...fadeUp(0.12)} className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed">
          Zenit 是一套极简的协作面板：Issues、看板、时间线一体化。团队从「开会」回到「交付」。
        </motion.p>

        <motion.div {...fadeUp(0.16)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={onLogin} className="min-w-40">
            免费开始
          </Button>
          <Button variant="outline" onClick={onProjects} className="min-w-40">
            直接体验
          </Button>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mt-3 text-xs text-muted-foreground">
          无需信用卡 · 2 分钟上手
        </motion.div>
      </div>

      <motion.div
        {...fadeUp(0.22)}
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -6, 0],
              }
        }
        transition={reduceMotion ? { duration: 0 } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-12"
      >
        <Card className={`mx-auto max-w-5xl ${cardBase} shadow-2xl`}>
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_30%,rgba(139,92,246,0.12),transparent_60%)]" />
              <div className="relative p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className={'p-4 ' + panelBase}>
                    <div className="text-xs text-muted-foreground">Inbox</div>
                    <div className="mt-3 space-y-2">
                      {[
                        { t: '修复登录重定向', p: 'P0' },
                        { t: '完善定价页文案', p: 'P1' },
                        { t: '新增时间线视图', p: 'P2' },
                      ].map((x) => (
                        <div key={x.t} className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2">
                          <div className="text-sm truncate pr-3">{x.t}</div>
                          <div className="text-xs text-muted-foreground">{x.p}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={'p-4 lg:col-span-2 ' + panelBase}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">项目概览</div>
                      <div className="text-xs text-muted-foreground">Zenit Console</div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { k: '待处理', v: '12', bar: 'w-[58%]' },
                        { k: '进行中', v: '8', bar: 'w-[42%]' },
                        { k: '已完成', v: '31', bar: 'w-[76%]' },
                      ].map((s) => (
                        <div key={s.k} className={'p-4 ' + panelStrong}>
                          <div className="text-xs text-muted-foreground">{s.k}</div>
                          <div className="mt-2 text-2xl font-semibold">{s.v}</div>
                          <div className="mt-2 h-2 w-full rounded-full bg-muted">
                            <div className={`h-2 ${s.bar} rounded-full bg-violet-500`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={'mt-4 relative p-3 sm:p-4 ' + panelStrong}>
                      <HeroVideoDialog
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        thumbnailSrc={thumbnailSrc}
                        thumbnailAlt="Zenit product demo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
