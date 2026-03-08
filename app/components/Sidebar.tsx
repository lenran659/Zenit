'use client';

import { Home, Settings, Circle } from 'lucide-react';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const nodeId = useMemo(() => {
    if (typeof window === 'undefined') return 'node_unknown';
    const key = 'zenit:node_id:v1';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = `node_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
    window.localStorage.setItem(key, created);
    return created;
  }, []);

  const navItems = [
    { icon: Home, label: '项目', href: '/projects' },
    { icon: Settings, label: '设置', href: '/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-zinc-900/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-semibold text-white">Zenit</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
          >
            <div className="w-4 h-0.5 bg-slate-400 mb-1"></div>
            <div className="w-4 h-0.5 bg-slate-400"></div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Status Indicator */}
        <div className={`mt-auto pt-4 border-t border-slate-800 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2">
            <Circle size={8} className="fill-green-500 text-green-500" />
            {!collapsed && (
              <div className="text-xs">
                <div className="text-slate-400">{nodeId}</div>
                <div className="text-slate-500">自托管</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
