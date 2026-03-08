'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const SESSION_KEY = 'zenit:session:v1';

export default function AppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      const parsed = raw ? (JSON.parse(raw) as { userId?: string }) : null;
      if (!parsed?.userId) {
        const next = encodeURIComponent(pathname || '/projects');
        router.replace(`/login?next=${next}`);
        return;
      }
      setReady(true);
    } catch {
      router.replace('/login');
    }
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
