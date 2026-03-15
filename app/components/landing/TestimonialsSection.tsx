'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Marquee } from '@/components/ui/marquee';

type MotionProps = Record<string, unknown>;

type TestimonialsSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
  cardBase: string;
};

export default function TestimonialsSection({ viewFadeUp, cardBase }: TestimonialsSectionProps) {
  const reviews = [
    {
      name: 'Wendy',
      username: '@wendy',
      body: '终于不用在十几个工具里来回找信息，讨论和交付变得连贯了。',
      img: 'https://avatar.vercel.sh/wendy',
    },
    {
      name: 'Leo',
      username: '@leo',
      body: '看板 + 时间线一起用，排期不用再靠脑补，团队节奏更稳。',
      img: 'https://avatar.vercel.sh/leo',
    },
    {
      name: 'Mina',
      username: '@mina',
      body: '界面干净，动作很少，但恰好覆盖了我们日常 80% 的协作。',
      img: 'https://avatar.vercel.sh/mina',
    },
    {
      name: 'Howard',
      username: '@howard',
      body: '统一的节奏让交付变得可预测，开会也少了很多。',
      img: 'https://avatar.vercel.sh/howard',
    },
    {
      name: 'Iris',
      username: '@iris',
      body: '从 Issue 到验收一条线跑通，感觉团队终于在同一个系统里协作。',
      img: 'https://avatar.vercel.sh/iris',
    },
    {
      name: 'Noah',
      username: '@noah',
      body: '默认流程足够清晰，大家都知道下一步做什么，效率提升很明显。',
      img: 'https://avatar.vercel.sh/noah',
    },
  ];

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  const ReviewCard = ({
    img,
    name,
    username,
    body,
  }: {
    img: string;
    name: string;
    username: string;
    body: string;
  }) => {
    return (
      <figure
        className={cn(
          'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
          cardBase
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="32" height="32" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium">{name}</figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm text-muted-foreground">{body}</blockquote>
      </figure>
    );
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="mt-16">
      <motion.div {...viewFadeUp(0.02)} className="text-center">
        <h2 id="testimonials-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          用户怎么说
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">“少即是多”在协作里不是口号，而是每天更少的打断。</p>
      </motion.div>

      <motion.div {...viewFadeUp(0.06)} className="mt-8">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
        </div>
      </motion.div>
    </section>
  );
}
