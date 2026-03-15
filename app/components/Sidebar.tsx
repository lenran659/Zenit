"use client";

import {
  Home,
  Circle,
  LayoutDashboard,
  MessageSquareText,
  Search,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { motion, useReducedMotion } from "framer-motion";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  type ChatSession = {
    id: string;
    title: string;
    updatedAt: number;
  };

  const SESSIONS_KEY = "zenit:chat:sessions:v1";
  const CHAT_CHANGED_EVENT = "zenit:chat:changed";
  const activeChatId = searchParams.get("c");

  const [query, setQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    try {
      const key = "zenit:node_id:v1";

      const created = `node_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
      window.localStorage.setItem(key, created);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const readSessions = () => {
      try {
        const raw = window.localStorage.getItem(SESSIONS_KEY);
        const parsed = raw ? (JSON.parse(raw) as ChatSession[]) : [];
        const safe = Array.isArray(parsed) ? parsed : [];
        safe.sort((a, b) => (b?.updatedAt ?? 0) - (a?.updatedAt ?? 0));
        setChatSessions(safe);
      } catch {
        setChatSessions([]);
      }
    };

    readSessions();
    window.addEventListener(CHAT_CHANGED_EVENT, readSessions);
    return () => window.removeEventListener(CHAT_CHANGED_EVENT, readSessions);
  }, []);

  const clearChatHistory = () => {
    try {
      const raw = window.localStorage.getItem(SESSIONS_KEY);
      const sessions = raw ? (JSON.parse(raw) as ChatSession[]) : [];
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (s?.id) {
            window.localStorage.removeItem(`zenit:chat:messages:${s.id}:v1`);
          }
        }
      }
      window.localStorage.removeItem(SESSIONS_KEY);
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(new Event(CHAT_CHANGED_EVENT));
    } catch {
      // ignore
    }
  };

  const filteredChatSessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chatSessions;
    return chatSessions.filter((s) => (s.title || "").toLowerCase().includes(q));
  }, [chatSessions, query]);

  const consoleItems = [
    { icon: LayoutDashboard, label: "控制台", href: "/dashboard" },
  ];

  const projectItems = [
    { icon: Home, label: "项目", href: "/projects" },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-background/80 backdrop-blur-xl border-r border-border z-50"
      animate={{ width: collapsed ? 64 : 256 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 30 }
      }
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-semibold text-foreground">Zenit</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-accent rounded transition-colors"
          >
            <div className="w-4 h-0.5 bg-muted-foreground mb-1"></div>
            <div className="w-4 h-0.5 bg-muted-foreground"></div>
          </button>
        </div>

        {/* Top Actions */}
        <div className={collapsed ? "mb-3 flex flex-col gap-2" : "mb-3 flex items-center justify-between gap-2"}>
          <button
            onClick={() => router.push("/chat")}
            className="p-2 w-full justify-between flex items-center hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
            title="新对话"
          >
            <span>新建对话</span>
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border">
              <Search size={16} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索"
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              {!collapsed && <div className="px-3 text-xs text-muted-foreground">控制台</div>}
              <div className="space-y-1">
                {consoleItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all ${pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {!collapsed && <div className="px-3 text-xs text-muted-foreground">项目</div>}
              <div className="space-y-1">
                {projectItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all ${pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {!collapsed && <div className="px-3 text-xs text-muted-foreground">聊天</div>}
              <div className="space-y-1">
                {filteredChatSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/chat?c=${encodeURIComponent(s.id)}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all ${activeChatId === s.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    title={s.title}
                  >
                    <MessageSquareText size={18} />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{s.title || "新对话"}</span>
                    )}
                  </button>
                ))}

                {filteredChatSessions.length === 0 && !collapsed && (
                  <div className="px-3 py-2 text-xs text-muted-foreground/80">暂无历史</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`mt-auto pt-4 border-t border-border ${collapsed ? "flex justify-center" : ""}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Circle size={8} className="fill-green-500 text-green-500" />
              {!collapsed && (
                <div className="text-xs">
                  <div className="text-muted-foreground/70">自托管</div>
                </div>
              )}
            </div>
            <div className={collapsed ? "flex items-center gap-1" : "flex items-center gap-1"}>
              <ThemeToggle />
              <button
                onClick={clearChatHistory}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
                title="清空历史对话"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
                title="设置"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
