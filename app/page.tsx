'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme-toggle';

import HeroSection from '@/app/components/landing/HeroSection';
import SocialProofSection from '@/app/components/landing/SocialProofSection';
import FeaturesSection from '@/app/components/landing/FeaturesSection';
import ProcessSection from '@/app/components/landing/ProcessSection';
import PricingSection from '@/app/components/landing/PricingSection';
import TestimonialsSection from '@/app/components/landing/TestimonialsSection';
import FaqSection from '@/app/components/landing/FaqSection';
import CtaSection from '@/app/components/landing/CtaSection';

const SESSION_KEY = 'zenit:session:v1';

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const borderSoft = 'border-border/60';
  const cardBase = `bg-card/70 backdrop-blur ${borderSoft}`;
  const cardStrong = `bg-card/80 backdrop-blur border-primary/30`;
  const panelBase = `rounded-xl border ${borderSoft} bg-background/40`;
  const panelStrong = `rounded-xl border ${borderSoft} bg-background/50`;

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

  const viewFadeUp = (delay = 0) =>
    reduceMotion
      ? {
          initial: false as const,
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.38, delay },
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
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_18%_12%,rgba(139,92,246,0.16),transparent_55%),radial-gradient(900px_circle_at_82%_70%,rgba(59,130,246,0.10),transparent_55%)]" />

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
          <HeroSection
            fadeUp={fadeUp}
            reduceMotion={Boolean(reduceMotion)}
            cardBase={cardBase}
            panelBase={panelBase}
            panelStrong={panelStrong}
            onLogin={() => router.push('/login?next=/projects')}
            onProjects={() => router.push('/projects')}
          />

          <SocialProofSection viewFadeUp={viewFadeUp} />

          <FeaturesSection viewFadeUp={viewFadeUp} cardBase={cardBase} panelBase={panelBase} />

          <ProcessSection viewFadeUp={viewFadeUp} panelBase={panelBase} cardBase={cardBase} />

          <PricingSection
            viewFadeUp={viewFadeUp}
            cardBase={cardBase}
            cardStrong={cardStrong}
            onCta={() => router.push('/login?next=/projects')}
          />

          <TestimonialsSection viewFadeUp={viewFadeUp} cardBase={cardBase} />

          <FaqSection viewFadeUp={viewFadeUp} panelBase={panelBase} />

          <CtaSection
            viewFadeUp={viewFadeUp}
            cardBase={cardBase}
            onLogin={() => router.push('/login?next=/projects')}
            onProjects={() => router.push('/projects')}
          />

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
