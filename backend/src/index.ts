import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

import { db, projects, users, issues } from './db';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

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

// MVP: ensure a default user exists
async function ensureDefaultUser() {
  const defaultUserId = 'user_alice';
  const existing = await db.query.users.findFirst({ where: eq(users.id, defaultUserId) });
  if (!existing) {
    const t = nowIso();
    await db.insert(users).values({
      id: defaultUserId,
      name: 'Alice',
      email: 'alice@zenit.dev',
      createdAt: new Date(t),
      updatedAt: new Date(t),
    });
  }
}

app.get('/api/projects', async (_req, res) => {
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt));
  res.json(
    rows.map((p) => ({
      ...p,
      memberIds: safeParseJsonArray(p.memberIds),
    }))
  );
});

app.post('/api/projects', async (req, res) => {
  const bodySchema = z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional().default(''),
  });
  const body = bodySchema.parse(req.body);

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
  res.status(201).json({
    ...p,
    memberIds: safeParseJsonArray(p.memberIds),
  });
});

app.get('/api/projects/:projectId/issues', async (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) return res.status(400).json({ error: 'invalid projectId' });

  const rows = await db
    .select()
    .from(issues)
    .where(eq(issues.projectId, projectId))
    .orderBy(desc(issues.updatedAt));

  res.json(
    rows.map((i) => ({
      ...i,
      watcherIds: safeParseJsonArray(i.watcherIds),
    }))
  );
});

app.post('/api/projects/:projectId/issues', async (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) return res.status(400).json({ error: 'invalid projectId' });

  const bodySchema = z.object({
    title: z.string().min(1),
    descriptionMarkdown: z.string().optional().default(''),
    type: z.enum(['issue', 'bug']).optional().default('issue'),
    status: z.enum(['backlog', 'todo', 'in_progress', 'done']).optional().default('todo'),
    priority: z.enum(['urgent', 'high', 'medium', 'low']).optional().default('medium'),
    assigneeId: z.string().optional(),
    watcherIds: z.array(z.string()).optional().default([]),
  });
  const body = bodySchema.parse(req.body);

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
  res.status(201).json({
    ...i,
    watcherIds: safeParseJsonArray(i.watcherIds),
  });
});

app.patch('/api/issues/:id', async (req, res) => {
  const issueId = req.params.id;
  if (!issueId) return res.status(400).json({ error: 'invalid issueId' });

  const bodySchema = z.object({
    status: z.enum(['backlog', 'todo', 'in_progress', 'done']),
  });
  const body = bodySchema.parse(req.body);

  const t = nowIso();

  const row = await db
    .update(issues)
    .set({
      status: body.status,
      updatedAt: new Date(t),
    })
    .where(eq(issues.id, issueId))
    .returning();

  const updated = row[0];
  if (!updated) return res.status(404).json({ error: 'issue not found' });

  res.json({
    ...updated,
    watcherIds: safeParseJsonArray(updated.watcherIds),
  });
});

const port = Number(process.env.PORT || 3001);

(async () => {
  await ensureDefaultUser();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Zenit backend listening on :${port}`);
  });
})();
