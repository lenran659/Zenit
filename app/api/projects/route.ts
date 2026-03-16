import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { z } from 'zod';

import { db, projects, ensureDefaultUser } from '@/lib/db/mvp';

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

export async function GET() {
  await ensureDefaultUser();
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt));
  return NextResponse.json(
    rows.map((p) => ({
      ...p,
      memberIds: safeParseJsonArray(p.memberIds),
    }))
  );
}

export async function POST(req: Request) {
  await ensureDefaultUser();

  const bodySchema = z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional().default(''),
  });

  const raw = (await req.json()) as unknown;
  const body = bodySchema.parse(raw);

  const ownerId = 'user_alice';
  const t = nowIso();
  const projectId = createId('proj');

  const row = await db
    .insert(projects)
    .values({
      id: projectId,
      key: body.key.trim().toUpperCase(),
      name: body.name,
      description: body.description ?? '',
      ownerId,
      memberIds: JSON.stringify([ownerId]),
      createdAt: new Date(t),
      updatedAt: new Date(t),
    })
    .returning();

  const p = row[0];
  return NextResponse.json(
    {
      ...p,
      memberIds: safeParseJsonArray(p.memberIds),
    },
    { status: 201 }
  );
}
