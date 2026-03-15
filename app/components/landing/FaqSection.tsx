'use client';

import { motion } from 'framer-motion';

type MotionProps = Record<string, unknown>;

type FaqSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  panelBase: string;
};

export default function FaqSection({ viewFadeUp, panelBase }: FaqSectionProps) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mt-16">
      <div className="flex flex-col gap-4">
        <motion.div {...viewFadeUp(0.02)}>
          <h2 id="faq-title" className="text-2xl text-center sm:text-3xl font-semibold tracking-tight">
            常见问题
          </h2>
          <p className="mt-3 text-center text-muted-foreground leading-relaxed">
            如果你想把它真正做成一个商业化 SaaS，我也可以帮你补齐注册、计费、订阅与控制台信息架构。
          </p>
        </motion.div>

        <motion.div {...viewFadeUp(0.06)} className="space-y-3">
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
            <details key={x.q} className={'group px-4 py-3 ' + panelBase}>
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
  );
}
