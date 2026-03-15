'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type MotionProps = Record<string, unknown>;

type CtaSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  cardBase: string;
  onLogin: () => void;
  onProjects: () => void;
};

export default function CtaSection({ viewFadeUp, cardBase, onLogin, onProjects }: CtaSectionProps) {
  return (
    <section id="cta" aria-labelledby="cta-title" className="mt-16">
      <motion.div {...viewFadeUp(0.02)}>
        <Card className={cardBase}>
          <CardContent className="py-10 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs text-muted-foreground">准备开始了吗？</div>
                <div id="cta-title" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                  让团队回到交付本身
                </div>
                <div className="mt-3 text-muted-foreground leading-relaxed">
                  现在就进入项目页，或登录后开始你的第一个项目空间。
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <Button onClick={onLogin}>创建/登录</Button>
                <Button variant="secondary" onClick={onProjects}>
                  直接进入项目
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
