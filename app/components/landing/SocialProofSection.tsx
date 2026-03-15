'use client';

import { motion } from 'framer-motion';

type MotionProps = Record<string, unknown>;

type SocialProofSectionProps = {
  viewFadeUp: (delay?: number) => MotionProps;
};

export default function SocialProofSection({ viewFadeUp }: SocialProofSectionProps) {
  return (
    <section id="social-proof" aria-labelledby="social-proof-title" className="mt-14">
      <motion.div {...viewFadeUp(0)} className="text-center">
        <div id="social-proof-title" className="text-xs text-muted-foreground">
          TRUSTED BY LEADING TEAMS
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {['Microsoft', 'Amazon', 'Netflix', 'YouTube', 'Instagram', 'Uber', 'Spotify', 'Google'].map((t) => (
            <div key={t} className="opacity-70 hover:opacity-100 transition-opacity">
              {t}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
