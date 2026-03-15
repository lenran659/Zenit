'use client';

import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MotionProps = Record<string, unknown>;

type FeaturesSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  cardBase: string;
  panelBase: string;
};

export default function FeaturesSection({ viewFadeUp, cardBase, panelBase }: FeaturesSectionProps) {
  return (
    <section id="features" aria-labelledby="features-title" className="mt-16">
      <motion.div {...viewFadeUp(0.02)} className="max-w-2xl">
        <h2 id="features-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          为速度而设计的核心功能
        </h2>
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
        ].map((f, idx) => (
          <motion.div key={f.title} {...viewFadeUp(0.02 + idx * 0.04)}>
            <Card className={'h-full ' + cardBase}>
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription className="leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={'h-10 w-10 flex items-center justify-center ' + panelBase}>
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
  );
}
