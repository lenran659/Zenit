'use client';

import { motion } from 'framer-motion';

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { CalendarDays, ShieldCheck, Workflow } from 'lucide-react';

type MotionProps = Record<string, unknown>;

type FeaturesSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  cardBase: string;
  panelBase: string;
};

export default function FeaturesSection({ viewFadeUp, cardBase, panelBase }: FeaturesSectionProps) {
  const items = [
    {
      name: 'Issue 到交付，一条线走到底',
      description: '从收集、拆分、排期到验收，全程可追踪，减少跨工具切换。',
      Icon: Workflow,
      href: '/projects',
      cta: '开始使用',
      className: 'md:col-span-1',
      background: (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      ),
    },
    {
      name: '看板与时间线同步',
      description: '拖拽调整节奏，时间线自动对齐，让计划成为可执行的节奏表。',
      Icon: CalendarDays,
      href: '/projects',
      cta: '查看项目',
      className: 'md:col-span-1',
      background: (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.primary/0.12),transparent_55%)]" />
      ),
    },
    {
      name: '极简权限与空间',
      description: '项目空间天然隔离，避免“一个工作区装下全公司”的混乱。',
      Icon: ShieldCheck,
      href: '/projects',
      cta: '进入控制台',
      className: 'md:col-span-1',
      background: (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-primary/10" />
      ),
    },
  ];

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

      <BentoGrid className="mt-8 grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div key={item.name} {...viewFadeUp(0.02 + idx * 0.04)} className="h-full">
            <BentoCard
              name={item.name}
              description={item.description}
              Icon={item.Icon}
              href={item.href}
              cta={item.cta}
              background={
                <div className={'relative h-full w-full ' + panelBase + ' ' + cardBase}>
                  {item.background}
                </div>
              }
              className={item.className}
            />
          </motion.div>
        ))}
      </BentoGrid>
    </section>
  );
}
