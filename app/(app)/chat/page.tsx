'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, User as UserIcon, Trash2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
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
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: createId('msg'),
        role: 'assistant',
        content: '你好！我是 Zenit AI。把你的需求/报错/代码片段发我，我来帮你分析并给出修改方案。',
        createdAt: Date.now(),
      },
    ],
    []
  );

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

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      await new Promise((r) => setTimeout(r, 450));

      const assistantMsg: ChatMessage = {
        id: createId('msg'),
        role: 'assistant',
        content: mockAssistantReply(userText),
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setSending(false);
    }
  };

  const newChat = () => {
    setMessages(initialMessages);
    setInput('');
    setSending(false);
    queueMicrotask(() => composerRef.current?.focus());
  };

  const clearMessages = () => {
    setMessages([]);
    queueMicrotask(() => composerRef.current?.focus());
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">AI 对话</h1>
            <p className="text-muted-foreground text-sm truncate">像 ChatGPT 一样的对话体验（MVP）</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="secondary" onClick={newChat}>
              <Plus size={16} />
              新对话
            </Button>
            <Button type="button" variant="outline" onClick={clearMessages}>
              <Trash2 size={16} />
              清空
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div ref={listRef} className="h-full overflow-auto">
          {messages.length === 0 ? (
            <div className="px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="rounded-lg border border-border bg-background/40 p-6">
                  <div className="flex items-center gap-2 font-medium">
                    <Bot size={18} className="text-primary" />
                    开始一个新对话
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    试试：
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        '帮我把这个报错定位并修复',
                        '把这个功能拆成 3 个里程碑',
                        '给我一份 PR 的改动清单',
                        '把这段代码重构得更可维护',
                      ].map((t) => (
                        <button
                          key={t}
                          className="text-left rounded-md border border-border px-3 py-2 hover:bg-muted/30 text-sm"
                          onClick={() => {
                            setInput(t);
                            queueMicrotask(() => composerRef.current?.focus());
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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

        <div className="pointer-events-none fixed bottom-0 left-0 right-0">
          <div className="px-8 pb-6 pt-4 bg-linear-to-t from-background via-background/90 to-transparent">
            <div className="max-w-3xl mx-auto pointer-events-auto">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
