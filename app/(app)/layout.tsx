'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CommandPalette from '../components/CommandPalette';
import AppGate from '../components/AppGate';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AppGate>
      <div className="flex min-h-screen bg-zinc-900">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {children}
        </div>
        <CommandPalette />
      </div>
    </AppGate>
  );
}
