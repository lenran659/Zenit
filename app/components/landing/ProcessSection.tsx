'use client';

import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MotionProps = Record<string, unknown>;

type ProcessSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  panelBase: string;
  cardBase: string;
};

export default function ProcessSection({ viewFadeUp, panelBase, cardBase }: ProcessSectionProps) {
  return (
    <section id="process" aria-labelledby="process-title" className="mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.div {...viewFadeUp(0.02)}>
          <h2 id="process-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">
            把流程固化成默认动作
          </h2>
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
              <div key={x.k} className={'px-4 py-3 ' + panelBase}>
                <div className="text-sm font-medium">{x.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...viewFadeUp(0.06)}>
          <Card className={cardBase}>
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
                  <div key={s.step} className={'flex gap-3 px-4 py-3 ' + panelBase}>
                    <div className="w-10 shrink-0 text-sm font-semibold text-muted-foreground">{s.step}</div>
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
  );
}
