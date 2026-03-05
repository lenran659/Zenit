'use client';

import { Home, CheckSquare, BarChart3, Settings, Circle } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ currentPage, onPageChange, collapsed, setCollapsed }: SidebarProps) {
  const navItems = [
    { icon: Home, label: '首页', page: 'home' },
    { icon: CheckSquare, label: '任务', page: 'tasks' },
    { icon: BarChart3, label: '分析', page: 'analytics' },
    { icon: Settings, label: '设置', page: 'settings' },
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
              onClick={() => onPageChange(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                currentPage === item.page
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
                <div className="text-slate-400">Node 01</div>
                <div className="text-slate-500">自托管</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
