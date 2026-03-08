'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '../components/LoginPage';

const SESSION_KEY = 'zenit:session:v1';

export default function LoginRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      const parsed = raw ? (JSON.parse(raw) as { userId?: string }) : null;
      if (parsed?.userId) {
        const next = searchParams.get('next') || '/projects';
        router.replace(next);
      }
    } catch {
      // ignore
    }
  }, [router, searchParams]);

  return (
    <LoginPage
      onLoginSuccess={(userId) => {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
        const next = searchParams.get('next') || '/projects';
        router.replace(next);
      }}
    />
  );
}
