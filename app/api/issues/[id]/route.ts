import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
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

export async function PATCH(req: Request, context: { params: { id: string } }) {
  await ensureDefaultUser();
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: 'invalid issueId' }, { status: 400 });

  const bodySchema = z.object({
    status: z.enum(['backlog', 'todo', 'in_progress', 'done']),
  });

  const raw = (await req.json()) as unknown;
  const body = bodySchema.parse(raw);

  const t = nowIso();

  const row = await db
    .update(issues)
    .set({
      status: body.status,
      updatedAt: new Date(t),
    })
    .where(eq(issues.id, id))
    .returning();

  const updated = row[0];
  if (!updated) return NextResponse.json({ error: 'issue not found' }, { status: 404 });

  return NextResponse.json({
    ...updated,
    watcherIds: safeParseJsonArray(updated.watcherIds),
  });
}
