'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

export default function GlobalSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isL = e.key.toLowerCase() === 'l';
      if ((e.metaKey || e.ctrlKey) && isL) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="全局搜索：项目、任务、命令..."
        className="h-10 pl-9 pr-20"
      />
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <Kbd className="hidden sm:inline-flex">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
        <Kbd className="hidden sm:inline-flex">L</Kbd>
      </div>
    </div>
  );
}
