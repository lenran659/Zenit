'use client';

import { Search, Command } from 'lucide-react';
import { useState } from 'react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');

  const searchResults = [
    { type: '任务', title: '设计系统架构', subtitle: 'in-progress' },
    { type: '任务', title: '实现用户认证', subtitle: 'todo' },
    { type: '命令', title: '创建新任务', subtitle: 'Ctrl+N' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-zinc-900/95 backdrop-blur-xl border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="搜索任务、项目或命令..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
            autoFocus
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            <Command size={12} />
            <span>K</span>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
              <div className="flex-1">
                <div className="text-sm text-white">{result.title}</div>
                <div className="text-xs text-slate-500">{result.type} · {result.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
