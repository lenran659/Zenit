'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">亮</span>
      <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
      <span className="text-xs text-muted-foreground">暗</span>
    </div>
  );
}
