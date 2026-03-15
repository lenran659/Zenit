'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, User as UserIcon, Trash2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
};

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const SESSIONS_KEY = 'zenit:chat:sessions:v1';
const CHAT_CHANGED_EVENT = 'zenit:chat:changed';

function messagesKey(sessionId: string) {
  return `zenit:chat:messages:${sessionId}:v1`;
}

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function readSessions(): ChatSession[] {
  const sessions = safeReadJson<ChatSession[]>(SESSIONS_KEY, []);
  return Array.isArray(sessions) ? sessions : [];
}

function writeSessions(sessions: ChatSession[]) {
  safeWriteJson(SESSIONS_KEY, sessions);
  try {
    window.dispatchEvent(new Event(CHAT_CHANGED_EVENT));
  } catch {
    // ignore
  }
}

function readMessages(sessionId: string): ChatMessage[] {
  const msgs = safeReadJson<ChatMessage[]>(messagesKey(sessionId), []);
  return Array.isArray(msgs) ? msgs : [];
}

function writeMessages(sessionId: string, messages: ChatMessage[]) {
  safeWriteJson(messagesKey(sessionId), messages);
  try {
    window.dispatchEvent(new Event(CHAT_CHANGED_EVENT));
  } catch {
    // ignore
  }
}

function mockAssistantReply(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return '我在，请输入你的问题。';

  return [
    '我先复述一下你的问题：',
    trimmed,
    '',
    '我的建议：',
    '- 先把目标拆成 2-3 个可执行步骤',
    '- 明确约束（时间/技术栈/现有代码）',
    '- 如果你把相关文件贴出来，我可以更精准地给出修改建议',
  ].join('\n');
}

export default function ChatRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromUrl = searchParams.get('c');

  const initialMessages = useMemo<ChatMessage[]>(
    () => [],
    []
  );

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const ensureSession = useMemo(() => {
    return (requestedId: string | null) => {
      const sessions = readSessions();

      if (requestedId) {
        const existing = sessions.find((s) => s.id === requestedId);
        if (existing) return existing;
      }

      const newest = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (newest) return newest;

      const created: ChatSession = {
        id: createId('chat'),
        title: '新对话',
        updatedAt: Date.now(),
      };
      writeSessions([created]);
      writeMessages(created.id, initialMessages);
      return created;
    };
  }, [initialMessages]);

  useEffect(() => {
    const session = ensureSession(sessionIdFromUrl);
    setActiveSessionId(session.id);
    const loaded = readMessages(session.id);
    setMessages(loaded.length ? loaded : initialMessages);

    if (sessionIdFromUrl !== session.id) {
      router.replace(`/chat?c=${encodeURIComponent(session.id)}`);
    }
  }, [ensureSession, initialMessages, router, sessionIdFromUrl]);

  useEffect(() => {
    const onChanged = () => {
      const currentId = sessionIdFromUrl;
      const sessions = readSessions();
      const exists = currentId ? sessions.some((s) => s.id === currentId) : false;

      if (!currentId || !exists) {
        const session = ensureSession(null);
        setActiveSessionId(session.id);
        const loaded = readMessages(session.id);
        setMessages(loaded.length ? loaded : initialMessages);
        router.replace(`/chat?c=${encodeURIComponent(session.id)}`);
        return;
      }

      const loaded = readMessages(currentId);
      setActiveSessionId(currentId);
      setMessages(loaded.length ? loaded : initialMessages);
    };

    window.addEventListener(CHAT_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(CHAT_CHANGED_EVENT, onChanged);
  }, [ensureSession, initialMessages, router, sessionIdFromUrl]);

  const send = async () => {
    if (!canSend) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: createId('msg'),
      role: 'user',
      content: userText,
      createdAt: Date.now(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      if (activeSessionId) writeMessages(activeSessionId, next);
      return next;
    });
    setSending(true);

    if (activeSessionId) {
      const now = Date.now();
      const sessions = readSessions();
      const idx = sessions.findIndex((s) => s.id === activeSessionId);

      const currentTitle = sessions[idx]?.title ?? '新对话';
      const nextTitle =
        currentTitle === '新对话' ? userText.slice(0, 20) || '新对话' : currentTitle;

      if (idx >= 0) {
        const updated = [...sessions];
        updated[idx] = { ...updated[idx], updatedAt: now, title: nextTitle };
        writeSessions(updated);
      } else {
        writeSessions([
          { id: activeSessionId, title: nextTitle, updatedAt: now },
          ...sessions,
        ]);
      }
    }

    try {
      await new Promise((r) => setTimeout(r, 450));

      const assistantMsg: ChatMessage = {
        id: createId('msg'),
        role: 'assistant',
        content: mockAssistantReply(userText),
        createdAt: Date.now(),
      };

      setMessages((prev) => {
        const next = [...prev, assistantMsg];
        if (activeSessionId) writeMessages(activeSessionId, next);
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  const newChat = () => {
    const created: ChatSession = {
      id: createId('chat'),
      title: '新对话',
      updatedAt: Date.now(),
    };

    const sessions = readSessions();
    writeSessions([created, ...sessions]);
    writeMessages(created.id, initialMessages);

    setActiveSessionId(created.id);
    setMessages(initialMessages);
    setInput('');
    setSending(false);
    router.replace(`/chat?c=${encodeURIComponent(created.id)}`);
    queueMicrotask(() => composerRef.current?.focus());
  };

  const clearMessages = () => {
    setMessages(() => {
      const next: ChatMessage[] = [];
      if (activeSessionId) writeMessages(activeSessionId, next);
      return next;
    });
    queueMicrotask(() => composerRef.current?.focus());
  };

  const composer = (
    <Card className="relative overflow-hidden">
      <BorderBeam size={80} duration={7} />
      <CardContent className="py-4">
        <div className="flex gap-3 items-end">
          <Textarea
            ref={composerRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="像 ChatGPT 一样输入问题…（Shift+Enter 换行，Enter 发送）"
            className="min-h-[56px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />

          <Button type="button" onClick={() => void send()} disabled={!canSend} className="shrink-0">
            <Send size={16} />
            发送
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          提示：接入真实 AI API 时，把 `mockAssistantReply` 替换为你的请求即可。
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        <div ref={listRef} className="h-full overflow-auto">
          {messages.length === 0 ? (
            <div className="min-h-full flex items-center justify-center px-8 py-16">
              <div className="max-w-3xl w-full">
                <div className="text-3xl font-semibold tracking-tight text-center">有什么我能帮你的吗？</div>
                <div className="mt-10">{composer}</div>
              </div>
            </div>
          ) : (
            <div className="pb-44">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <section
                    key={m.id}
                    className={cn(
                      'border-b border-border/60',
                      isUser ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    <div className="px-8 py-6">
                      <div className="max-w-3xl mx-auto flex gap-4">
                        <div
                          className={cn(
                            'h-8 w-8 shrink-0 rounded-full flex items-center justify-center',
                            isUser
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {isUser ? <UserIcon size={16} /> : <Bot size={16} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="pointer-events-none sticky bottom-0 left-0 right-0">
            <div className="px-8 pb-6 pt-4 bg-linear-to-t from-background via-background/90 to-transparent">
              <div className="max-w-3xl mx-auto pointer-events-auto">{composer}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
