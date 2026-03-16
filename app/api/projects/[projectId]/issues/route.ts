import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db, issues, ensureDefaultUser } from '@/lib/db/mvp';

function safeParseJsonArray(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === 'string') as string[];
  } catch {
    return [];
  }
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export async function GET(_req: Request, context: { params: { projectId: string } }) {
  await ensureDefaultUser();
  const { projectId } = context.params;
  if (!projectId) return NextResponse.json({ error: 'invalid projectId' }, { status: 400 });

  const rows = await db
    .select()
    .from(issues)
    .where(eq(issues.projectId, projectId))
    .orderBy(desc(issues.updatedAt));

  return NextResponse.json(
    rows.map((i) => ({
      ...i,
      watcherIds: safeParseJsonArray(i.watcherIds),
    }))
  );
}

export async function POST(req: Request, context: { params: { projectId: string } }) {
  await ensureDefaultUser();
  const { projectId } = context.params;
  if (!projectId) return NextResponse.json({ error: 'invalid projectId' }, { status: 400 });

  const bodySchema = z.object({
    title: z.string().min(1),
    descriptionMarkdown: z.string().optional().default(''),
    type: z.enum(['issue', 'bug']).optional().default('issue'),
    status: z.enum(['backlog', 'todo', 'in_progress', 'done']).optional().default('todo'),
    priority: z.enum(['urgent', 'high', 'medium', 'low']).optional().default('medium'),
    assigneeId: z.string().optional(),
    watcherIds: z.array(z.string()).optional().default([]),
  });

  const raw = (await req.json()) as unknown;
  const body = bodySchema.parse(raw);

  const t = nowIso();
  const issueId = createId('iss');

  const row = await db
    .insert(issues)
    .values({
      id: issueId,
      projectId,
      title: body.title,
      descriptionMarkdown: body.descriptionMarkdown,
      type: body.type,
      status: body.status,
      priority: body.priority,
      assigneeId: body.assigneeId,
      watcherIds: JSON.stringify(body.watcherIds ?? []),
      creatorId: 'user_alice',
      createdAt: new Date(t),
      updatedAt: new Date(t),
    })
    .returning();

  const i = row[0];
  return NextResponse.json(
    {
      ...i,
      watcherIds: safeParseJsonArray(i.watcherIds),
    },
    { status: 201 }
  );
}
