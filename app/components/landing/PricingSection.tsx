'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MotionProps = Record<string, unknown>;

type PricingSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  cardBase: string;
  cardStrong: string;
  onCta: () => void;
};

export default function PricingSection({ viewFadeUp, cardBase, cardStrong, onCta }: PricingSectionProps) {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="mt-16">
      <motion.div {...viewFadeUp(0.02)} className="text-center">
        <h2 id="pricing-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          清晰的定价，按团队成长
        </h2>
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
          <motion.div key={p.name} {...viewFadeUp(0.02 + idx * 0.04)}>
            <Card className={p.highlight ? `h-full ${cardStrong}` : `h-full ${cardBase}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{p.name}</span>
                  {p.highlight ? (
                    <span className="rounded-full bg-foreground text-background px-2 py-0.5 text-xs">推荐</span>
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
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant={p.cta.variant} onClick={onCta}>
                  {p.cta.label}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">以上价格为示例文案，可按你的实际商业模式调整。</div>
    </section>
  );
}
